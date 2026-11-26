// UI strings per language. Templates are shared between languages and read text from here.
// Only English exists for now; Italian (`it`) is added with i18n routing (ticket #3).
export const languages = ["en"] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = "en";

export interface UiStrings {
  home: {
    title: string;
    description: string;
    intro: string;
    links: {
      projects: string;
      career: string;
      cv: string;
      linkedin: string;
      github: string;
      email: string;
    };
  };
}

export const ui: Record<Lang, UiStrings> = {
  en: {
    home: {
      title: "Tiziano Cappai, Senior Frontend Developer",
      description:
        "Tiziano Cappai, Senior Frontend Developer in Rome, Italy: frontend architecture, React/Angular/Vue, and AI-assisted engineering.",
      intro: "Frontend architecture, React/Angular/Vue, and AI-assisted engineering. Rome, Italy.",
      links: {
        projects: "Projects",
        career: "Career",
        cv: "CV (PDF)",
        linkedin: "LinkedIn",
        github: "GitHub",
        email: "Email",
      },
    },
  },
};
