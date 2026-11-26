// The page Vercel serves for any unknown URL: one static 404.html, in both languages.
import { describe, expect, it } from "vitest";
import { page } from "./site";

const notFound = page("/404.html");

describe("not-found page", () => {
  it("says the page was not found, in English and in Italian", () => {
    const main = notFound.doc.querySelector("main")?.text ?? "";
    expect(main).toContain("Page not found");
    expect(main).toContain("Pagina non trovata");
  });

  it("links back to the homepage in both languages", () => {
    const hrefs = notFound.doc.querySelectorAll("main a").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/it/");
  });

  it("marks the Italian part with lang=it", () => {
    expect(notFound.doc.querySelector('main [lang="it"]')?.text).toContain("Pagina non trovata");
  });

  it("is kept out of search results: noindex, no canonical, no hreflang", () => {
    expect(notFound.doc.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex");
    expect(notFound.doc.querySelector('link[rel="canonical"]')).toBeNull();
    expect(notFound.doc.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(0);
  });

  it("uses the shared layout (footer with last updated)", () => {
    expect(notFound.doc.querySelector("footer")?.text).toMatch(/Last updated: \w+ 20\d\d/);
  });
});
