// The Projects page, in English (/projects/) and Italian (/it/projects/), as a hiring manager sees it.
import { describe, expect, it } from "vitest";
import { page } from "./site";

const cases = [
  { lang: "en", home: "/", route: "/projects/", linkText: "Projects" },
  { lang: "it", home: "/it/", route: "/it/projects/", linkText: "Progetti" },
] as const;

describe.each(cases)("Projects page ($lang)", ({ lang, home, route, linkText }) => {
  const projects = page(route);
  const main = projects.doc.querySelector("main")!;

  it("is served in its language", () => {
    expect(projects.doc.querySelector("html")?.getAttribute("lang")).toBe(lang);
  });

  it("is linked from the homepage", () => {
    const link = page(home)
      .doc.querySelectorAll("main a")
      .find((a) => a.text.trim() === linkText);
    expect(link?.getAttribute("href")).toBe(route);
  });

  it("links cagr-fund-pension to its repo and live demo", () => {
    const hrefs = main.querySelectorAll("a").map((a) => a.getAttribute("href"));
    expect(main.text).toContain("cagr-fund-pension");
    expect(hrefs).toContain("https://github.com/tizianocappai/cagr-fund-pension");
    expect(hrefs).toContain("https://gennarofondopensione.vercel.app");
  });

  it("links francescaauriemma.it to the live site, without a code link", () => {
    const article = main
      .querySelectorAll("section#personal-projects article")
      .find((a) => a.querySelector("h3")?.text.trim() === "francescaauriemma.it")!;
    const hrefs = article.querySelectorAll("a").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["https://www.francescaauriemma.it/"]);
  });

  it("lists six client-work entries by sector, with role and stack", () => {
    const entries = main.querySelectorAll("section#client-work li").map((li) => li.text.trim());
    expect(entries).toHaveLength(6);
    for (const entry of entries) expect(entry).toMatch(/\S.*·.*\S.*·.*\S/);
  });

  it("names K2 Play for online betting and no other client", () => {
    const entries = main.querySelectorAll("section#client-work li").map((li) => li.text);
    expect(entries.filter((e) => e.includes("K2 Play"))).toHaveLength(1);
    expect(entries.find((e) => e.includes("K2 Play"))).toContain("Angular");
  });
});

describe("Projects page sectors", () => {
  it("lists the agreed sectors in English", () => {
    const text = page("/projects/").doc.querySelector("section#client-work")!.text;
    for (const sector of ["National security", "Luxury e-commerce", "Public sector", "Automotive", "Fashion", "Online betting"]) {
      expect(text).toContain(sector);
    }
  });

  it("lists the agreed sectors in Italian", () => {
    const text = page("/it/projects/").doc.querySelector("section#client-work")!.text;
    for (const sector of ["Sicurezza nazionale", "E-commerce di lusso", "Pubblica amministrazione", "Automotive", "Moda", "Scommesse online"]) {
      expect(text).toContain(sector);
    }
  });
});
