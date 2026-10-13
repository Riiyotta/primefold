# Primefold clone

Local React 18 + Vite + Tailwind v3 replica of https://primefold.ai/, built for reference and study. Not for public deployment.

```bash
npm install && npm run dev
```

## Information architecture

`ia.json` is the single source of truth and the only IA file to hand-edit. `IA.md` (readable doc) and `matrix.csv` (section × template matrix) are **generated**; don't edit them by hand.

```bash
node validate.mjs   # hard checks: route sum, template count, section references, categories
node build.mjs      # regenerates IA.md and matrix.csv
```

Status: **draft**. Routes and templates come from the live `sitemap.xml` (29 URLs) and `src/App.jsx`. Only the home template has a measured section breakdown (from `CLONE_SPEC.md`). Each other template currently carries a single `content.<template>-body` placeholder until its recon spec lands in `specs/`.

### What the data shows so far

- 3 templates (Blog post, Legal document, Case study) account for 18 of the 29 routes (62%). They are CMS-style detail pages driven by one layout each, so the per-page build effort is in the other 11 routes, which span 10 templates.
- Only 2 sections are shared today: `shell.navbar` and `shell.footer`, on all 29 routes. All 9 home body sections are single-use, so they stay page-local until a second template is shown to reuse one. `conversion.cta-band` and `proof.testimonials` are the likeliest candidates; recon will confirm.
- Every route uses the full navbar + footer chrome (`chrome="full"`). Whether the navbar starts transparent or solid on non-home pages is still being measured.
