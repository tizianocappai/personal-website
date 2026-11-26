// The Career page: the indexable HTML version of the CV, in English and Italian.
import { describe, expect, it } from "vitest";
import { page } from "./site";

const sections = {
  "/career/": ["Summary", "Experience", "Skills", "Education", "Languages"],
  "/it/career/": ["Profilo", "Esperienza", "Competenze", "Formazione", "Lingue"],
};

describe.each(Object.entries(sections))("career page %s", (route, headings) => {
  const career = page(route);
  const main = () => career.doc.querySelector("main")!;

  it("renders summary, experience, skills, education and languages", () => {
    expect(main().querySelectorAll("h2").map((h) => h.text.trim())).toEqual(headings);
  });

  it("lists work experience newest first, with job titles in English", () => {
    expect(main().querySelectorAll("h3").map((h) => h.text.trim())).toEqual([
      "Consultant – Senior Frontend Developer",
      "Senior Analyst – Frontend Developer",
      "Analyst – Frontend Developer",
      "Junior Frontend Developer",
    ]);
  });

  it("shows company, dates and key achievements for each job", () => {
    const jobs = main().querySelectorAll("section");
    expect(jobs).toHaveLength(4);
    expect(jobs[0].text).toContain("Accenture");
    expect(jobs[0].text).toContain("06/2025");
    expect(jobs[0].text).toContain("40%");
    expect(jobs[3].text).toContain("K2 Play");
    expect(jobs[3].text).toContain("11/2017");
    for (const job of jobs) expect(job.querySelectorAll("li").length).toBeGreaterThan(0);
  });

  it("shows skills grouped by category", () => {
    const text = main().text;
    for (const skill of ["TypeScript", "React", "Angular", "Vue.js", "Model Context Protocol (MCP)", "GraphQL"]) {
      expect(text).toContain(skill);
    }
  });

  it("leaves Jira and Microsoft Office 365 out of the skills", () => {
    expect(career.html).not.toMatch(/Jira/i);
    expect(career.html).not.toMatch(/Office 365/i);
  });

  it("shows education and spoken languages", () => {
    const text = main().text;
    expect(text).toContain("Universitas Mercatorum");
    expect(text).toContain("ITIS Giuseppe Armellini");
    expect(text).toContain("B2/C1");
  });
});

describe("Italian career page", () => {
  it("is written in Italian", () => {
    const text = page("/it/career/").doc.querySelector("main")!.text;
    expect(text).toContain("Madrelingua");
    expect(text).toContain("Roma");
  });
});
