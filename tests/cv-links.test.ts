// The homepage links to the Career page and to the single English CV PDF, in both languages.
import { describe, expect, it } from "vitest";
import { allFiles, page } from "./site";

const linkByText = (route: string, text: string) =>
  page(route).doc.querySelectorAll("main a").find((a) => a.text.trim() === text);

describe.each([
  ["/", "Career", "CV (PDF)", "/career/"],
  ["/it/", "Carriera", "CV (PDF, in inglese)", "/it/career/"],
])("homepage %s", (route, careerLabel, cvLabel, careerRoute) => {
  it("links to the Career page in its own language", () => {
    expect(linkByText(route, careerLabel)?.getAttribute("href")).toBe(careerRoute);
  });

  it("links to the CV PDF, which exists in the build", () => {
    const href = linkByText(route, cvLabel)?.getAttribute("href");
    expect(href).toBe("/tiziano-cappai-cv.pdf");
    expect(allFiles()).toContain(href);
  });
});

describe("CV PDF", () => {
  it("is published at a single URL", () => {
    expect(allFiles().filter((f) => f.endsWith(".pdf"))).toEqual(["/tiziano-cappai-cv.pdf"]);
  });
});
