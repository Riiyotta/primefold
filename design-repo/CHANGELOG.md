# Changelog

## 0.2.0 - clone/generation modes, generation-safe assets, R6-R10 baseline, SaaS policy binding

Counts now: 39 sections, 10 primitives, 18 components, 13 templates, 29 routes, 24 asset roles, 11 destination roles, 2 form-endpoint roles, 2 content roles, 36 graph rules, 181 tokens, 1 clone example + 12 generation examples.

* **Baseline failure fixed at the root.** verify_all failed because fact `readme-not-for-deployment` cited `README.md:3`; commit d21a833 emptied the project README. No other source file states the reference/study-only constraint, so it is now recorded as a design-repo decision in `policy/design-policy.json` `sourceUsage` (with honest history), the fact was replaced by `cms-copy-not-transcribed` (`specs/cms-data.json:5`, supporting evidence), an absence record watches README.md, and `verify_all.py` checks the constraint is recorded. The legal notice and manifest note no longer quote the README.
* **PageSpec `mode`** (`clone` | `generation`, required, closed). pageSpecVersion 1.0.0 -> 1.1.0; the existing example became `clone`. Optional `theme`, `brand {name, domain}`, `node.styleTokens`, and `assetRef` on asset objects; asset sources gained `user-supplied`. The schema is now generated from the contracts (`extraction/build_schema.py`; the generator reproduced the previous 34 section blocks exactly before any change) and checked for staleness.
* **Asset roles** restructured into one `roles` list with `class`, `clonePolicy` (was `generationPolicy`) / `cloneAssetSources`, `availability` (`clone-only` / `generation-safe` / `blocked-for-generation`), `generationAssetSources`, `generationSafeSubstitutes`, `generatedModeGuidance`. Seven new generation-safe asset roles and two content roles. Owner artwork may now be reused (`reuse-exact`) in clone mode for fidelity. `PINNED_AVAILABILITY` lives in both `verify_all.py` and `semantic_validate.py` and the two copies are compared.
* **Generation-mode rules** `GENERATION_MODE_BRAND / _ASSET / _PERSON / _CUSTOMER / _SCREENSHOT / _COPY / _CLAIM / _URL / _EMBED`, from `schema/source-patterns.json` (built by `extraction/build_source_patterns.py` from the real source with file:line evidence; 6384 hashed copy shingles from 640 source strings; lorem-ipsum placeholder text excluded). Product-badge enum selectors gained neutral values (`primary`/`secondary`/`own`). New dynamic slugs are allowed in generation mode for `blog/:slug` and `case-studies/:slug`, and slugs are scanned for brand terms.
* **Token rules** `TOKEN_UNKNOWN / _RAW_VALUE / _ARBITRARY_SPACING / _UNSUPPORTED_FONT / _SLOT_CATEGORY / _THEME_COMBINATION` on the new `styleTokens`; `token-policy.json` declares slots, raw-value patterns and theme text-on-surface combinations. This supersedes the 0.1.0 note that no override field existed.
* **R6/R9.** Section heights measured at 1440px for every rendered route; three whole-page sections decomposed into 8 semantic sections (`content.legal-prose`, `content.article`, `content.case-study` removed). `extraction/wrapper_gate.py` wired into verify_all (0 errors, 0 warnings, empty whitelist).
* **R7/R8.** `source`/`semantic` on all 39 contracts (generated, ranges re-read from the source), closed `schema/section-contract.schema.json`, `retrievalReason` on the 6 spec-only sections, `RETRIEVAL_INELIGIBLE` pinned in both validators and the allowlist.
* **Requirement 10.** Manifest `category: saas` + `designPolicy` binding to `n0-saas-design-constraints-common` 0.1.0 (commonIr 0.5, hard-and-soft) with a recomputed `contentHash`; evidence in `policy/design-policy.json`. Pending architecture review.
* Adversarial suite: 98 -> 187 checks (generation leakage, badges, unsupported branded roles, tokens, retrieval, registry-only edits, wrapper-gate cases, generation controls). `prove_drift.py` gained `--scratch DIR` and 21 new scenarios.
* IA sync: `ia.json` / `IA.md` / `matrix.csv` regenerated for the 39 sections.
* Not done / caveats: no human reviewed the pinned patterns, pins or the policy binding (agent attestation, not a human sign-off); detection is string-based; visual parity with the live site was not measured.

## 0.1.2 - IA synced

The project's `ia.json`, `IA.md`, `matrix.csv` and README were updated to mirror this repo's 13 templates and 34 sections (the 12 `content.*-body` placeholders are gone). Item 1 and 2 under "Source-vs-IA discrepancies" below describe the state before that sync. No design-repo contract changed.

## 0.1.1 - deny-list false positives

`assets/asset-roles.json` `realIdentities.people` listed bare first names (e.g. "Sarah", "Leon"), which rejected any placeholder text containing them. Full names stay whole-word matches anywhere; bare first names moved to `peopleFirstNamesOnly` and are rejected only when the entire field equals the name. Added one control and one mutation to the adversarial suite (98 checks).

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
