# Launch: Vercel, analytics and domain (done by Tiziano)

One-time steps. Step 0 (importing the project in Vercel) is done: the site is live at
<https://tizianocappai-website.vercel.app/>.
The DNS values below are the ones Vercel uses for most projects; if the Domains page in Vercel shows
different values for your project, use the ones it shows.

## 0. Import the project in Vercel

The repo already contains `vercel.json` (framework Astro, `npm ci`, `npm run build`, output `dist`), so no
settings need changing by hand.

1. Push the `main` branch to GitHub (`tizianocappai/personal-website`).
2. Sign in at <https://vercel.com> with your GitHub account (or create an account, Hobby plan is enough).
3. Go to <https://vercel.com/new>, under "Import Git Repository" click **Adjust GitHub App Permissions** if the
   repo is not listed, grant the Vercel app access to `tizianocappai/personal-website`, then click **Import** next to it.
4. On the "Configure Project" screen:
   - Project Name: `tizianocappai-website` (gives `https://tizianocappai-website.vercel.app`).
   - Framework Preset: **Astro** (auto-detected).
   - Root Directory: `./`.
   - Build and Output Settings: leave the defaults; `vercel.json` sets them.
   - Environment Variables: none.
5. Click **Deploy**. When it finishes, open the `*.vercel.app` URL shown on the success screen.
6. Check **Settings → Git**: Production Branch must be `main`. From now on:
   - every push to `main` deploys to production;
   - every push to any other branch (and every pull request) gets its own preview URL.
7. Check **Settings → Build and Deployment → Node.js Version** is `24.x` (matches `engines` in `package.json`).

## 1. Enable Vercel Web Analytics

Every page already loads `/_vercel/insights/script.js` (cookieless, no banner needed). Vercel only serves
that file once Analytics is on for the project, so do this **before or right after the first production deploy**:
until then the script returns 404 and the browser logs a console error (which also costs the Lighthouse
Best Practices score).

1. Vercel dashboard → project `tizianocappai-website` → **Analytics** tab → **Enable** (Hobby plan is enough).
2. Redeploy once (Deployments → latest → ⋯ → **Redeploy**) so the route is active.
3. Check: open `https://tizianocappai-website.vercel.app/_vercel/insights/script.js`; it must return JavaScript, not 404.
   Visit a page, then after a minute the Analytics tab shows the visit, with the referrer (where people found you).

## 2. Attach tizianocappai.com

1. Vercel → project → **Settings → Domains** → **Add Domain** → type `tizianocappai.com` → **Add**.
   When Vercel offers it, pick the recommended option: add `www.tizianocappai.com` too, redirecting to
   `tizianocappai.com`. The apex (`tizianocappai.com`) must be the primary domain: canonical URLs, hreflang
   and the sitemap all use `https://tizianocappai.com`.
2. At the registrar where you bought the domain, open the DNS settings for `tizianocappai.com`:
   - delete any existing `A`, `AAAA` or `CNAME` records for `@` and `www` (parking pages, registrar defaults);
   - add these records:

     | Type  | Name / Host | Value                  | TTL          |
     | ----- | ----------- | ---------------------- | ------------ |
     | A     | `@`         | `76.76.21.21`          | default/3600 |
     | CNAME | `www`       | `cname.vercel-dns.com` | default/3600 |

   - if the domain has `CAA` records, add `0 issue "letsencrypt.org"` (otherwise Vercel cannot issue the HTTPS
     certificate). No CAA records at all is fine.

   Alternative: instead of the records, set the domain's nameservers to `ns1.vercel-dns.com` and
   `ns2.vercel-dns.com` and Vercel manages the whole DNS zone (then email records, if any, must be recreated
   in Vercel).
3. Back in Settings → Domains, wait until both entries show **Valid Configuration** (minutes, up to 48 h for
   DNS to propagate). Vercel issues the HTTPS certificate on its own.
4. Check from a terminal:

   ```sh
   dig +short tizianocappai.com          # 76.76.21.21
   dig +short www.tizianocappai.com      # cname.vercel-dns.com. then an IP
   curl -sI https://tizianocappai.com/ | head -1          # HTTP/2 200
   curl -sI https://www.tizianocappai.com/ | grep -i location   # https://tizianocappai.com/
   ```

## 3. Optional: redirect tizianocappai.it

1. Buy `tizianocappai.it`.
2. Vercel → same project → Settings → Domains → **Add Domain** → `tizianocappai.it`. In the domain's
   **Edit** panel choose **Redirect to Another Domain** → `tizianocappai.com`, status code **301 Moved Permanently**.
   Do the same for `www.tizianocappai.it` (redirect to `tizianocappai.com`, 301).
3. DNS for `tizianocappai.it` at its registrar:

   | Type  | Name / Host | Value                  |
   | ----- | ----------- | ---------------------- |
   | A     | `@`         | `76.76.21.21`          |
   | CNAME | `www`       | `cname.vercel-dns.com` |

4. Check: `curl -sI https://tizianocappai.it/career/` returns `301` with
   `location: https://tizianocappai.com/career/` (the path is kept).

Do not point `.it` at the Italian pages: the Italian site already lives at `https://tizianocappai.com/it/`,
and a second copy would split search ranking.

## 4. After go-live

- Google Search Console (<https://search.google.com/search-console>): add the **Domain** property
  `tizianocappai.com` (verify with the TXT record it gives you, added at the registrar or in Vercel DNS), then
  **Sitemaps** → submit `https://tizianocappai.com/sitemap.xml`.
- Re-run the quality pass against production (see `docs/quality-pass.md`): Lighthouse on the real domain
  includes the real analytics script and HTTPS.
- Review and approve the Italian copy (issue #9) before announcing the site.
