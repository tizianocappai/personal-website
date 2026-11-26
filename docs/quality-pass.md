# Quality pass

The manual quality bar from spec #1: Lighthouse 100 in Performance, Accessibility, Best Practices and SEO on
mobile for every page, and valid HTML. Everything runs locally; no page is uploaded to an external service.
Tools are fetched with `npx` on demand, so they are not project dependencies.

## Last run: 2026-11-26 (ticket #7, local build)

Lighthouse 12.8.2, `--form-factor=mobile` (default simulated slow 4G and CPU throttling), headless Chrome,
against `astro preview`.

| Page                      | Performance | Accessibility | Best Practices | SEO   |
| ------------------------- | ----------- | ------------- | -------------- | ----- |
| `/`                       | 100         | 100           | 100            | 100   |
| `/projects/`              | 100         | 100           | 100            | 100   |
| `/career/`                | 100         | 100           | 100            | 100   |
| `/it/`                    | 100         | 100           | 100            | 100   |
| `/it/projects/`           | 100         | 100           | 100            | 100   |
| `/it/career/`             | 100         | 100           | 100            | 100   |
| `/404.html` (not found)   | 100         | 100           | 100            | 63 \* |

\* Expected, not fixed on purpose: the not-found page carries `noindex` (spec: it has no URL of its own and stays
out of search results), so the `is-crawlable` audit fails. It is the only failing audit. In production Vercel also
serves it with status 404, which Lighthouse does not score at all.

Homepage on simulated mobile: FCP 0.6 s, LCP 1.1 s, TBT 50 ms, CLS 0. Page weights 2.2 to 6.0 KB (budget 15 KB).

HTML validation, all 7 pages:

- W3C Nu HTML Checker (`vnu` 26.11.26, the engine behind validator.w3.org, run locally): 0 errors, 0 warnings.
- html-validate 9.7.2, `html-validate:recommended`: 0 errors, 0 warnings.

Nothing needed fixing.

## How to re-run

```sh
npm run build

# HTML: W3C Nu checker, local. Needs Java (npx vnu-jar) or the native build from
# https://github.com/validator/validator/releases (vnu.osx.zip / vnu.linux.zip, then vnu-runtime-image/bin/vnu).
npx vnu-jar $(find dist -name '*.html')                    # with Java
npx html-validate@9 $(find dist -name '*.html')            # no Java: stricter lint-style checks

# Lighthouse: the analytics script is served by Vercel, not by astro preview. Give the preview an empty stub
# so it does not 404 (a 404 logs a console error and costs Best Practices), then remove it.
mkdir -p dist/_vercel/insights && : > dist/_vercel/insights/script.js
npx astro preview --port 4329 &
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"   # macOS
for r in / /projects/ /career/ /it/ /it/projects/ /it/career/ /404.html; do
  npx lighthouse@12 "http://localhost:4329$r" --form-factor=mobile \
    --only-categories=performance,accessibility,best-practices,seo \
    --chrome-flags="--headless=new" --output=html --output-path="lh-$(echo $r | tr / _).html" --quiet
done
# Astro 7 runs the preview as a background server (pid in its output); `astro preview stop` stops it.
npx astro preview stop && rm -rf dist/_vercel
```

After go-live, run the same Lighthouse loop against `https://tizianocappai.com` (no stub needed): that includes
the real analytics script, HTTPS and Vercel's headers.
