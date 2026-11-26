// The English homepage at the root, as a recruiter landing on it sees it.
import { describe, expect, it } from "vitest";
import { page } from "./site";

const home = page("/");
const linkByText = (text: string) =>
  home.doc.querySelectorAll("main a").find((a) => a.text.trim() === text);

describe("English homepage", () => {
  it("is titled with name and role", () => {
    expect(home.doc.querySelector("title")?.text.trim()).toBe("Tiziano Cappai, Senior Frontend Developer");
    expect(home.doc.querySelector("h1")?.text.trim()).toBe("Tiziano Cappai, Senior Frontend Developer");
  });

  it("shows the one-line intro", () => {
    expect(home.doc.querySelector("main")?.text).toContain(
      "Frontend architecture, React/Angular/Vue, and AI-assisted engineering. Rome, Italy.",
    );
  });

  it("links to email as a plain mailto", () => {
    expect(linkByText("Email")?.getAttribute("href")).toBe("mailto:tiziano.cappai@icloud.com");
  });

  it("links to LinkedIn", () => {
    expect(linkByText("LinkedIn")?.getAttribute("href")).toBe(
      "https://www.linkedin.com/in/tiziano-cappai-1b5271153",
    );
  });

  it("links to GitHub", () => {
    expect(linkByText("GitHub")?.getAttribute("href")).toBe("https://github.com/tizianocappai");
  });

  it("lists the links in the agreed order", () => {
    const items = home.doc.querySelectorAll("main li").map((li) => li.text.trim());
    expect(items).toEqual(["Projects", "Career", "CV (PDF)", "LinkedIn", "GitHub", "Email"]);
  });
});
