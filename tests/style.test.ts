// The delivered stylesheet follows the spec's design decisions on every page.
import { describe, expect, it } from "vitest";
import { allPages } from "./site";

describe.each(allPages().map((p) => [p.route, p] as const))("styles on %s", (_route, page) => {
  const css = page.doc.querySelectorAll("style").map((s) => s.text).join("\n");

  it("uses the system serif stack and no web fonts", () => {
    expect(css).toMatch(/font-family:\s*ui-serif,\s*Georgia,\s*serif/);
    expect(css).not.toMatch(/@font-face/);
    expect(page.html).not.toMatch(/fonts\.googleapis|\.woff2?/);
  });

  it("limits the text column to about 65 characters", () => {
    expect(css).toMatch(/max-width:\s*65ch/);
  });

  it("switches to dark mode automatically", () => {
    expect(css).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
  });

  it("has no animations or transitions", () => {
    expect(css).not.toMatch(/transition|animation|@keyframes/);
  });

  it("loads no external stylesheet", () => {
    expect(page.doc.querySelectorAll('link[rel="stylesheet"]')).toHaveLength(0);
  });

  it("sets a responsive viewport", () => {
    expect(page.doc.querySelector('meta[name="viewport"]')?.getAttribute("content")).toBe(
      "width=device-width, initial-scale=1",
    );
  });
});
