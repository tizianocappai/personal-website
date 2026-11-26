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

- `src/pages/`: one file per route. English lives at the root.
- `src/components/`: page templates shared by all languages.
- `src/layouts/Base.astro`: the shared HTML shell (head, `lang`, main landmark).
- `src/i18n/ui.ts`: UI strings per language, typed.
- `src/data/`: content kept separate from markup (`profile.ts` holds the contact links). Never add a phone number.
- `src/styles/global.css`: the whole stylesheet, inlined into every page.
- `tests/`: Vitest suite. `build.global-setup.ts` runs `astro build` once; the tests parse the HTML in `dist/` and
  check what a visitor or search engine receives (title, description, `lang`, page under 15 KB, no phone number,
  no client-side script, stylesheet rules, homepage content).

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
