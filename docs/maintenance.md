# Deploy, manutenzione e aggiornamenti

Guida operativa per il sito già online. Il setup una tantum (import su Vercel, Web Analytics, dominio
`tizianocappai.com`, Search Console) è in [launch.md](launch.md); i comandi base sono nel [README](../README.md).

## In breve

```sh
git switch main && git pull
# … modifiche …
npm test                 # build + tutti i controlli: deve passare prima di ogni push
git commit -am "…"
git push origin main     # Vercel pubblica in produzione in 1-2 minuti
```

## 1. Deploy

Il deploy è automatico, non c'è nessun comando da lanciare.

| Push su                        | Risultato                                                   |
| ------------------------------ | ----------------------------------------------------------- |
| `main`                         | deploy di **produzione** (URL pubblico e dominio)           |
| qualsiasi altro branch o PR    | deploy di **preview** con un URL suo, commentato nella PR   |

Vercel esegue `npm ci` e `npm run build` (da `vercel.json`) e pubblica `dist/`. **Non esegue i test**: non c'è CI
su GitHub, quindi `npm test` va lanciato in locale prima del push. Un build che fallisce su Vercel non tocca la
produzione: resta online l'ultimo deploy riuscito.

### Lavorare con una preview (consigliato per modifiche grandi)

```sh
git switch -c feat/nome-modifica
git push -u origin feat/nome-modifica
gh pr create --fill      # Vercel commenta la PR con l'URL di preview
```

Controlla la preview, poi fai il merge della PR su `main`: parte il deploy di produzione.

### Verificare un deploy

- Vercel → progetto `tizianocappai-website` → **Deployments**: l'ultimo deploy di produzione deve essere
  **Ready** e puntare al commit appena pushato.
- Apri il sito e controlla la pagina modificata, in entrambe le lingue (`/…` e `/it/…`).
- `curl -s https://tizianocappai-website.vercel.app/_vercel/insights/script.js | head -c 80` deve restituire
  JavaScript, non 404 (Analytics attivo).

### Tornare indietro

- **Preferito: `git revert`.** Annulla il commit difettoso con un nuovo commit e pusha: la storia resta pulita e il
  deploy segue `main` come sempre.

  ```sh
  git revert <sha>
  npm test && git push origin main
  ```

- **Emergenza: Instant Rollback.** Vercel → Deployments → deploy precedente funzionante → ⋯ →
  **Instant Rollback**. È immediato ma, finché è attivo, i nuovi push su `main` **non** vanno in produzione in
  automatico. Dopo aver sistemato il codice, rimettilo a posto con **Undo Rollback** (o promuovi il nuovo deploy).

## 2. Manutenzione dei contenuti

Dove sta cosa (dettagli nel README, sezione "How it is organised"):

| Cosa vuoi cambiare             | File                                                             |
| ------------------------------ | ---------------------------------------------------------------- |
| Contatti, link, URL del CV     | `src/data/profile.ts`                                            |
| Pagina Carriera                | `src/data/career.ts`                                             |
| Pagina Progetti                | `src/data/projects.ts`                                           |
| Titoli, descrizioni, etichette | `src/i18n/ui.ts` (il tipo obbliga a compilare entrambe le lingue)|
| CV                             | `public/tiziano-cappai-cv.pdf` (sostituisci tenendo lo stesso nome) |
| Immagine di anteprima social   | `npm run og-image`, solo se cambiano nome o ruolo; committa il PNG |

Checklist per ogni modifica di contenuto:

1. Aggiorna **sempre entrambe le lingue** (inglese alla radice, italiano sotto `/it/`).
2. Aggiorna `lastUpdated` in `src/data/site.ts` (es. `"2026-12"`): è la data "Last updated" del footer. Un deploy
   senza modifiche di contenuto non la cambia.
3. Niente numero di telefono, da nessuna parte (CV compreso): i test lo controllano sulle pagine.
4. Lavori per clienti: solo il settore, mai il nome del cliente (vedi commento in `projects.ts`).
5. Se cambi contenuti che hanno un test dedicato (`tests/*.test.ts`), aggiorna il test.
6. `npm test`, commit, push.

Testi marcati `REVIEW` nel codice sono bozze ancora da rivedere: `grep -rn REVIEW src`.

## 3. Aggiornare le dipendenze

Le dipendenze sono poche: `astro`, `@vercel/analytics`, `vitest`, `node-html-parser`, `@resvg/resvg-js`.
Ritmo consigliato: un controllo al mese, più subito in caso di avvisi di sicurezza.

### Aggiornamenti minor e patch (routine)

```sh
git switch -c chore/deps-AAAA-MM
npm outdated             # cosa c'è di nuovo
npm update               # aggiorna entro i range di package.json e riscrive package-lock.json
npm audit                # vulnerabilità note
npm test
npm run build && npm run preview   # controllo a occhio in locale, poi `npx astro preview stop`
```

Committa `package.json` **e** `package-lock.json` insieme (Vercel installa con `npm ci`, che usa il lockfile), apri
la PR, controlla la preview, fai il merge.

### Aggiornamenti major (es. Astro 7 → 8)

Uno alla volta, in un branch dedicato:

1. Leggi la guida di upgrade ufficiale (per Astro: <https://docs.astro.build/en/guides/upgrade-to/>) e il changelog.
2. Per Astro usa l'assistente ufficiale: `npx @astrojs/upgrade`. Per gli altri:
   `npm install <pacchetto>@latest`.
3. Applica le breaking change indicate (di solito in `astro.config.mjs` o nei componenti).
4. `npm test`, poi controlla la preview su Vercel prima del merge.
5. Dopo un upgrade di Astro rifai il quality pass ([quality-pass.md](quality-pass.md)): Lighthouse e validazione
   HTML possono cambiare con l'output generato.

### Versione di Node

La versione è dichiarata in tre posti, che devono restare allineati:

- `.nvmrc` (`24`): quella usata in locale (`nvm use`);
- `engines.node` in `package.json` (`>=24`);
- Vercel → **Settings → Build and Deployment → Node.js Version** (`24.x`).

Quando passi a una nuova versione LTS (o Vercel ritira quella in uso), aggiorna tutti e tre nello stesso branch,
`npm ci && npm test` in locale con la nuova versione, poi verifica la preview.

## 4. Versioni del sito

Il sito non ha numeri di versione: la "versione" in produzione è l'ultimo commit su `main`, e ogni deploy su
Vercel è legato al suo commit (visibile in Deployments). Per segnare un punto di riferimento (es. un redesign),
usa un tag Git:

```sh
git tag -a v2026.12 -m "Nuova pagina Progetti"
git push origin v2026.12
```

Per rivedere una versione vecchia in locale: `git switch --detach v2026.12 && npm ci && npm run dev`.

## 5. Controlli periodici

- **Ogni pochi mesi:** quality pass (Lighthouse + validazione HTML, [quality-pass.md](quality-pass.md)) sulle
  pagine di produzione; aggiorna la tabella "Last run".
- **Ogni pochi mesi:** Google Search Console, errori di indicizzazione e sitemap (`/sitemap.xml`).
- **Rinnovo del dominio:** scadenza e rinnovo automatico presso il registrar di `tizianocappai.com`. Il
  certificato HTTPS lo rinnova Vercel da solo.
- **Link esterni:** che funzionino ancora i link nelle pagine (LinkedIn, GitHub, demo e siti dei progetti).
