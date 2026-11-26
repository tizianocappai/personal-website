# personal-website

Site: <https://tizianocappai-website.vercel.app/> · CV: <https://tizianocappai-website.vercel.app/tiziano-cappai-cv.pdf>

Tiziano Cappai's personal site: text and links only, static Astro output, no client-side JavaScript except
Vercel Web Analytics (cookieless, no banner).

**Status:** live on `*.vercel.app`, with Vercel Web Analytics on.

**Licence:** none. All rights reserved: the code is public to read, not to reuse.

## Commands

Requires Node 24 and npm.

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serves dist/ locally (runs in the background; stop it with `npx astro preview stop`)
npm test         # builds the site once, then checks every generated page
npm run og-image # regenerates public/og.png (only after changing name or role; commit the PNG)
```

## How it is organised

- `src/pages/`: one file per route. English lives at the root, Italian under `src/pages/it/` (served at `/it/`).
  No redirect based on the browser language: the URL you open is the page you get.
- `src/components/`: page templates shared by all languages.
- `src/layouts/Base.astro`: the shared HTML shell. From the page's `lang` and `route` key it renders `lang`,
  title, description, canonical URL, `hreflang` alternates (en, it, x-default), favicon, Open Graph and Twitter
  card meta (one shared image, `public/og.png`), Vercel Web Analytics (the `<Analytics />`
  component from `@vercel/analytics`: an inline module script that loads `/_vercel/insights/script.js`, served by
  Vercel; the only client-side script) and the footer ("Last updated" with the month in
  `src/data/site.ts`, localized, and the link to the same page in the other language). Pages can add tags to `<head>` with `slot="head"`
  (the homepage uses it for the JSON-LD `Person`). A page without a `route` (only the not-found page) gets
  `noindex` and no canonical, hreflang or language switch.
- `src/pages/404.astro`: the single not-found page Vercel serves for any unknown URL, in English and Italian.
- `src/pages/sitemap.xml.ts`: `/sitemap.xml`, generated from every route key in every language.
- `public/`: `favicon.svg` (initials), `og.png` (made by `scripts/og-image.mjs`), `robots.txt`.
- `src/i18n/routes.ts`: route keys and their paths; `localizedPath(lang, key)` gives the URL in a language.
- `src/i18n/ui.ts`: UI strings per language, typed.
- `src/data/`: content kept separate from markup (`profile.ts` holds the contact links and the CV URL, `career.ts`
  the Career page and `projects.ts` the Projects page in both languages, `site.ts` the `lastUpdated` month shown
  in the footer). Never add a phone number.
- `src/data/site.ts` `lastUpdated`: bump it (e.g. `"2026-11"`) when you edit content. The footer shows it, not
  the deploy date, so a redeploy without content changes keeps the same "Last updated".
- `public/tiziano-cappai-cv.pdf`: the single English CV, served at `/tiziano-cappai-cv.pdf` and linked from both
  homepages. To update it, replace the file keeping the name, after checking it has no phone number.
- `src/styles/global.css`: the whole stylesheet, inlined into every page.
- `tests/`: Vitest suite. `build.global-setup.ts` runs `astro build` once and `site.ts` reads the pages in `dist/`;
  each test file checks what a visitor or search engine receives:
  - `global.test.ts`: every page (title, description, `lang`, under 15 KB, no phone number, no JavaScript file, no
    client-side script other than Vercel Web Analytics);
  - `style.test.ts`: the stylesheet rules (system serif fonts, text width, dark mode, no animations, viewport);
  - `home.test.ts`, `career.test.ts`, `projects.test.ts`: the content of each page;
  - `cv-links.test.ts`: the CV PDF and the links to it;
  - `seo.test.ts`: Open Graph, favicon, JSON-LD, `robots.txt` and the sitemap;
  - `i18n.test.ts`: the Italian homepage, every page in both languages, canonical/hreflang, the language switch,
    the localized "Last updated" and no language-based redirect;
  - `not-found.test.ts`: the 404 page.

### Adding a page

1. Add a route key to `routes` in `src/i18n/routes.ts`, e.g. `career: "/career/"`.
2. Add its strings for every language in `src/i18n/ui.ts` (the type forces both).
3. Write one shared template in `src/components/` that renders `<Base lang={lang} route="career" title=… description=…>`.
4. Create `src/pages/career.astro` and `src/pages/it/career.astro`, each rendering the template with its `lang`.

The tests then check its canonical, hreflang, language-switch link, Open Graph meta, favicon and sitemap entry
automatically, and fail if one language is missing.

## Italian copy to review

The Italian text was drafted by an agent and is marked `REVIEW` in the source (`grep -rn REVIEW src`). The full
list of strings to check, and what "done" means, is in issue #9.

## Deploying

Vercel deploys every push to `main` to production; every other branch and pull request gets its own preview URL.
GitHub Actions (`.github/workflows/ci.yml`) runs `npm test` on every push to `main` and every pull request; Vercel
does not wait for it, so run `npm test` locally before pushing to `main`.
One-time setup (Vercel import, Web Analytics, `tizianocappai.com` DNS, sitemap submission) is in
[docs/launch.md](docs/launch.md). The site currently lives on `https://tizianocappai-website.vercel.app`, and canonical
and sitemap URLs use it (Astro `site` in `astro.config.mjs`, plus `public/robots.txt`); change both when the domain is attached.

Day-to-day deploys, rollbacks, content updates and dependency upgrades: [docs/maintenance.md](docs/maintenance.md).

## Quality pass

Lighthouse mobile and W3C HTML validation results, and the commands to re-run them locally, are in
[docs/quality-pass.md](docs/quality-pass.md).
