// UI strings per language. Templates are shared between languages and read text from here.
// English is the default locale (served at the root); Italian lives under /it/.
//
// REVIEW (Tiziano): every Italian string in this file was drafted by an agent and must be reviewed
// (issue #9). Search for "REVIEW" here, in src/data/career.ts and in src/data/projects.ts.
// Job titles and technology names stay in English on purpose.
export const languages = ["en", "it"] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = "en";

export interface UiStrings {
  /** Name of this language in itself, used as the language-switch label from the other language. */
  languageName: string;
  /** BCP 47 locale used to format dates. */
  locale: string;
  /** Open Graph locale (language_TERRITORY). */
  ogLocale: string;
  footer: {
    lastUpdated: string;
  };
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
  projects: {
    title: string;
    description: string;
    heading: string;
    personalHeading: string;
    clientWorkHeading: string;
    clientWorkNote: string;
    repo: string;
    demo: string;
    site: string;
  };
  career: {
    title: string;
    description: string;
    heading: string;
    sections: {
      summary: string;
      experience: string;
      skills: string;
      education: string;
      languages: string;
    };
  };
  notFound: {
    title: string;
    message: string;
    backHome: string;
  };
}

export const ui: Record<Lang, UiStrings> = {
  en: {
    languageName: "English",
    locale: "en-GB",
    ogLocale: "en_GB",
    footer: { lastUpdated: "Last updated" },
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
    projects: {
      title: "Projects, Tiziano Cappai",
      description:
        "Projects by Tiziano Cappai, Senior Frontend Developer: a pension fund analysis app, a psychologist's website and client work by industry sector.",
      heading: "Projects",
      personalHeading: "Personal projects",
      clientWorkHeading: "Client work",
      clientWorkNote: "By industry sector: client names are under NDA.",
      repo: "Code",
      demo: "Live demo",
      site: "Website",
    },
    career: {
      title: "Career: Tiziano Cappai, Senior Frontend Developer",
      description:
        "Career of Tiziano Cappai, Senior Frontend Developer at Accenture in Rome: work experience, skills, education and languages.",
      heading: "Career",
      sections: {
        summary: "Summary",
        experience: "Experience",
        skills: "Skills",
        education: "Education",
        languages: "Languages",
      },
    },
    notFound: {
      title: "Page not found",
      message: "There is no page at this address.",
      backHome: "Go to the homepage",
    },
  },
  // REVIEW (Tiziano): agent-drafted Italian copy.
  it: {
    languageName: "Italiano",
    locale: "it-IT",
    ogLocale: "it_IT",
    footer: { lastUpdated: "Ultimo aggiornamento" },
    home: {
      title: "Tiziano Cappai, Senior Frontend Developer",
      description:
        "Tiziano Cappai, Senior Frontend Developer a Roma: architettura frontend, React/Angular/Vue e sviluppo software assistito dall'AI.",
      intro: "Architettura frontend, React/Angular/Vue e sviluppo software assistito dall'AI. Roma.",
      links: {
        projects: "Progetti",
        career: "Carriera",
        cv: "CV (PDF, in inglese)",
        linkedin: "LinkedIn",
        github: "GitHub",
        email: "Email",
      },
    },
    projects: {
      title: "Progetti, Tiziano Cappai",
      description:
        "Progetti di Tiziano Cappai, Senior Frontend Developer: un'app per analizzare i fondi pensione, il sito di una psicologa e i lavori per clienti, per settore.",
      heading: "Progetti",
      personalHeading: "Progetti personali",
      clientWorkHeading: "Lavori per clienti",
      clientWorkNote: "Per settore: i nomi dei clienti sono coperti da NDA.",
      repo: "Codice",
      demo: "Demo",
      site: "Sito web",
    },
    career: {
      title: "Carriera: Tiziano Cappai, Senior Frontend Developer",
      description:
        "Carriera di Tiziano Cappai, Senior Frontend Developer in Accenture a Roma: esperienze di lavoro, competenze, formazione e lingue.",
      heading: "Carriera",
      sections: {
        summary: "Profilo",
        experience: "Esperienza",
        skills: "Competenze",
        education: "Formazione",
        languages: "Lingue",
      },
    },
    notFound: {
      title: "Pagina non trovata",
      message: "Non c'è nessuna pagina a questo indirizzo.",
      backHome: "Vai alla homepage",
    },
  },
};
