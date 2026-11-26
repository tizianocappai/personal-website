// What search engines and link previews receive: favicon, Open Graph / Twitter cards, sitemap.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allFiles, allPages, distDir } from "./site";

const site = "https://tizianocappai-website.vercel.app";
const pages = allPages();
const files = new Set(allFiles());
const read = (path: string) => readFileSync(join(distDir, path));

describe("favicon", () => {
  it("is a text-only SVG with the initials", () => {
    expect(files).toContain("/favicon.svg");
    const svg = read("/favicon.svg").toString("utf8");
    expect(svg).toMatch(/^<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(svg).toMatch(/<text[^>]*>TC<\/text>/);
    expect(svg).not.toMatch(/<image|data:/);
  });
});

describe.each(["/", "/it/"])("structured data on homepage %s", (route) => {
  const scripts = pages
    .find((p) => p.route === route)!
    .doc.querySelectorAll('script[type="application/ld+json"]');

  it("contains one valid JSON-LD Person with the agreed fields", () => {
    expect(scripts).toHaveLength(1);
    const person = JSON.parse(scripts[0].text);
    expect(person).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Tiziano Cappai",
      jobTitle: "Senior Frontend Developer",
      url: `${site}${route}`,
      worksFor: { "@type": "Organization", name: "Accenture" },
      address: { "@type": "PostalAddress", addressLocality: "Rome", addressCountry: "IT" },
      email: "mailto:tiziano.cappai@icloud.com",
      sameAs: ["https://www.linkedin.com/in/tiziano-cappai-1b5271153", "https://github.com/tizianocappai"],
    });
  });
});

describe("structured data elsewhere", () => {
  it("appears only on the homepages", () => {
    const withJsonLd = pages.filter((p) => p.doc.querySelector('script[type="application/ld+json"]'));
    expect(withJsonLd.map((p) => p.route)).toEqual(["/", "/it/"]);
  });
});

describe("sitemap", () => {
  const indexable = pages.filter((p) => !p.doc.querySelector('meta[name="robots"][content*="noindex"]'));
  const xml = files.has("/sitemap.xml") ? read("/sitemap.xml").toString("utf8") : "";
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it("is announced in robots.txt", () => {
    expect(read("/robots.txt").toString("utf8")).toContain(`Sitemap: ${site}/sitemap.xml`);
  });

  it("lists every indexable page, in both languages, and nothing else", () => {
    expect(locs.sort()).toEqual(indexable.map((p) => `${site}${p.route}`).sort());
    expect(locs).toContain(`${site}/`);
    expect(locs).toContain(`${site}/it/`);
  });

  it("leaves out the not-found page", () => {
    expect(locs.some((l) => l.includes("404"))).toBe(false);
  });

  it("gives each URL the same hreflang alternates as its page", () => {
    const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
    expect(entries).toHaveLength(indexable.length);
    for (const entry of entries) {
      const loc = entry.match(/<loc>([^<]+)<\/loc>/)![1];
      const fromSitemap = [...entry.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)]
        .map((m) => `${m[1]} ${m[2]}`)
        .sort();
      const p = indexable.find((x) => `${site}${x.route}` === loc)!;
      const fromPage = p.doc
        .querySelectorAll('link[rel="alternate"][hreflang]')
        .map((l) => `${l.getAttribute("hreflang")} ${l.getAttribute("href")}`)
        .sort();
      expect(fromSitemap).toEqual(fromPage);
    }
  });
});

/** Width and height from a PNG's IHDR chunk, or undefined if the bytes are not a PNG. */
function pngSize(bytes: Buffer): { width: number; height: number } | undefined {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!bytes.subarray(0, 8).equals(signature) || bytes.toString("ascii", 12, 16) !== "IHDR") return undefined;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe.each(pages.map((p) => [p.route, p] as const))("page %s", (_route, page) => {
  const meta = (attr: "property" | "name", key: string) =>
    page.doc.querySelector(`meta[${attr}="${key}"]`)?.getAttribute("content");

  it("has an Open Graph image: an existing 1200x630 PNG on the site", () => {
    const image = meta("property", "og:image");
    expect(image?.startsWith(`${site}/`)).toBe(true);
    const path = image!.slice(site.length);
    expect(files).toContain(path);
    expect(pngSize(read(path))).toEqual({ width: 1200, height: 630 });
    expect(meta("property", "og:image:width")).toBe("1200");
    expect(meta("property", "og:image:height")).toBe("630");
    expect(meta("property", "og:image:alt")?.trim()).toBeTruthy();
  });

  it("has Open Graph title, description, type, locale and site name", () => {
    expect(meta("property", "og:title")).toBe(page.doc.querySelector("title")?.text);
    expect(meta("property", "og:description")).toBe(meta("name", "description"));
    expect(meta("property", "og:type")).toBe("website");
    expect(meta("property", "og:site_name")).toBe("Tiziano Cappai");
    const lang = page.doc.querySelector("html")?.getAttribute("lang");
    expect(meta("property", "og:locale")).toBe(lang === "it" ? "it_IT" : "en_GB");
  });

  it("gives Open Graph the canonical URL when the page has one", () => {
    const canonical = page.doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
    expect(meta("property", "og:url")).toBe(canonical);
  });

  it("has a large-image Twitter card with the same image", () => {
    expect(meta("name", "twitter:card")).toBe("summary_large_image");
    expect(meta("name", "twitter:image")).toBe(meta("property", "og:image"));
  });

  it("references the SVG favicon", () => {
    const icon = page.doc.querySelector('link[rel="icon"]');
    expect(icon?.getAttribute("href")).toBe("/favicon.svg");
    expect(icon?.getAttribute("type")).toBe("image/svg+xml");
  });
});
