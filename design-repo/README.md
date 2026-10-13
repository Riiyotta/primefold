# Primefold design-repo

A machine-validated PageSpec system for generating new on-brand pages in the style of the Primefold marketing site, without inventing colours, copy budgets, sections or assets.

Status: **design-review-pending** (`productionApproved: false`).

**Source:** a React 18.3.1 + Vite 5 + Tailwind 3.4 clone of the LIVE commercial site https://primefold.ai/ (Framer-built). The clone's own README says it is "built for reference and study. Not for public deployment." Treat primefold.ai as a real company: customer logos, people, testimonial names and proprietary copy must not be reproduced; see `assets/asset-roles.json`.

## What is in here (counts recomputed from disk by `extraction/verify_all.py`)

| Layer | Count |
|---|---|
| tokens (foundation + semantic + component + layout) | 181 in 15 files (+ theme `light`, LLM catalog/policy/allowlist) |
| primitives | 10 |
| components | 18 |
| sections (contracts) | 34 |
| templates | 13 |
| routes (each bound to exactly one template) | 29 |
| closed asset roles / destination roles / form-endpoint roles | 17 / 11 / 2 |
| compatibility-graph rules | 20 |

```
tokens/{00-foundation,10-semantic,20-component,30-layout,themes,llm}
primitives/  components/  sections/        one JSON contract per id
templates/templates.json  templates/routes.json
compatibility/graph.json
assets/asset-roles.json                     closed asset/destination/endpoint role registry + licensing
schema/{pagespec.schema.json, example.pagespec.json, semantic_validate.py, tests/adversarial_test.py}
extraction/{measured-values.json, verify_all.py, prove_drift.py}
```

## Run the checks (python3 + `jsonschema` only; paths derive from `__file__`)

```
python3 extraction/verify_all.py            # structure, parity, counts, citations, pinned asset policies, schema + validator
python3 schema/tests/adversarial_test.py    # every mutation must be rejected; every control must pass
python3 schema/semantic_validate.py schema/example.pagespec.json
python3 extraction/prove_drift.py           # copies the repo to a scratch dir, injects drift, proves verify_all fails
```

Citations (`path:line-range`) point into the source project and its specs. They are resolved when a sibling source tree exists next to `design-repo/`; with no sibling tree `verify_all.py` prints WARN and still passes structurally. Each ledger entry also carries a `quote` that must appear inside the cited range, so a citation that is in range but describes the wrong code is caught too.

## Honest scope notes

* **The IA groundwork is stale.** `ia.json` / `IA.md` / the project README say every non-home template is "pending recon" with one placeholder `content.<template>-body` section. `specs/product-pages.md`, `specs/plans-security-contact-404.md`, `specs/company-careers-legal.md`, `specs/blog-case-studies.md` and `specs/cms-data.json` exist and were mined here: the 12 non-home templates have real section contracts (24 of the 34 sections are specific to non-home templates, and `conversion.cta-band` is shared by all 13 templates). `ia.json` was not edited and `node validate.mjs` still passes.
* **Evidence levels.** Every template is `measured` in a spec; none is merely inferred. `unmeasured` lists on each section name what the specs say was not captured (Resources/Company dropdown styles, form submit states, shader pixels, XI/RI card variant geometry, ...).
* **Product pages are measured but not implemented in the source tree.** `/experience-intelligence` and `/realestate-intelligence` still render "building…" placeholders in `src/pages/*.jsx`; `src/pages/product/*` is an in-progress, unmounted implementation. Their sections have status `spec-only-source-in-progress` and `retrievalEligible: false`.
* **Forms are inert.** The contact form and both newsletter forms `preventDefault()` and send nothing. The real site's endpoints were never cloned, so the roles `endpoint.contact-form` / `endpoint.newsletter-form` are pinned to `must-not-reuse-live-endpoint` and PageSpecs can only say `endpoint: "project-owned-placeholder"`.
* **Dead/unusual:** `CookieBanner.jsx` is not mounted anywhere, so the footer "Cookie Settings" button (which dispatches `pf:cookie-settings`) does nothing. The router has no `/404` route; `*` renders NotFound (ia.json lists `/404`).
* **Fonts:** `ABC Favorit Trial Book` is a TRIAL-licensed face; do not ship it. Stack Sans Headline/Text and Inter come from Google-Fonts-style builds; confirm licences before redistributing.
* **Reduced motion is NOT handled across the source.** Per-section `motion.reducedMotionHandledInSource` records the truth (yes: 5, partial: 2, no: 26, unknown: 1). The contract's required `reducedMotionFallback` states what a generated page must do regardless.
* **No per-instance token override exists in a PageSpec** (node = section, variant, content, motion), so there is nothing to validate at that layer; see `tokens/llm/token-policy.json`.
* Motion budget rules, a dark theme and per-block legal prose are not modelled: the site has no dark mode and legal text is deliberately not transcribed.

## Asset-role contract (summary)

Policies (closed enum): `may-generate-new`, `must-reuse-exact`, `must-not-fabricate`, `must-not-reuse-live-endpoint`. Weighty roles are pinned in `extraction/verify_all.py` (`PINNED_POLICIES`) so changing a role to a different-but-valid policy fails verification: brand.logo-mark, brand.wordmark-ghost, brand.product-badge, brand.site-icons, customer.logo, customer.imagery, person.team-photo, person.author-avatar, embed.video-facade, and every `dest:*` / `endpoint.*` role.

Link targets in a PageSpec are internal routes, anchors, or `dest:<role>`; a literal live URL (calendly, xi.primefold.ai, personio, help.primefold.ai, social profiles, mailto) cannot be expressed.

## Snapshot warning

This repo is a snapshot of a moving project (see MASTER-GUIDE 3.10). `extraction/measured-values.json` re-diffs framework versions, file counts and stated source facts when a sibling tree is present.
