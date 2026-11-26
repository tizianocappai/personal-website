# personal-website

Tiziano Cappai's personal site: text and links only, static Astro output, no client-side JavaScript.
Spec: issue #1.

## Commands

Requires Node 24 and npm.

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static site in dist/
npm test         # builds the site once, then checks every generated page
```

## How it is organised

- `src/pages/`: one file per route. English lives at the root, Italian under `src/pages/it/` (served at `/it/`).
  No redirect based on the browser language: the URL you open is the page you get.
- `src/components/`: page templates shared by all languages.
- `src/layouts/Base.astro`: the shared HTML shell. From the page's `lang` and `route` key it renders `lang`,
  title, description, canonical URL, `hreflang` alternates (en, it, x-default) and the footer ("Last updated"
  with the build month, localized, and the link to the same page in the other language).
- `src/i18n/routes.ts`: route keys and their paths; `localizedPath(lang, key)` gives the URL in a language.
- `src/i18n/ui.ts`: UI strings per language, typed.
- `src/data/`: content kept separate from markup (`profile.ts` holds the contact links and the CV URL, `career.ts`
  the Career page in both languages). Never add a phone number.
- `public/tiziano-cappai-cv.pdf`: the single English CV, served at `/tiziano-cappai-cv.pdf` and linked from both
  homepages. To update it, replace the file keeping the name, after checking it has no phone number.
- `src/styles/global.css`: the whole stylesheet, inlined into every page.
- `tests/`: Vitest suite. `build.global-setup.ts` runs `astro build` once; the tests parse the HTML in `dist/` and
  check what a visitor or search engine receives (title, description, `lang`, page under 15 KB, no phone number,
  no client-side script, stylesheet rules, homepage content, canonical/hreflang and the language switch).

### Adding a page

1. Add a route key to `routes` in `src/i18n/routes.ts`, e.g. `career: "/career/"`.
2. Add its strings for every language in `src/i18n/ui.ts` (the type forces both).
3. Write one shared template in `src/components/` that renders `<Base lang={lang} route="career" title=… description=…>`.
4. Create `src/pages/career.astro` and `src/pages/it/career.astro`, each rendering the template with its `lang`.

The tests then check its canonical, hreflang and language-switch link automatically, and fail if one language
is missing.

## Italian copy to review

All Italian text was drafted by an agent and must be reviewed by Tiziano before going live (marked `REVIEW`
in the source). Job titles and technology names stay in English on purpose. Current strings, in `src/i18n/ui.ts`:

| Where | English | Italian (draft) |
| --- | --- | --- |
| Homepage description | Tiziano Cappai, Senior Frontend Developer in Rome, Italy: frontend architecture, React/Angular/Vue, and AI-assisted engineering. | Tiziano Cappai, Senior Frontend Developer a Roma: architettura frontend, React/Angular/Vue e sviluppo software assistito dall'AI. |
| Homepage intro | Frontend architecture, React/Angular/Vue, and AI-assisted engineering. Rome, Italy. | Architettura frontend, React/Angular/Vue e sviluppo software assistito dall'AI. Roma. |
| Homepage links | Projects · Career · CV (PDF) | Progetti · Carriera · CV (PDF, in inglese) |
| Footer | Last updated | Ultimo aggiornamento |
| Language switch label | English | Italiano |
| Career title / heading | Career: Tiziano Cappai, Senior Frontend Developer / Career | Carriera: Tiziano Cappai, Senior Frontend Developer / Carriera |
| Career description | Career of Tiziano Cappai, Senior Frontend Developer at Accenture in Rome: work experience, skills, education and languages. | Carriera di Tiziano Cappai, Senior Frontend Developer in Accenture a Roma: esperienze di lavoro, competenze, formazione e lingue. |
| Career sections | Summary · Experience · Skills · Education · Languages | Profilo · Esperienza · Competenze · Formazione · Lingue |
| Career content | summary, achievements, skill categories, degrees, languages | whole `it` block in `src/data/career.ts` (translated summary and achievements, "oggi" for Present, degree titles "Laurea triennale in Economia e gestione aziendale" and "Diploma di perito in Informatica") |

Projects page (`src/i18n/ui.ts` and `src/data/projects.ts`):

| Where | English | Italian (draft) |
| --- | --- | --- |
| Projects title | Projects, Tiziano Cappai | Progetti, Tiziano Cappai |
| Projects description | Projects by Tiziano Cappai, Senior Frontend Developer: a personal pension fund analysis app and client work by industry sector. | Progetti di Tiziano Cappai, Senior Frontend Developer: un'app personale per analizzare i fondi pensione e i lavori per clienti, per settore. |
| Projects headings | Projects · Personal projects · Client work | Progetti · Progetti personali · Lavori per clienti |
| Client work note | By industry sector: client names are under NDA. | Per settore: i nomi dei clienti sono coperti da NDA. |
| Project links | Code · Live demo | Codice · Demo |
| Sectors | National security · Luxury e-commerce · Public sector · Automotive · Fashion · Online betting, at K2 Play | Sicurezza nazionale · E-commerce di lusso · Pubblica amministrazione · Automotive · Moda · Scommesse online, presso K2 Play |
| cagr-fund-pension description | see `src/data/projects.ts` | see `src/data/projects.ts` |

Also to review in `src/data/projects.ts`, in both languages: the cagr-fund-pension description (drafted by an
agent from the project README) and the stack on each client-work line (the CV gives stacks per role, not per
sector, so each line uses the stack of the matching CV role).

Pages added later (not-found) list their Italian strings here too.

## Deploying on Vercel (one-time setup, done by Tiziano)

The repo already contains `vercel.json` (framework Astro, `npm ci`, `npm run build`, output `dist`), so no
settings need changing by hand.

1. Push the `main` branch to GitHub (`tizianocappai/personal-website`).
2. Sign in at <https://vercel.com> with your GitHub account (or create an account, Hobby plan is enough).
3. Go to <https://vercel.com/new>, under "Import Git Repository" click **Adjust GitHub App Permissions** if the
   repo is not listed, grant the Vercel app access to `tizianocappai/personal-website`, then click **Import** next to it.
4. On the "Configure Project" screen:
   - Project Name: `tizianocappai` (this gives the URL `https://tizianocappai.vercel.app` if it is free;
     any free name works).
   - Framework Preset: **Astro** (auto-detected).
   - Root Directory: `./`.
   - Build and Output Settings: leave the defaults; `vercel.json` sets them.
   - Environment Variables: none.
5. Click **Deploy**. When it finishes, open the `*.vercel.app` URL shown on the success screen.
6. Check **Settings → Git**: Production Branch must be `main`. From now on:
   - every push to `main` deploys to production;
   - every push to any other branch (and every pull request) gets its own preview URL.
7. Check **Settings → Build and Deployment → Node.js Version** is `24.x` (matches `engines` in `package.json`).

The custom domain (`tizianocappai.com`) and its DNS steps come with a later ticket; until then the site lives on
`*.vercel.app`. Canonical and sitemap URLs already use `https://tizianocappai.com` (Astro `site`).
