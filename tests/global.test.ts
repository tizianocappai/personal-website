// Properties every generated page must have, whatever its route or language.
import { describe, expect, it } from "vitest";
import { allFiles, allPages } from "./site";

const pages = allPages();

// A phone number is a run of digits (optionally +prefixed, separated by spaces, dots, dashes
// or parentheses) holding 9 to 15 digits, e.g. +39 333 123 4567 or 06 1234 5678.
// Date ranges like 2019-2024 have only 8 digits and are not flagged.
function phoneNumbers(text: string): string[] {
  const runs = text.match(/\+?\(?\d[\d\s().-]*\d/g) ?? [];
  return runs.filter((run) => {
    const digits = run.replace(/\D/g, "").length;
    return digits >= 9 && digits <= 15;
  });
}

describe("phone number detector", () => {
  it.each(["+39 333 123 4567", "3331234567", "06 1234 5678", "(+39) 333.123.4567"])("flags %s", (s) => {
    expect(phoneNumbers(`call ${s} now`)).toHaveLength(1);
  });

  it.each(["2019-2024", "2019 - 2024", "7+ years", "React/Angular/Vue"])("ignores %s", (s) => {
    expect(phoneNumbers(s)).toEqual([]);
  });
});

describe("built site", () => {
  it("has at least the English homepage", () => {
    expect(pages.map((p) => p.route)).toContain("/");
  });

  it("emits no JavaScript files", () => {
    expect(allFiles().filter((f) => /\.m?js$/.test(f))).toEqual([]);
  });
});

describe.each(pages.map((p) => [p.route, p] as const))("page %s", (_route, page) => {
  it("has a non-empty title", () => {
    expect(page.doc.querySelector("title")?.text.trim()).toBeTruthy();
  });

  it("has a non-empty meta description", () => {
    const content = page.doc.querySelector('meta[name="description"]')?.getAttribute("content");
    expect(content?.trim()).toBeTruthy();
  });

  it("declares the page language matching its route", () => {
    const expected = page.route.startsWith("/it/") ? "it" : "en";
    expect(page.doc.querySelector("html")?.getAttribute("lang")).toBe(expected);
  });

  it("weighs less than 15 KB", () => {
    expect(page.bytes).toBeLessThan(15 * 1024);
  });

  it("contains no phone number", () => {
    expect(phoneNumbers(page.doc.querySelector("body")?.text ?? "")).toEqual([]);
    expect(page.html).not.toMatch(/href="tel:/i);
  });

  // JSON-LD blocks are data, not code. The only code is Vercel Web Analytics (cookieless):
  // Using @vercel/analytics component which injects a web component and module script.
  it("ships only the Vercel Web Analytics script", () => {
    // Check for the vercel-analytics web component
    const analyticsComponent = page.doc.querySelector("vercel-analytics");
    expect(analyticsComponent).toBeTruthy();
    
    // The Analytics component creates a type="module" inline script that loads the external script
    const scripts = page.doc.querySelectorAll("script:not([type='application/ld+json'])");
    expect(scripts.length).toBe(1);
    expect(scripts[0].getAttribute("type")).toBe("module");
    
    // Verify the inline script references the Vercel insights script
    const scriptContent = scripts[0].text;
    expect(scriptContent).toContain("/_vercel/insights/script.js");
  });
});
