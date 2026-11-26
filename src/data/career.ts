// Career content (the HTML version of the CV), one version per language.
// Source: Tiziano's CV "Senior Frontend Developer". Experience is listed newest first.
// Never add a phone number here. "Tools: Jira, Microsoft Office 365" is left out on purpose.
//
// REVIEW (Tiziano): the Italian version was drafted by an agent and must be reviewed before going live.
// Job titles and technology names stay in English on purpose.
import type { Lang } from "../i18n/ui";

export interface Job {
  role: string;
  company: string;
  location: string;
  /** Display dates, e.g. "06/2025 – Present". */
  dates: string;
  achievements: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Degree {
  title: string;
  school: string;
  location: string;
  dates: string;
}

export interface SpokenLanguage {
  language: string;
  level: string;
}

export interface Career {
  summary: string;
  experience: Job[];
  skills: SkillGroup[];
  education: Degree[];
  languages: SpokenLanguage[];
}

const roles = {
  consultant: "Consultant – Senior Frontend Developer",
  seniorAnalyst: "Senior Analyst – Frontend Developer",
  analyst: "Analyst – Frontend Developer",
  junior: "Junior Frontend Developer",
};

const skillItems = {
  programming: ["JavaScript (ES6+)", "TypeScript", "Python", "Java", "HTML5", "CSS3", "SCSS"],
  frameworks: ["React", "Next.js", "Angular", "Vue.js", "Nuxt"],
  state: ["Redux", "NgRx", "Vuex", "Pinia", "Zustand"],
  ui: ["Tailwind CSS", "Styled Components", "Material UI"],
  build: ["Webpack", "Vite", "Rsbuild", "Docker", "Git"],
  ai: [
    "Claude",
    "Large Language Models (LLM)",
    "Agentic AI Workflows",
    "AI Agents",
    "Prompt Engineering",
    "Context Engineering",
    "Model Context Protocol (MCP)",
    "AI-Assisted Software Development",
  ],
  others: ["REST API", "GraphQL", "CI/CD"],
};

export const career: Record<Lang, Career> = {
  en: {
    summary:
      "Senior Frontend Developer and Software Engineer with 7+ years of experience building scalable web applications for Fortune 500 clients. Expert in JavaScript, TypeScript, React, Angular and Vue.js, with hands-on experience in Next.js and Nuxt. Team Lead for teams of 2-5 developers, driving frontend architecture, code reviews and technical solution design. Experienced in AI-assisted software development, agentic AI workflows, AI agents, prompt engineering and Model Context Protocol (MCP). Delivered enterprise solutions for public sector, national security, luxury fashion, e-commerce, automotive and financial services.",
    experience: [
      {
        role: roles.consultant,
        company: "Accenture",
        location: "Rome, Italy",
        dates: "06/2025 – Present",
        achievements: [
          "Lead frontend architecture for national security and luxury e-commerce projects, managing teams of 2-5 developers.",
          "Design technical solutions and write technical documentation for client proposals and public tenders.",
          "Apply AI-assisted software development and agentic AI workflows to reduce delivery time by 40%.",
        ],
      },
      {
        role: roles.seniorAnalyst,
        company: "Accenture",
        location: "Rome, Italy",
        dates: "01/2022 – 05/2025",
        achievements: [
          "Led development of enterprise web applications using React, Angular and Vue.js with TypeScript.",
          "Mentored junior developers and coordinated team workflows, code reviews and sprint planning.",
        ],
      },
      {
        role: roles.analyst,
        company: "Accenture",
        location: "Rome, Italy",
        dates: "10/2019 – 12/2021",
        achievements: [
          "Built reusable UI components and component libraries with React and Angular, focusing on code quality and maintainability.",
          "Delivered web applications for enterprise clients in automotive, fashion and public sector.",
        ],
      },
      {
        role: roles.junior,
        company: "K2 Play S.r.l.",
        location: "Rome, Italy",
        dates: "11/2017 – 09/2019",
        achievements: [
          "Developed Angular components and user interfaces for online betting platforms.",
          "Completed structured frontend training on JavaScript, TypeScript and Angular best practices.",
        ],
      },
    ],
    skills: [
      { category: "Programming Languages", items: skillItems.programming },
      { category: "Frontend Frameworks", items: skillItems.frameworks },
      { category: "State Management", items: skillItems.state },
      { category: "UI and Styling", items: [...skillItems.ui, "Responsive Design"] },
      { category: "Build Tools and DevOps", items: skillItems.build },
      { category: "AI and LLM", items: skillItems.ai },
      {
        category: "Methodologies",
        items: ["Frontend Architecture", "Code Review", "Mentoring", "Technical Documentation", "Agile"],
      },
      {
        category: "Others",
        items: [
          ...skillItems.others,
          "Web Accessibility (WCAG)",
          "Performance Optimization (Core Web Vitals)",
        ],
      },
    ],
    education: [
      {
        title: "Bachelor's Degree in Business Management",
        school: "Universitas Mercatorum",
        location: "Rome, Italy",
        dates: "09/2022 – 12/2024",
      },
      {
        title: "High School Diploma in Information Technology",
        school: "ITIS Giuseppe Armellini",
        location: "Rome, Italy",
        dates: "09/2012 – 06/2017",
      },
    ],
    languages: [
      { language: "Italian", level: "Native" },
      { language: "English", level: "Professional working proficiency (B2/C1)" },
    ],
  },
  // REVIEW (Tiziano): agent-drafted Italian copy.
  it: {
    summary:
      "Senior Frontend Developer e Software Engineer con oltre 7 anni di esperienza nello sviluppo di applicazioni web scalabili per clienti Fortune 500. Esperto di JavaScript, TypeScript, React, Angular e Vue.js, con esperienza pratica in Next.js e Nuxt. Team Lead di team da 2 a 5 sviluppatori, guida l'architettura frontend, le code review e la progettazione delle soluzioni tecniche. Esperienza nello sviluppo software assistito dall'AI, nei workflow di agentic AI, negli AI agent, nel prompt engineering e nel Model Context Protocol (MCP). Ha realizzato soluzioni enterprise per pubblica amministrazione, sicurezza nazionale, moda di lusso, e-commerce, automotive e servizi finanziari.",
    experience: [
      {
        role: roles.consultant,
        company: "Accenture",
        location: "Roma",
        dates: "06/2025 – oggi",
        achievements: [
          "Guida l'architettura frontend di progetti per la sicurezza nazionale e l'e-commerce di lusso, coordinando team da 2 a 5 sviluppatori.",
          "Progetta soluzioni tecniche e redige la documentazione tecnica per proposte ai clienti e gare pubbliche.",
          "Applica lo sviluppo software assistito dall'AI e i workflow di agentic AI, riducendo i tempi di consegna del 40%.",
        ],
      },
      {
        role: roles.seniorAnalyst,
        company: "Accenture",
        location: "Roma",
        dates: "01/2022 – 05/2025",
        achievements: [
          "Ha guidato lo sviluppo di applicazioni web enterprise con React, Angular e Vue.js in TypeScript.",
          "Ha fatto da mentor agli sviluppatori junior e coordinato i flussi di lavoro del team, le code review e la pianificazione degli sprint.",
        ],
      },
      {
        role: roles.analyst,
        company: "Accenture",
        location: "Roma",
        dates: "10/2019 – 12/2021",
        achievements: [
          "Ha realizzato componenti UI riutilizzabili e librerie di componenti con React e Angular, curando qualità e manutenibilità del codice.",
          "Ha consegnato applicazioni web per clienti enterprise nei settori automotive, moda e pubblica amministrazione.",
        ],
      },
      {
        role: roles.junior,
        company: "K2 Play S.r.l.",
        location: "Roma",
        dates: "11/2017 – 09/2019",
        achievements: [
          "Ha sviluppato componenti e interfacce utente in Angular per piattaforme di scommesse online.",
          "Ha completato una formazione frontend strutturata su JavaScript, TypeScript e best practice Angular.",
        ],
      },
    ],
    skills: [
      { category: "Linguaggi di programmazione", items: skillItems.programming },
      { category: "Framework frontend", items: skillItems.frameworks },
      { category: "Gestione dello stato", items: skillItems.state },
      { category: "UI e stile", items: [...skillItems.ui, "Responsive design"] },
      { category: "Build tool e DevOps", items: skillItems.build },
      { category: "AI e LLM", items: skillItems.ai },
      {
        category: "Metodologie",
        items: ["Architettura frontend", "Code review", "Mentoring", "Documentazione tecnica", "Agile"],
      },
      {
        category: "Altro",
        items: [
          ...skillItems.others,
          "Accessibilità web (WCAG)",
          "Ottimizzazione delle prestazioni (Core Web Vitals)",
        ],
      },
    ],
    education: [
      {
        title: "Laurea triennale in Economia e gestione aziendale",
        school: "Universitas Mercatorum",
        location: "Roma",
        dates: "09/2022 – 12/2024",
      },
      {
        title: "Diploma di perito in Informatica",
        school: "ITIS Giuseppe Armellini",
        location: "Roma",
        dates: "09/2012 – 06/2017",
      },
    ],
    languages: [
      { language: "Italiano", level: "Madrelingua" },
      { language: "Inglese", level: "Competenza professionale (B2/C1)" },
    ],
  },
};
