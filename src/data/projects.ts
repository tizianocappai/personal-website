// Projects page content, per language. Client work is anonymized by industry sector: never add client names.
// (K2 Play is named on purpose: it was Tiziano's employer, not a client under NDA.)
//
// REVIEW (Tiziano): agent-drafted, to review before going live:
// - the cagr-fund-pension description in both languages (drafted from the project README);
// - the francescaauriemma.it description in both languages (drafted from the live site; add the stack if wanted);
// - the stack of each client-work line (the CV gives stacks per role, not per sector);
// - every Italian string.
import type { Lang } from "../i18n/ui";

export interface PersonalProject {
  name: string;
  description: string;
  /** Omitted when the code is not public (e.g. a site built for someone else). */
  repo?: string;
  url: string;
  /** How the link to `url` is labelled: a demo of a personal tool, or a live site. */
  urlKind: "demo" | "site";
}

/** One anonymized client engagement: industry sector, Tiziano's role, stack. */
export interface ClientWork {
  sector: string;
  role: string;
  stack: string;
}

export interface ProjectsContent {
  personal: PersonalProject[];
  clientWork: ClientWork[];
}

const cagrFundPension = {
  name: "cagr-fund-pension",
  repo: "https://github.com/tizianocappai/cagr-fund-pension",
  url: "https://gennarofondopensione.vercel.app",
  urlKind: "demo",
} as const;

// Built by Tiziano for Francesca Auriemma, who is credited publicly in the site's footer.
// No repo link on purpose.
const francescaAuriemma = {
  name: "francescaauriemma.it",
  url: "https://www.francescaauriemma.it/",
  urlKind: "site",
} as const;

// Roles and stacks stay in English in both languages, like job titles and technology names.
const leadArchitecture = { role: "Lead frontend architecture", stack: "React, Angular, Vue.js, TypeScript" };
const enterpriseApps = { role: "Enterprise web apps", stack: "React, Angular, TypeScript" };
const angularUi = { role: "Angular UI", stack: "Angular, TypeScript" };

export const projects: Record<Lang, ProjectsContent> = {
  en: {
    personal: [
      {
        ...cagrFundPension,
        description:
          "A browser-only app for members of Italian pension funds (Fondo Cometa, Fondo Fonte): from the fund portal's transaction export it computes the real annual growth rate (XIRR), compares the fund with TFR net of tax, and runs a 10,000-path Monte Carlo simulation for retirement planning. No data leaves the browser. React, TypeScript, Vite, Recharts.",
      },
      {
        ...francescaAuriemma,
        description:
          "The professional website of Francesca Auriemma, a psychologist in Rome: a single page presenting her, her services, her approach and FAQs, with a call to book a first consultation. Designed and built end to end.",
      },
    ],
    clientWork: [
      { sector: "National security", ...leadArchitecture },
      { sector: "Luxury e-commerce", ...leadArchitecture },
      { sector: "Public sector", ...enterpriseApps },
      { sector: "Automotive", ...enterpriseApps },
      { sector: "Fashion", ...enterpriseApps },
      { sector: "Online betting, at K2 Play", ...angularUi },
    ],
  },
  // REVIEW (Tiziano): agent-drafted Italian copy.
  it: {
    personal: [
      {
        ...cagrFundPension,
        description:
          "Un'app che funziona interamente nel browser, per chi aderisce a un fondo pensione italiano (Fondo Cometa, Fondo Fonte): dall'export dei movimenti del portale del fondo calcola il rendimento annuo reale (XIRR), confronta il fondo con il TFR al netto delle tasse ed esegue una simulazione Monte Carlo su 10.000 scenari per pianificare la pensione. Nessun dato lascia il browser. React, TypeScript, Vite, Recharts.",
      },
      {
        ...francescaAuriemma,
        description:
          "Il sito professionale di Francesca Auriemma, psicologa a Roma: una pagina unica che presenta chi è, i servizi, l'approccio e le domande frequenti, con l'invito a prenotare un primo colloquio. Progettato e realizzato da zero.",
      },
    ],
    clientWork: [
      { sector: "Sicurezza nazionale", ...leadArchitecture },
      { sector: "E-commerce di lusso", ...leadArchitecture },
      { sector: "Pubblica amministrazione", ...enterpriseApps },
      { sector: "Automotive", ...enterpriseApps },
      { sector: "Moda", ...enterpriseApps },
      { sector: "Scommesse online, presso K2 Play", ...angularUi },
    ],
  },
};
