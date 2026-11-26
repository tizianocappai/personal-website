// Bilingual site: English at the root, Italian under /it/, linked to each other on every page.
import { describe, expect, it } from "vitest";
import { allPages, page } from "./site";
import { siteData } from "../src/data/site";

const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsIt = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

describe("Italian homepage", () => {
  const home = page("/it/");

  it("is served at /it/ in Italian", () => {
    expect(home.doc.querySelector("html")?.getAttribute("lang")).toBe("it");
    expect(home.doc.querySelector("main")?.text).toContain("Roma");
  });

  it("keeps the job title in English", () => {
    expect(home.doc.querySelector("h1")?.text.trim()).toBe("Tiziano Cappai, Senior Frontend Developer");
  });

  it("mirrors the English link list, saying the CV is in English", () => {
    const items = home.doc.querySelectorAll("main li").map((li) => li.text.trim());
    expect(items).toEqual(["Progetti", "Carriera", "CV (PDF, in inglese)", "LinkedIn", "GitHub", "Email"]);
  });

  it("links to the same contacts as the English homepage", () => {
    const hrefs = (route: string) =>
      page(route)
        .doc.querySelectorAll("main a")
        .map((a) => a.getAttribute("href"))
        // Only external/contact links are compared: site pages (and the CV PDF) are served by the site itself.
        .filter((href) => !href?.startsWith("/"));
    expect(hrefs("/it/")).toEqual(hrefs("/"));
  });
});

const site = "https://tizianocappai-website.vercel.app";
const isNoindex = (p: ReturnType<typeof allPages>[number]) =>
  p.doc.querySelector('meta[name="robots"]')?.getAttribute("content")?.includes("noindex") ?? false;
// Every page with its own URL; the not-found page is checked separately (tests/not-found.test.ts).
const pages = allPages().filter((p) => !isNoindex(p));
const builtRoutes = new Set(allPages().map((p) => p.route));
const routeOf = (url: string | undefined) => (url?.startsWith(site) ? url.slice(site.length) : undefined);
const alternate = (p: (typeof pages)[number], lang: string) =>
  p.doc.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)?.getAttribute("href");
const langOf = (route: string) => (route.startsWith("/it/") ? "it" : "en");
const otherLang = (lang: string) => (lang === "it" ? "en" : "it");

describe("site pairs", () => {
  it("keeps only the not-found page out of the index", () => {
    expect(allPages().filter(isNoindex).map((p) => p.route)).toEqual(["/404.html"]);
  });

  it("builds every English page in Italian too, and vice versa", () => {
    const en = pages.filter((p) => langOf(p.route) === "en").map((p) => p.route);
    const it_ = pages.filter((p) => langOf(p.route) === "it").map((p) => p.route.slice("/it".length));
    expect(it_.sort()).toEqual(en.sort());
  });
});

describe.each(pages.map((p) => [p.route, p] as const))("page %s", (route, p) => {
  it("has a canonical URL pointing to itself", () => {
    const canonicals = p.doc.querySelectorAll('link[rel="canonical"]');
    expect(canonicals).toHaveLength(1);
    expect(canonicals[0].getAttribute("href")).toBe(`${site}${route}`);
  });

  it("has hreflang alternates en, it and x-default pointing to existing pages", () => {
    const langs = p.doc.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => l.getAttribute("hreflang"));
    expect(langs.sort()).toEqual(["en", "it", "x-default"]);
    for (const lang of ["en", "it", "x-default"]) {
      expect(builtRoutes).toContain(routeOf(alternate(p, lang)));
    }
  });

  it("lists itself as its own language alternate, and English as x-default", () => {
    expect(alternate(p, langOf(route))).toBe(`${site}${route}`);
    expect(alternate(p, "x-default")).toBe(alternate(p, "en"));
    expect(langOf(routeOf(alternate(p, "it"))!)).toBe("it");
    expect(langOf(routeOf(alternate(p, "en"))!)).toBe("en");
  });

  it("links from the footer to its equivalent page in the other language", () => {
    const target = otherLang(langOf(route));
    const links = p.doc.querySelectorAll(`footer a[hreflang="${target}"]`);
    expect(links).toHaveLength(1);
    const href = links[0].getAttribute("href")!;
    expect(builtRoutes).toContain(href);
    expect(`${site}${href}`).toBe(alternate(p, target));
    expect(links[0].getAttribute("lang")).toBe(target);
    expect(links[0].text.trim()).toBe(target === "it" ? "Italiano" : "English");
  });

  it("shows when the content was last updated (siteData.lastUpdated), in the page's language", () => {
    const footer = p.doc.querySelector("footer")?.text ?? "";
    const [year, month] = siteData.lastUpdated.split("-").map(Number);
    const expected =
      langOf(route) === "it"
        ? `Ultimo aggiornamento: ${monthsIt[month - 1]} ${year}`
        : `Last updated: ${monthsEn[month - 1]} ${year}`;
    expect(footer).toContain(expected);
  });

  it("does not redirect elsewhere", () => {
    expect(p.doc.querySelector('meta[http-equiv="refresh" i]')).toBeNull();
  });
});

describe("hosting config", () => {
  it("has no Accept-Language based redirect", async () => {
    const { readFile } = await import("node:fs/promises");
    const vercel = await readFile(new URL("../vercel.json", import.meta.url), "utf8");
    expect(vercel.toLowerCase()).not.toContain("accept-language");
  });
});

describe("English homepage", () => {
  it("is still served at the root in English", () => {
    expect(page("/").doc.querySelector("html")?.getAttribute("lang")).toBe("en");
  });
});
