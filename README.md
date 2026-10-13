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

Status: **draft**. Routes and templates come from the live `sitemap.xml` (29 URLs) and `src/App.jsx`. Every template's section list mirrors `design-repo/templates/templates.json`, and the 34 section contracts live in `design-repo/sections/` (measured from `CLONE_SPEC.md` and `specs/`). The two product templates are spec-only: their source pages are still in progress, so their six sections have no `implementedBy`.

### What the data shows so far

- 3 templates (Blog post, Legal document, Case study) account for 18 of the 29 routes (62%). They are CMS-style detail pages driven by one layout each, so the per-page build effort is in the other 11 routes, which span 10 templates.
- 6 sections are shared across templates: `shell.navbar`, `shell.footer`, `conversion.cta-band`, `features.info-card-grid`, `content.card-grid` and `hero.index-intro`. The navbar and footer are on all 29 routes and the CTA band is on all 13 templates. The other 28 sections are single-use and stay page-local.
- Every route uses the full navbar + footer chrome (`chrome="full"`). The navbar overlays the hero on `/`, `/company`, `/security` and the two product routes, and is solid white elsewhere (`src/layout/Layout.jsx`).
