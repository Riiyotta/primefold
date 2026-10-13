# Changelog

## 0.1.0 - initial build (design-review-pending)

Built from: `CLONE_SPEC.md`, `specs/*.md`, `specs/cms-data.json`, `tailwind.config.js`, `src/index.css`, `src/**`, `public/assets/MANIFEST.md`.

Counts: 34 sections, 10 primitives, 18 components, 13 templates, 29 routes, 17 asset roles, 11 destination roles, 2 form-endpoint roles, 20 graph rules, 181 tokens.

### Source-vs-IA discrepancies found (stated plainly)

1. `ia.json`, `IA.md`, `matrix.csv` and the project README treat all 12 non-home templates as `content.<template>-body` placeholders "pending recon". The recon specs already exist in `specs/`. This repo replaces those placeholders with 24 measured section contracts; the IA files were left untouched (read-only) and are stale.
2. IA claims only `shell.navbar` and `shell.footer` are shared. In reality `conversion.cta-band` is rendered by all 13 templates, and info cards / title rows / CMS heroes are shared across templates.
3. IA says whether the navbar starts transparent on non-home pages is "still being measured". `src/layout/Layout.jsx` settles it: overlay on `/`, `/company`, `/security` and the two product routes; solid white everywhere else.
4. IA lists the route `/404`; `src/App.jsx` has only the `*` catch-all. Modelled as route `/404` with `appRoutePattern: "*"`.
5. Route count (29), template count (13), the 12 blog slugs and 3 case-study slugs were re-derived from `ia.json`, `src/App.jsx` and `specs/cms-data.json` and agree. Asset inventory: `public/assets` holds 250 files recursively (59 at top level), not 63.
6. `src/pages/ExperienceIntelligence.jsx` and `RealEstateIntelligence.jsx` are placeholders; the product implementation under `src/pages/product/` is unmounted and imports files that do not exist yet (`SolutionsTabs.jsx`, `product.css`).
7. The contact and newsletter forms are inert in this clone (no live endpoint in source), contrary to the assumption that they post somewhere.
8. `CookieBanner.jsx` is not mounted; the footer "Cookie Settings" button is dead.
9. The RI colour appears three ways on the live site (rgb(202,123,87) hero badge, rgb(233,116,0) plans badge, #EA7500 chat accent); all three are recorded rather than normalised.

### Verification at build time

See the final build report; commands: `python3 extraction/verify_all.py`, `python3 schema/tests/adversarial_test.py`, `python3 extraction/prove_drift.py`.
