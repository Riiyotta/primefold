Source: https://primefold.ai/experience-intelligence , https://primefold.ai/realestate-intelligence

# Product pages — `/experience-intelligence` (XI) and `/realestate-intelligence` (RI)

I measured both pages on 2026-10-13 using an isolated headless Chromium (Playwright) at **1440x900**, **810x900** and **390x844**. I cross-checked the numbers against Framer's component source:
- XI page module: `MyEJzwIjLPLPB3GDg6ULy7yIPJb7kItX0bqSz3GuESw.DJbr51fy.mjs`
- RI page module: `ZvJDaWChcHTKO0hEJTaXAsv48erGVses1MnJn1tN374.A6eOrS-P.mjs`
- RI card/sources components: `zJcM_n2tx.CmbWQ_nh.mjs`
- Hero chat and rays: `viHSWmqGM.DGC2-LWj.mjs`

All modules live under `https://framerusercontent.com/sites/1C0xbF1SKgnQ0Z1nYjvdiv/`. Values are computed styles unless marked "(source)".

Global tokens, fonts, text styles, pill buttons, eyebrow spinner, Lenis and stacking are covered in `CLONE_SPEC.md §0`. Reuse them; this file does not repeat them.

**Both pages use ONE template.** Build a single `ProductPage` with a `variant: 'xi' | 'ri'` content object. The section order (DOM) is the same on both pages:

| # | Section (Framer name) | Status |
|---|---|---|
| 0 | Navbar | **REUSE `Navbar` (identical)**. The initial state is the same as home: "Desktop Transparent" over a dark hero (white logo, white links, glass "Sign in", white "Book a call"). It switches to "Desktop Blurred BG" after `#nav-trigger` (y=100) leaves the viewport. On mobile it is the transparent collapsed bar with a white hamburger. |
| 1 | Hero (dark, WebGL rays + live chat demo) | NEW |
| 2 | Content sheet → `#how-it-works` wrapper | Same mechanics as home §3: radius 16 16 0 0, padding-top 16, z-index 4, translate(80,80)→0 scroll offset. **Difference: the sheet bg is `#ffffff`, not `#FAF9F8`.** |
| 2a | "Ask. Understand. Act." — 3 illustrated step cards | NEW (XI and RI have different illustrations) |
| 2b | Use cases — sticky "Used by" + scroll-highlighted list ("CX And insight teams") | NEW |
| 2c | Sources ("Trust Section") | NEW layout. The left list resembles home Trust but has no indicator. The right column is a Lottie (XI) or the "A3 Sources" loop (RI). |
| 2d | Solutions — "Built for every team." tabbed panel ("Outcomes" frame) | NEW. **Not** the home Solutions carousel. |
| 2e | The loop — 4 small cards | NEW |
| 3 | CTA | **REUSE `CTA` with differences**: XI shows a second button at desktop only; RI is identical to home. |
| 4 | Footer | **REUSE `Footer` (identical)**, including the Ghost Wordmark and `#footer-trigger`. |

These home components do **not** appear on these pages: Testimonials carousel, logo ticker, Outcomes digit roll, home Trust indicator, home Solutions carousel, and the A1 Loop (though the RI illustrations reuse A1 primitives — see 2a/2c).

Cookie banner: same as home §11.

Meta:
- XI: title `Experience Intelligence — Primefold`; description `Every survey, review, ticket and call read together — and answered as one prioritised decision your team can act on. Ask in plain language, act the same day.`
- RI: title `Real Estate Intelligence — Primefold`; description `Underwriting, rent rolls, leases and capex answered in one conversation — with the clause and line item behind every number. Built for asset managers.`
- Both use og:image `assets/kCEvWj6X9M889dINz1Dophu60Y8.png` (existing).

Document height (1440): XI **6588**, RI **6467**. At 810: XI 7374. At 390: XI 9540.

Reference images:
- `reference/pages/{experience-intelligence,realestate-intelligence}-{1440,390}-fullpage.png`
- `reference/pages/states/*` — hero, card loop frames, sources frames, tabs, use-case, CTA

Extracted original source (reference only): `specs/product-pages-src/hero-live-conversation-and-rays.js`.

---------------------------------------------------------------------------------------------------

## 1. Hero

### Layout @1440
- `section` 100% x **900** (`min-height:100vh`), bg `rgb(26,24,20)`, padding `88px 20px`, `display:flex; align-items:center; justify-content:center`.
- **No parallax.** Unlike home, the hero scrolls normally and Content simply follows it (measured hero top = −scrollY).
- Background layer: absolute `inset:0`, `overflow:hidden`, bg `#0B0B0C`, containing the WebGL canvas (§1.3).
- Inner row: max-width 1280 (x 80..1360), vertically centered (top y=197), height 507.

| | XI | RI |
|---|---|---|
| Row gap | **48** | **56** |
| Left column width | **672** | **612** |
| Chat window width | **560** | **612** |

- Left column: `flex-direction:column; gap:20px`, vertically centered in the row.
  - Eyebrow row (gap 16, align center): badge 20x20 (`assets/pages/experience-intelligence/icon-xi-badge-20.svg` teal rgb(32,131,116) / `assets/pages/realestate-intelligence/icon-ri-badge-20.svg` rgb(202,123,87)), then label Inter 16/24 500 −0.16px #fff: `Experience Intelligence` / `Real Estate Intelligence`.
  - Text block (gap 16): h1, then p.
  - Buttons row (gap 12, 40px pills): **White** `Book a call` → calendly, then **Transparent White Text** (glass, `rgba(255,255,255,.12)` + blur 10px, white text).
    - XI second button: `Start free trial` → `https://xi.primefold.ai/auth/sign-in?next=/home` (external).
    - RI second button: `See how it works` → `./realestate-intelligence#how-it-works` (the Content/How It Works section id).
    - Buttons are the global pill Button (§0.6), including the glow hover.

Copy:
- h1 XI: `Built to find the value in every voice.` (2 lines @1440)
- h1 RI: `Built to grow asset value.` (2 lines @1440)
- p XI: `XI brings every signal into one place. Ask, and get the analysis, the report, the strategy.` (1 line @1440)
- p RI: one paragraph, 2 sentences, ~25 words, 2 lines @1440, same style.

Typography:

| Role | Style |
|---|---|
| h1 | Stack Sans Headline 400, **56/67.2**, ls **1.12px** (0.02em), #fff. 810: 48/57.6 ls .96px. 390: 42/50.4 ls .84px. Same family at every width (no ABC Favorit swap here). |
| p | Inter 400 16/24 −0.16px, **rgb(203,199,192)** |

### 1.1 Responsive
- **810:** row stays horizontal. Left column 361 wide, chat 361x564, gap 48. Inner row x 20..790, y 168..732. h1 wraps to 3 lines (173 tall). The chat switches to its compact "phone" layout because its width is < 480 (§1.2).
- **390:** column, gap 48. The hero grows to fit content: **height 1137** (padding 88 top/bottom). Left column 350 at y 88. Chat 350x598 at y 451. Nav overlays the top.

### 1.2 Live Conversation chat (custom code component "Live Conversation")
Props on page (source): `version: 'XI' | 'RI'`, `charsPerTick: 3`, `holdSeconds: 3.8`, `autoAdvance: true`, `layoutMode: 'auto'`. Compact mode applies when the component width is < 480 (810 and 390).

Font for the whole component: `"Inter","Inter Placeholder",system-ui,sans-serif` with `font-feature-settings: "cv09" 1, "ss11" 1, "calt" 0, "liga" 0` and antialiased smoothing.

Tokens (source):
- `$ = #1A1814`
- `panel = #282622`
- `border = rgba(255,255,255,.12)`
- Window shadow: `0 2px 2px rgba(0,0,0,.12), 0 0 0 2px rgba(0,0,0,.24), 0 0 0 1px rgba(255,255,255,.18)`
- Body shadow: `0 1px 2px rgba(36,36,36,.04), 0 0 0 1px rgba(0,0,0,.08)`
- Chip shadow: `0 1px 1px rgba(38,57,91,.1), 0 0 0 1px rgba(38,57,91,.16)`
- Accent: XI `#208374`, RI `#EA7500`. Note the RI accent is #EA7500, which differs from the RI page-eyebrow badge colour.

Structure (desktop values; compact values in brackets):
1. **Window**: column, padding 2, radius 18, bg `$`, window shadow, overflow hidden.
2. **Header** (height 47 [42], padding 0 16, space-between, centered):
   - Title Inter 16 [15]/24 500 ls −0.176px #fff: `Experience Intelligence` / `Real Estate Intelligence`.
   - Badge 20x20 radius 4 bg accent, text `XI`/`RI` 12.1px 700 ls −0.133px #fff, centered.
3. **Body**: bg `#282622`, radius 16, body shadow, padding **32px 30px** [16px 16px], position relative.
   - min-height = (tallest prompt's content height + 2×vertical padding). The tallest height is measured from hidden "ghost" renders of every prompt, so the body never jumps. Without measurement use 308 + 64. Measured body height @1440 = 396.
   - Content column gap **38** [18]:
     - **Ask row** (flex, gap 16 [12], align center, justify flex-end):
       - Bubble: bg `$`, border 1px border-token, radius `12px 4px 12px 12px`, padding 8 12, `max-width: calc(100% − 52px)` [44].
       - Text: Inter 14 [13]/20 [18] 500 ls −0.084px #fff.
       - Avatar img 36 [30] round, `object-fit:cover`: `assets/pages/experience-intelligence/avatar-default-72.png`.
       - The row enters with `@keyframes pfconv-in { from {opacity:0; transform:translateY(6px)} to {opacity:1; transform:none} }` `.22s ease-out` on every prompt change.
     - **Answer block** (column, gap 16, align flex-end):
       - Row (gap 16 [12], align start, width 100%):
         - Badge 32 [28] radius 6.4 bg accent, `XI`/`RI` 19.4 [17]px 700 ls −0.213px #fff.
         - Bubble: flex 1, bg #282622, same border, radius `4px 12px 12px 12px`, padding 8 12, min-height 76 [none]. Text style as the ask bubble.
         - While typing, append a cursor span `▌` at opacity .7.
       - Results (column gap 8, width `calc(100% − 48px)` [100%]). **opacity 0 while typing → 1 when done, `transition: opacity .35s`**:
         - Tiles row (gap 12 [6], row [column]). Each tile: flex 1, bg #282622, border, radius 12, padding 16 [12], column gap 8 [4], min-height 104 [none].
           - Value: Inter 24 [20]/32 [26] 500 ls −0.36px #fff, nowrap with ellipsis, followed by an optional star icon (24 [20], fill = accent).
           - Label: 12 [11]/16 [14] 400 #fff opacity .5.
         - Source chips (gap 8, wrap). Each chip: bg `$`, border, radius 8, padding `6px 10px 6px 8px` [`4px 8px 4px 6px`], gap 6, icon 16, label 12 [11]/16 500 #fff nowrap.
4. **Prompt bar**: relative.
   - Scroller: flex, gap 8, padding 12 16 [10 12], `overflow-x:auto`, scrollbar hidden, `overscroll-behavior-x:contain`, plus a trailing 61px spacer.
   - Pills: padding 8 12 [6 10], radius 999, chip shadow, Inter 14 [13]/20 500 ls −0.084px, nowrap, cursor pointer, `transition: background .2s, color .2s`.
     - Active: bg #fff, text `$`.
     - Inactive: bg `rgba(255,255,255,.12)`, text #fff.
   - Edge fades: absolute, 77px wide, `linear-gradient(to right|left, #1A1814, rgba(26,24,20,0))`, `transition: opacity .25s`.
     - Left fade shows when `scrollLeft > 4`.
     - Right fade shows when not at the end. Initial: left 0, right 1.
   - The active pill is scrolled to center (`scrollTo({behavior:'smooth'})`), clamped.
   - Measured @1440: bar 60 tall, pills 36 tall.

**Behaviour (source):**
- `setInterval(24ms)`: each tick adds 3 characters of the answer.
- When the answer is complete, wait `holdSeconds·1000/24` ticks (3.8s), then move to the next prompt (mod count) and reset to 0 characters.
- Clicking a pill jumps to that prompt and restarts typing.
- `prefers-reduced-motion`: show the full answer statically, with no ghosts and no auto-advance.
- One cycle ≈ typing (~1.0–1.1s for ~130 chars) + 3.8s hold → ~5s per prompt, ~15s per loop.

Content (verbatim; `q` = pill label, `ask` = bubble text, tiles as value / label, chips as label (icon)):

| | XI (accent #208374) | RI (accent #EA7500) |
|---|---|---|
| 1 q | `Why did NPS drop in DACH last quarter?` | `What is the WALT across the Frankfurt portfolio?` |
| 1 ask | `Why did NPS drop in DACH last quarter?` | `What is the WALT across the Frankfurt portfolio, and where is it weakest?` |
| 1 answer | `Not the product - delivery communication. Missing dispatch notice on Hamburg-fulfilled orders drives it. Fix the notification, not the roadmap.` | `The average hides it: one tenant with a 2027 break carries two of the three weakest assets. Re-letting risk sits in Frankfurt-Ost.` |
| 1 tiles | `-11 pts`/`NPS, DACH, Q2` · `63%`/`of detractors cite delivery comms` · `4.6`★/`product quality, same cohort` | `4.2 yrs`/`portfolio WALT` · `3 assets`/`below 2.1 yrs` · `€2.9M`/`rent exposed to one tenant` |
| 1 chips | Pulse_Q2.csv (sheets), Zendesk (zendesk), Trustpilot (trustpilot) | Lease_4.02.docx (word), Rent roll Q2 (excel), Lease schedule (doc) |
| 2 q | `What should we fix first?` | `Which leases have break options in 2027?` |
| 2 ask | `Of everything customers complained about this quarter, what should we fix first?` | `Which leases have break options in 2027, and what rent is at stake?` |
| 2 answer | `Dispatch notifications – widest reach, one owner, no roadmap slot needed. Checkout address validation is second.` | `Four of the eleven need notice before 31 Dec 2026 — two of those sit below market rent, so renegotiation favours you.` |
| 2 tiles | `#1`/`Dispatch notifications` · `38%`/`of negative feedback touched` · `1 team`/`owns the fix` | `11 leases`/`with 2027 breaks` · `€6.4M`/`passing rent at stake` · `4`/`notice deadlines in 2026` |
| 2 chips | Priority model (chart), Pulse_Q2.csv (sheets), Zendesk (zendesk) | Lease_4.02.docx (word), 38 lease PDFs (pdf), Market rent (chart) |
| 3 q | `Which accounts are about to churn?` | `Does asset 4.02 justify the capex request?` |
| 3 ask | `Which enterprise accounts are showing churn signals right now?` | `Does the €1.8M capex request on asset 4.02 justify itself?` |
| 3 answer | `One pattern across all nine: unresolved escalation, then silence. Seven are still reachable - close the loop this week.` | `Not as submitted — most of the spend is envelope work that does not lift rent, and the 2027 break gates the re-let. Phase it.` |
| 3 tiles | `9 accounts`/`at elevated risk` · `€1.4M`/`ARR exposed` · `7`/`reachable this week` | `€0.7M`/`defensible now` · `62%`/`of spend not rent-accretive` · `2027`/`break gates the rest` |
| 3 chips | CRM (cloud), Pulse_Q2.csv (sheets), Call notes (phone) | Capex_4.02.pdf (pdf), Lease_4.02.docx (word), Valuation 2025 (doc) |

The chip icons (16x16 inline SVG paths for sheets/zendesk/trustpilot/excel/word/pdf/chart/cloud/phone/doc) and the star path are in the extract file, function `Be` / `Ve`.

### 1.3 Hero background — "rays" WebGL shader (source `et`/`tt`; full GLSL in the extract)
- Full-bleed canvas over `#0B0B0C`.
- Backing resolution = CSS size × `min(devicePixelRatio,1.5) × 0.75`; resize is debounced 120ms. WebGL options: `alpha:false, antialias:false, powerPreference:'low-power'`.
- Props on page: `logo:false` (the centre mark is not drawn).
  - XI: `colorMode:'teal'` → `uMix = (0.22, 1.75)`, i.e. a strong teal ray from the lower-left plus a faint orange ray from the upper-right.
  - RI: `colorMode:'orange'` → `uMix = (2.2, 0.12)`, i.e. a strong orange ray from the upper-right plus a faint teal ray.
- Shader constants: BG `vec3(.0431,.0431,.0471)`, TEAL `vec3(.2471,.8196,.7373)` (#3FD1BC), ORANGE `vec3(.9765,.6157,.4471)` (#F99D72).
- Shader behaviour: two noisy "rays" flow toward the point (0.62·aspect, 0.5), with sway/flicker/surge animated by `uTime` (seconds), plus film grain ±0.0175.
- Pointer glow: `window` mousemove → target uv. The mouse position lerps 0.06/frame and the glow amount lerps 0.05/frame.
- rAF runs only while intersecting (IntersectionObserver threshold 0) and while the document is visible.
- Reduced motion: renders one frame at `uTime = 40`.
- See `reference/pages/states/*-hero.png` for the look. A static fallback could be a screenshot crop of that.

### 1.4 Hero motion summary
- No appear animations on the hero text (it renders immediately).
- Chat typing loop (§1.2), rays shader (continuous), pill hover per global Button.

---------------------------------------------------------------------------------------------------

## 2. Content sheet / `#how-it-works`
- `div[Content]`: bg **#fff**, radius `16px 16px 0 0`, padding-top 16, z-index 4, overflow clip. It contains two hidden spacers (1x300, 1x500) as on home.
- `section#how-it-works`: bg #fff, column, centered.
  - Scroll-linked translate `(80px,80px)` at scrollY 0 → `(0,0)` once the 500px spacer has scrolled out. Measured 100→64, 300→32, 600→0.
  - Spring: stiffness 500, damping 60, mass 1, bounce .2 (source; identical to home §3).
  - **Disabled at 390** (no transform).
- The geometry below is the un-transformed layout. Absolute x values in raw dumps include the +80 offset.

### 2a. "Ask. Understand. Act." step cards (`Ask-Read-Decide`)
- Wrapper column, gap **56** (390: 32).
- Title block: max-width 1320, padding `120px 20px 0` (390: `80px 20px 0`). Title stack width 620 (390: 350), gap 16.
  - Eyebrow `Ask. Understand. Act.` (global Eyebrow).
  - H2 (section H2 style 48/56 → 44/48 → 32/40): XI `From question to strategy in a conversation.` / RI `From question to strategy in a conversation` (RI has no trailing period). The source has a run of spaces before "in"; it renders as 2 lines @1440 (112 tall). Render as `From question to strategy<br>in a conversation.`
- Cards grid: max-width 1320, padding `0 20px 32px`, gap 16.
  - **1440:** `grid-template-columns: repeat(3, 416px)`, i.e. `max((min(100vw,1320px) − 72px)/3, 300px)` (source width expression).
  - **810:** 2 columns of 377; the third card wraps to row 2, left.
  - **390:** 1 column of 350.
- Card: 416x**498**, bg **rgb(250,250,249)**, radius 16, overflow clip, column.
  - Illustration area 416x**362** (full width, top).
  - Text block: padding `0 32px 32px`, inner column gap 8, centered text:
    - Step label: Inter 14/20 500 −0.084px rgb(97,97,97) — `01 - Ask` / `02 - Understand` / `03 - Act`.
    - h3: Stack Sans Headline 20/28 400 rgb(26,24,20).
    - p: Inter 14/20 −0.084px rgb(84,82,78), 2 lines.
  - At 390, cards 1–2 are 518 tall because the text wraps to 3 lines.

| | h3 | p |
|---|---|---|
| XI 01 | `Ask in plain language` | `Ask the question you need answered, or build the survey to get it. XI handles the rest.` |
| XI 02 | `Reads every signal` | `Surveys, tickets, reviews and comments, read together, in full context.` |
| XI 03 | `Know what to do next` | `The answer, what to do first, and the evidence behind it. Prioritized by impact.` |
| RI 01 | `Ask in plain language` | `RI finds the relevant leases, amendments and rent rolls for you.` |
| RI 02 | `Reads every document` | `Every lease, rent roll and facility agreement read in full context.` |
| RI 03 | `Know what to do next` | `The recommendation, with every figure and clause traceable to its source. Clear next steps.` |

#### XI illustrations (light, on the card bg) — reference `reference/pages/states/experience-intelligence-cards-*.png`

**XI 01 "Ask" — prompt card.**
- Container 308x100, centered: `translate(-50%,-50%)` at left 50%, top ≈ 50% of the 362 area (box at y +161 in the card).
- Frame: bg `rgba(0,0,0,.04)`, radius 16, padding 2.
- Header row 32 tall, padding 6 12, space-between: Primefold wordmark 83x16 (dark; reuse `svg/logo-dark.svg` scaled), XI badge 20.
- Inner panel: white, radius 14, padding 12, row gap 12:
  - Text 244 wide, Inter **16/20 500 −0.16px #000**, 2 lines: `Which accounts are at highest risk this quarter?`
  - Send button 24x24 (orange rounded square with an up arrow, see frames).
- Appear (source): whole box `opacity 0, y 30` → `1, 0` on in-view (threshold .5, **replays every time**: animateOnce false). Tween .3s `[.44,0,.56,1]`.
- Text effect: **per-character** appear `filter: blur(3px), opacity .001, y 3` → none. Spring bounce 0, duration .4, **stagger .025s/char**. Trigger in-view, threshold .5, no repeat.

**XI 02 "Understand" — orbit.** Variant component "XI - 02 Card Animation".
- Centre: a 97px white disc with the Primefold mark.
- Four concentric dashed rings (stroke `rgba(0,0,0,.16)`, width .9, dash 1.81) of diameter ≈150 / 196 / 336 / 306, rotated to fixed angles.
- Rings rotate continuously (`loop`, linear): ring 1 **−360° / 9s**, ring 2 **+360° / 10s**, ring 3 **−360° / 11s**, ring 4 **+360° / 12s**. Icons on a ring counter-rotate so they stay upright.
- On the rings sit: 32px white circular source-icon badges (icons 20px — `IqTCcF1NoPgN3HPveLsmOfTTe4.svg`, `9euztWnrazUfkGrAoTxTOQk9fls.svg`, `HrV7906XM5NNguIDPaNODeUaGek.svg`, `YBfKsuVihJd5As1b5tx0UaIR8rg.svg`, `DOaHKQwBKxFj1mHniDaFfbQJcNk.svg` in `assets/pages/experience-intelligence/`) and 14–20px dots, each a white circle overlaid by a teal `rgb(62,209,188)` circle whose opacity toggles.
- Top and bottom fades: 94px-tall gradients `rgba(250,250,249,0)` → `rgb(250,250,249)` at 75.5%.
- Variant timeline (source, starts when ≥50% in view, **restarts each time it re-enters**; out of view = "Static"):
  `V1 →1.0s→ V2 →0.1s→ V3 →1.0s→ V4 →0.1s→ V5 →1.0s→ V6 →0.3s→ V7 →1.0s→ V8 →0.2s→ V9 →1.0s→ V10 →0.3s→ V11 (end, holds)`.
- In each step one icon badge shrinks 32→8px and slides toward the centre ("absorbed"), and dots switch white→teal.
- Default variant transition: tween .2s `[.44,0,.56,1]`. V5, V9 and V11 switch instantly (duration 0).
- Total ≈ 6s, then holds with all dots teal.
- Per-variant positions were not decoded; see frames `-cards-01…18`.

**XI 03 "Act" — chat + charts.** Variant component "XI Card Animation 1": 300x266, centered.
- Column gap 12.
- Question bubble (right-aligned): bg rgb(68,66,62), radius `12px 2px 12px 12px`, padding 8 12, ring `0 0 0 1px rgba(0,0,0,.08)`, text 12/16 500 rgb(250,249,248): `Which accounts are at highest risk this quarter?`
- Answer bubble (left): white, radius `2px 12px 12px`, same ring, text 12/16 500 #000: `Three DACH accounts at risk.`
- Two chart cards 144x178 (gap 12): white, radius 12, ring, padding 12. Each has a title Inter 10/12 500 #000 at opacity .5: `NPS by Region` / `Ticket volume by week`.
  - Chart 1: 5 bars, 20 wide, radius `4px 4px 0 0`, colours `rgb(228,172,145)` (orange) / `rgb(119,178,169)` (teal). They grow from 1px.
  - Chart 2: a donut (164px SVG) that rotates/draws in.
- Timeline (source, in-view-triggered, threshold .5, replays; obscured = "Stop"; initial "Design"):
  `1 →2.0s→ 2 →1.0s→ 3 →0.5s→ 4 →0.5s→ 5 →0.5s→ 6 →0.5s→ 7 →0.5s→ 8 →0.5s→ 9 (end)`.
- Transitions used: tween .4s `[.44,0,.56,1]` (default); .5s `[.5,0,.88,.77]`; .2s `[.5,0,.88,.77]`; .5s `[.24,.94,.5,1]`; 1s `[.24,.94,.5,1]`.
- Bubble text uses the same per-char blur appear as XI 01 (onMount).
- Rough sequence: question appears (1), answer appears (2–3), chart cards fade in, bars grow one by one (4–8), donut draws (9).

#### RI illustrations (dark panels) — reference `reference/pages/states/realestate-intelligence-cards-*.png`
These reuse the **home A1 Loop visual primitives** (`HowItWorks.jsx` A1: Orb with "Silk" shader + Rim + Gloss, Branch dash/lit/pulse, conic "Reading sweep", answer card with a gradient border). Factor those primitives out and reuse them.

Common frame:
- Illustration area padding `8px 8px 12px`.
- Panel 400x342 (810: 361x342, 390: 334x342), bg `rgb(11,11,12)`, radius 10, overflow clip.
- Full-cover still: `BStpgcNqGi2wH3pDgwuVOsCemOs.jpg` (01), `2fSp0Y2vmM6Y6mRapzzC4MFGi0o.jpg` (02), `EHWB7ZohB5b8RN5R7CDd7jgf9VY.jpg` (03).
- All three run as one **21.7s orchestrated loop**: each card idles while the others play.
- Orb loop: scale 1→**1.06** mirror, 1.2s `[.45,0,.55,1]`.
- Reading sweep: rotate 360° linear **2.4s** loop. Both pause offscreen.
- Silk orb fallbacks: `assets/pages/realestate-intelligence/{IOC8KC5jHMKOyyOmPw4p500iQ0,ZDaM2SysifJo4vNRlqD2XT4ZeA,5duIkDB521lrS5tEAbwfVbu4Bk,WaXGrKsucEq11Bllm3bTIjrtr3s,wbc8wA3nHVWejtaLLWxiGp0m8}.png`, plus home's `KjnavIi882…png` and `LVowx7Fq4n…png`.

**RI 01 "A2 Ask"** — states `01 Rest →0.8s→ 02 Ask →2.6s→ 03 Sent →0.4s→ 04 Hold →17.3s→ 05 Fade →0.6s→ Rest`.
- Content column (304 wide, gap 14, centered):
  - Orb 40.
  - Greeting `What would you like to find out?` (Inter 14/20 500 rgb(251,249,246)).
  - Composer 304x92: bg rgb(27,26,22), radius 12, shadow `0 12px 32px rgba(0,0,0,.35)`, padding 12, gap 10.
    - Placeholder `Ask about your data, or describe what you want to find out…` 12/16 rgba(255,255,255,.4).
    - During "Ask" the typed text is `Which leases have break options in 2027, and what rent is at stake?` (12/16 rgb(251,249,246)).
    - Actions row: "+" button 22x22 r6 bg rgb(40,38,34) (13px rgb(203,199,192)); send 22x22 r6 bg rgba(255,255,255,.35) with `↑` 12px 600 rgb(18,17,13). The send button turns white when text is present.
  - Chips (gap 6):
    - `Search lease contracts`: bg rgba(202,123,87,.14), text rgb(249,157,114) 11/14 500, radius 8, padding 6 10.
    - `Compare contracts`: bg rgba(255,255,255,.03), text rgb(203,199,192).

**RI 02 "A2 Understand"** — states `01 Rest →5.3s→ 02 Find →1.4s→ 03 Read →2.0s→ 04 Think →2.6s→ 05 Done →9.8s→ 06 Fade →0.6s→ Rest`.
- Diagram 348x272: Orb 56 centre; Bloom 216 `radial-gradient(50% 50%, rgba(202,123,87,.45) 0%, rgba(39,168,150,.22) 45%, rgba(39,168,150,0) 70%)`.
- 6 branches: dashed lines that light up with `linear-gradient(90deg, rgba(39,168,150,.35), rgb(63,209,188))`, plus a 7–10px pulse dot `rgb(63,209,188)` with glow `0 0 8px 2px rgba(63,209,188,.55)`.
- 6 file tiles 130x38: bg rgba(255,255,255,.06), radius 10, padding `0 8px 0 6px`, gap 6.
  - Icon 24 circle bg rgba(63,209,188,.16).
  - Name 10.5/13 500 rgb(251,249,246); type 9.5/12 rgb(124,120,114).
  - "Read" check 14 circle rgb(63,209,188).
  - Left: `Lease 4.02`/Lease, `Lease 2.11`/Lease, `Lease 7.04`/Lease. Right: `Addendum 3`/Amendment, `Rent roll Q2`/Rent roll, `Facility agr.`/Contract.
- Conic sweep 68: `conic-gradient(rgba(202,123,87,0) 0deg, … 200deg, rgb(202,123,87) 280deg, rgb(63,209,188) 340deg, transparent 360deg)`, masked to a ring.
- Status line (12/16 500): `Reading 38 documents ›` → `Comparing 11 leases with market rent ›` (rgb(161,156,148)) → `Read 38 documents · 11 leases ›` (rgb(203,199,192)). Crossfade.

**RI 03 "A2 Act"** — states `01 Rest →11.5s→ 02 Asked →2.0s→ 03 Answer →2.6s→ 04 Press →0.25s→ 05 Trace →4.75s→ 06 Fade →0.6s→ Rest`.
- Panel padding 14 16, gap 10.
- Question pill (right): bg rgb(53,51,46), radius 10, padding 7 10, 12/16 rgb(251,249,246): `Which leases have break options in 2027, and what rent is at stake?`
- Answer card 368x260:
  - 1px gradient border `linear-gradient(135deg, rgba(249,157,114,.55) 0%, rgba(255,255,255,.08) 38%, rgba(255,255,255,.08) 62%, rgba(63,209,188,.5) 100%)`, radius 14, shadow `0 24px 60px rgba(0,0,0,.45)`.
  - Body bg rgb(22,21,19), radius 13, padding 12, gap 10.
  - Answer text 12.5/17 rgb(240,238,234): `4 of 11 leases need notice before 31 Dec 2026. Renegotiate the 2 below market rent first.`
  - Result card: bg rgba(255,255,255,.03), radius 10, padding 10, gap 7. Title `Rent at stake · 2027 break options` 11.5/15 500. Four bar rows (label 10.5/14 rgb(203,199,192) 64w, value 10.5/14 rgba(255,255,255,.5) 38w, track 204x6 r3 rgba(255,255,255,.07), fill rgb(63,209,188)):
    - Lease 4.02 · €1.9M · fill 194
    - Lease 2.11 · €1.4M · fill 143
    - Lease 7.04 · €1.1M · fill 112
    - Lease 3.08 · €0.8M · fill 82
  - "Press" → "Trace": a Clause preview overlays the bars. Bg rgb(30,29,27), radius 10, shadow `0 -8px 24px rgba(0,0,0,.45)`, padding 10 12. Source line `Lease 4.02.pdf · §4.3` (9.5/12 500 rgba(255,255,255,.5)), then a highlight block bg rgba(249,157,114,.2) r4 padding 3 5 containing `The Tenant may terminate this lease as of 30 June 2027 on 6 months' notice.` (11/15 rgb(240,238,234)).
  - Source chips (gap 4): `Lease 4.02`, `Lease 2.11`, `Rent roll Q2`. Each bg rgba(255,255,255,.05), r8, padding `3px 7px 3px 3px`, icon 16 r5 rgba(255,255,255,.07), label 10/13.
  - Next-step chip `Build a notice-deadline calendar`: bg rgba(255,255,255,.05), r9, padding 6 10, 11/14.
  - While "thinking", a centered 59px orb with blur(6px) blooms in.
  - A large conic sweep (900px) runs behind the border while answering.

### 2b. Use cases (sticky list) — Framer "CX And insight teams"
- Section height **1500** (all widths), bg #fff, padding `0 20px`.
- **Sticky panel**: `position:sticky; top:120px`, 1280x**720**, `display:flex; align-items:center; gap:200px`, overflow clip.
  - 810: gap 50, 770 wide.
  - 390: `top:80px`, column, gap 40, padding `40px 0`, height 648.
- Left "Used by" block 296 wide: one `p` Inter **24/32 500 ls −0.48px rgb(33,33,33)** with `<br>`-separated lines.
  - XI: `Used by:` / `Marketing` / `Customer Experience` / `Product` / `HR / People`
  - RI: `Used by:` / `Asset managers` / `Investment teams` / `Property managers`
- Right list (784 wide @1440; 810: 424; 390: 350): column gap **24** (390: 16). Each item is an h2 Stack Sans Headline **40/48 ls .8px #000** (810: 36/40 ls .72; 390: 32/36 ls .64), wrapper **opacity .4**.
  - XI: `Survey creation & analysis`, `Churn detection`, `Campaign & concept testing`, `Brand tracking`, `Employee pulse`, `NPS scoring`
  - RI: `Underwriting`, `Lease abstraction`, `Lease break & notice tracking`, `Covenant monitoring`, `Capex planning`, `Investor reporting`
- **Scroll highlight** (source `onScrollTarget`, threshold .5):
  - 6 invisible 20x1 markers sit in a 1x900 column (`justify-content:space-between`) starting **300px below the section top**, spaced **~180px**.
  - Item *n* goes to opacity **1** when marker *n* reaches the viewport middle, and back to **.4** when marker *n+1* does. The last item stays 1.
  - Measured @1440 (section top at y 1850): item 1 active at scrollY 1620–1770, item 2 1820–1970, item 3 2020–2120, item 4 2170–2320, item 5 2370–2470, item 6 ≥2520.
  - Only one item is active at a time. Before item 1 activates, all are .4.
  - The opacity transition duration was not measured; use ~.3s ease.

### 2c. Sources ("Trust Section")
- Section bg #fff, overflow clip. Inner max-width 1320, padding `88px 20px` (390: `44px 20px`), `display:flex; flex-wrap:wrap; gap:32px 56px; align-items:center`.
- Heights @1440: XI 828, RI 763.
- **Left column** (XI 612x652; RI 604x587), column `justify-content:space-between`:
  - Title (gap 16):
    - Eyebrow `Sources`.
    - H2 (section H2 style, 2 lines): XI `XI reads the channels you already use.` / RI `RI reads the channels you already have.`
    - p Inter 14/20 rgb(84,84,84), 2 lines, one paragraph of 2–3 sentences (~25 words).
  - Spacer: XI 140, RI 75.
  - List (gap 24). Each item is a column with gap 6: icon 24x24 = CSS mask (`assets/pages/experience-intelligence/mask-sources-{connects,traceable,hosted}.svg`, bg #000), title Inter 16/24 500 −0.16px rgb(33,33,33), desc 14/20 rgb(84,84,84):
    1. `Connects in minutes` — `Plug in the channels you already use. No setup project, no IT ticket.`
    2. `Every answer is traceable` — XI `Click any citation to see the response it came from.` / RI `Click any citation to see the clause or line item it came from.`
    3. `Hosted in Germany` — `Your data is stored on servers in Germany, built to GDPR requirements. We do not use your data to train AI models.`
- **Right column XI**: 612x652 DotLottie canvas (transparent bg). File `assets/pages/experience-intelligence/0wnxkqSd8yM0mNqNViIMBD53E.json`; props `autoplay:true, loop:true, speed:1, direction:1, controls:false, hover:false`.
  - Shows the "XI" hub (teal disc) with radial spokes to the labels Surveys / Email / E-Commerce / CRM / Data & Analytics / Support / Forms / Social & Chat, with brand logos animating along the spokes.
  - 810: 357x380. 390: 350x373.
- **Right column RI**: panel 620x587, bg #FAF9F8, radius 16, padding 8. Inside, the **"A3 Sources"** loop 604x571: bg rgb(11,11,12), radius 10, still image `assets/pages/realestate-intelligence/2qCwMSdou8S5NHxbINBs0qpKA0.jpg` (cover).
  - Diagram 494x445 scaled .95, centered.
  - Column labels `DOCUMENTS` / `SYSTEMS`: Inter 10.5/14 500 ls .84px rgb(161,156,148).
  - 8 tiles 179x46: bg rgba(255,255,255,.06), r12, padding `0 10px 0 8px`, gap 8.
    - Icon 23 circle rgba(63,209,188,.16) with a 13px glyph.
    - Title 12/15 500 rgb(251,249,246); detail 10/13 rgb(124,120,114).
    - "Connected" check 13 rgb(63,209,188).
    - Left: `Leases & addenda`/`PDF, DOCX, scanned`, `Rent rolls`/`Excel, CSV, PMS export`, `Capex schedules`/`Budgets, tenders`, `Valuations`/`External reports`.
    - Right: `Property management`/`PMS exports`, `Data room`/`Deal folders`, `Shared drive`/`Team folders`, `Inbox`/`Deal correspondence`.
  - 8 branches to the centre Orb 61 (label `RI` 11/14 600 ls .66px rgb(203,199,192)); Bloom 228 (as 2a).
  - Deliver beam 2x89 `linear-gradient(rgb(249,157,114), rgba(202,123,87,.6))` with a glowing 8px spark.
  - Answer card 323x86: 1px border `rgba(202,123,87,.8)`, outer ring `0 0 0 4px rgba(202,123,87,.12)`, shadow `0 24px 60px rgba(0,0,0,.45)`; body rgb(22,21,19) r13 padding 12 14 gap 9.
    - Text `Break option on 4.02: 30 Jun 2027, 6 months' notice.`
    - Citation chip `Lease 4.02 · §4.3` with a ↗ icon.
  - Clause card 310x67 (bg rgb(30,29,27), starts opacity 0 scale .96): `Lease 4.02 · §4.3 Break option` + highlighted `The Tenant may terminate this lease as of 30 June 2027 on 6 months' notice.`
  - States (source): `01 Rest →0.8s→ 02 Connect →3.6s→ 03 Read →2.4s→ 04 Answer →1.6s→ 05 Trace →1.6s→ 06 Hold →1.4s→ 07 Fade →0.6s→ Rest` (12.0s loop).
    - Connect: tiles get their checks one by one.
    - Read: branches light up and the sweep spins.
    - Answer: beam, then answer card.
    - Trace: clause card scales in.
  - Mobile uses separate `M0x` variants with the same timings.
  - 810: 349x556; 390: 334x556.
- Responsive: at 810, both columns are 357/349 wide side by side. At 390 they stack (left 350, then the visual).

### 2d. Solutions — "Built for every team." (tabbed; Framer "XI Solutions Tab" / "RI Solutions Tab")
- Frame max-width 1320, padding `64px 20px 120px` (390: `44px 20px`), height 772 @1440.
- Content column gap **56** (390: 32).
- **Header row** (`justify-between; align-items:flex-end; flex-wrap:wrap; overflow:clip`):
  - Title stack 550: eyebrow `Solutions` + H2 `Built for every team.`
  - Tab bar (right-aligned): bg rgb(250,249,248), radius 999, padding 2, height 44, no gap.
    - Tab: padding 10 12, height 40, radius 999, label Inter 14/20 500 −0.084px rgb(26,24,20).
    - Active: bg #fff, `box-shadow 0 0 0 1px rgba(0,0,0,.08)`, label opacity 1.
    - Inactive: bg transparent, shadow `0 0 0 1px rgba(0,0,0,0)`, label opacity .7.
    - Switching tabs animates the pill via **spring bounce .2, duration .4** (source).
  - The bar keeps its natural width (571 XI / 431 RI). **At 390 it overflows and is clipped** (no scroll) — see `m390` frame / fullpage.
  - XI tabs: `CX manager` (107w), `Marketing manager` (155), `HR / People manager` (165), `Product Manager` (140).
  - RI tabs: `Asset manager` (125), `Investment manager` (161), `Property manager` (145).
  - The tab click swaps the panel instantly (no crossfade measured; the new panel is fully opaque within 50ms).
- **Panel** (row, gap 16, wrap; 1440: 400 + 864, both **440 tall**; 810: 377 + 377; 390: stacked 350 + 350):
  - **Image card**: radius 16, shadow `0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)`, padding 32, column `justify-end`, overflow clip.
    - Image cover (radius 16).
    - Bottom overlay 210 tall: `linear-gradient(rgba(8,8,8,0) 0%, rgb(9,9,9) 100%)`.
    - Content (336 wide, gap 8): h3 Stack Sans Headline 20/28 #fff; p Inter 14/20 −0.084px rgba(255,255,255,.72); then the **Transparent White Text** pill `Book a call` → calendly (111x40).
  - **Dark card**: bg rgb(40,38,34), radius 16, same shadow, padding 32, column `justify-end`.
    - **Ticker block** (top ~96px from the card top; 3 rows, gap 22, each row 38 tall, full card width, overflow hidden). Pills are spaced by gap 12:
      - Decorative blank pills: bg rgba(255,255,255,.12), radius 12, `box-shadow inset 0 2px 2px rgba(255,255,255,.12)`, height 38, widths from the set {65, 82, 156, 163, 177, 301}.
      - Exactly one quote pill per repeat: bg rgb(26,24,20), radius 12, ring `0 0 0 1px rgba(0,0,0,.08)`, height 36, padding 8 12, text Inter 14/20 500 −0.084px #fff.
      - Sequences: row 1 [Q1, 82, 163, 301, 82] (period ≈ 970px); row 2 [Q2, 156, 65, 301, 65] (≈ 901px); row 3 [177, 301, 177, Q3] (≈ 1029px).
      - **Motion: continuous marquee, measured 40.6 px/s** (≈ Framer ticker speed 40). Rows 1 and 3 move **left**, row 2 moves **right**. No hover pause measured.
    - **Bottom "What comes back"** (800 wide, gap 8):
      - Row of two equal columns: h5 `What you get` (Stack Sans Headline 20/28 #fff) | right-aligned p `Answers in minutes, not hours.` (14/20 rgba(255,255,255,.72) at opacity .56). RI Investment tab uses `First-pass underwriting in minutes, not hours.`
      - Then a description p 14/20 rgba(255,255,255,.72): 1 line @1440, 1–2 sentences (~20–30 words).

Tab content (h3 / p / three quote pills / image):

| Tab | p (verbatim) | Quote pills (verbatim, typographic quotes as shown) | Image |
|---|---|---|---|
| XI CX manager | `See what's driving churn, who it affects, and what to do next.` | `“What changed since the last survey?”` · `“Which issues should we fix first?”` · `“Which detractors need follow-up, and why?”` | `pages/experience-intelligence/T4r3OA3ib810aHqjuLi9sIekZKM.png` |
| XI Marketing manager | `Know what resonates, what doesn't, and what to say next.` | `“Which messages resonate most with new customers?”` · `“What nearly stopped them from buying?”` · `“What are customers saying we should talk about next?”` | `oDu9rBQj2pjQjM50wLlU1MCgB8.png` |
| XI HR / People manager | `See what's happening across your teams, and know what to act on.` | `“What is driving attrition in engineering?”` · `“Did the onboarding change work?”` · `“Where is manager effectiveness slipping?”` | `s1XiWILmhO3B0XHJDGmhFUf3sAU.png` |
| XI Product Manager | `Talk to your users. Know what to build next, ranked by impact.` | `"Where do new users get stuck?"` · `"Did the last release fix it?"` · `"What should we build next, and why?"` (straight quotes in source) | `slBwYVOaDkn5GnPvuz0O86xwSY.png` |
| RI Asset manager | `Know where risk sits before it reaches the board pack.` | `“Where is re-letting risk concentrated?”` · `“Which notice deadlines fall in the next 12 months?”` · `“Which tenants carry the most lease risk?”` | `pages/realestate-intelligence/fPL5khSQQDMO551QMFXPouhArqM.png` |
| RI Investment manager | `Underwrite a new asset from the data room, not from a summary someone typed.` | `“Does the rent roll match the leases?”` · `“How exposed is the asset if its two largest tenants leave?”` · `“Where does the seller's model overstate income?”` | `94wMcHYvQKN0EvsPTHwC63Mey4.webp` |
| RI Property manager | `Answer tenant questions without digging through leases.` | `“Who pays for the roof repair under this lease?”` · `“When is the next rent indexation?”` · `“What was agreed in the latest amendment?”` | `nWq4TnjSO2IQxV8JX3SqO9paY.webp` |

The h3 equals the tab label. "What comes back" descriptions are prose; recorded only as structure above (one paragraph, 1–3 sentences each).

### 2e. The loop
- Wrapper column, gap 56 (390: 32), padding-bottom 88. Height 670 (XI) / 614 (RI) @1440.
- Title row: max-width 1320, padding `120px 20px 0` (390: `80px 20px 0`), `flex-direction:row; justify-content:space-between; align-items:flex-end` (390: column).
  - Left stack 620 (810: 381): eyebrow `The loop` + H2 — XI `XI intelligence learns your language with every answer.` (3 lines @1440) / RI `RI learns your vocabulary with every answer.` (2 lines).
  - Right p: max-width **428**, right-aligned block, Inter 14/20 −0.084px **rgb(33,33,33)**, 3 lines, ~35 words.
- Cards grid: padding `0 20px`, gap **24**.
  - 1440: 4 × 302.
  - 810: 2 × 373 (2 rows).
  - 390: 1 × 350.
- Card: height 202 (810/390: 182 or 162), bg rgb(250,250,249), radius 12, shadow `0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)`, padding 24, column gap 10.
  - Head column (gap 16): icon 24x24, then h3 Inter 16/24 500 −0.16px rgb(33,33,33).
  - p Inter 14/20 rgb(84,84,84), 3–4 lines.
  - Icons: `assets/pages/experience-intelligence/icon-loop-{vocabulary,definitions,judgment,workspace}.svg` (teal duotone, 20-unit viewBox). RI uses the same files.

| | XI h3 / p | RI h3 / p |
|---|---|---|
| 1 | `Your vocabulary` — `Product names, segment labels and internal shorthand. Learned from your questions and answers, never guessed.` | `Your document types` — `Product names, segment labels and internal shorthand. Learned from your questions and answers, never guessed.` (same p as XI in source) |
| 2 | `Your definitions` — `“Churn risk” means what your team means by it. Define it once and XI uses it consistently.` | `Your definitions` — `WALT, passing rent, NOI: computed your way, with the method visible and editable.` |
| 3 | `Your judgment` — `Keep, dismiss or reword an answer. Your feedback shapes what XI prioritizes next.` | `Your thresholds` — `What counts as concentration risk in your book, not a generic benchmark.` |
| 4 | `Your workspace` — `What XI learns about your business stays in your workspace. We do not use your data to train AI models.` | `Your workspace` — `Documents stay in your workspace. We do not use your data to train AI models.` |

No hover or appear motion on these cards.

---------------------------------------------------------------------------------------------------

## 3. CTA — REUSE `CTA` with differences
Geometry, shader background (canvas, same GradientWave), copy and typography are identical to home §9. The wrapper Framer name is "XI" on the XI page and "Main" on RI.

Differences:
- **XI @1440 only**: the buttons row has two pills, gap 16 (259 wide): **White** `Book a call` → calendly + **Transparent White Text** `Start free trial` → `https://xi.primefold.ai/auth/sign-in?next=/home`.
- **XI at 810/390**: only `Book a call` (the Tablet/Phone variant drops the second button).
- RI: single `Book a call` (identical to home).

## 4. Footer — REUSE `Footer` (identical)
Desktop/Tablet/Phone variants and links are identical to home §10. Footer heights: 612 @1440, 670 @810, 1156 @390.

---------------------------------------------------------------------------------------------------

## 5. Motion inventory (pages-specific)
| # | Element | Trigger | Animation | Timing |
|---|---|---|---|---|
| 1 | Hero rays shader | always (in view) | WebGL rays, pointer glow | continuous; mouse lerp .06 |
| 2 | Hero chat | mount | type 3 chars / 24ms, hold 3.8s, next prompt; results fade | opacity .35s; ask row `pfconv-in .22s ease-out`; pills bg/color .2s; edge fades .25s |
| 3 | How It Works offset | scroll 0→500 | translate(80,80)→0 | spring k500 c60 (off on phone) |
| 4 | XI card 01 box | in view ≥50%, replays | opacity 0→1, y 30→0 | .3s [.44,0,.56,1] |
| 5 | XI card 01/03 text | in view / mount | per-char blur(3px), y 3, opacity → in | spring .4s, stagger .025s |
| 6 | XI card 02 rings | always | rotate ∓360 | 9/10/11/12s linear loop |
| 7 | XI card 02 steps | in view ≥50%, replays | 11 variants (icons absorbed, dots go teal) | delays 1.0/.1/1.0/.1/1.0/.3/1.0/.2/1.0/.3s; tween .2s |
| 8 | XI card 03 steps | in view ≥50%, replays | 9 variants (bubbles, bars, donut) | delays 2.0/1.0/.5×6; tweens .4s [.44,0,.56,1] etc. |
| 9 | RI cards A2 Ask/Understand/Act | mount, loop | orchestrated states | 21.7s loop (see 2a) |
| 10 | RI orbs / sweeps | always (paused offscreen) | scale 1↔1.06; rotate 360 | 1.2s mirror; 2.4s linear |
| 11 | Use-case list | scroll markers | item opacity .4↔1 | ~.3s (unmeasured) |
| 12 | Use-case panel | scroll | sticky top 120 (phone 80) | — |
| 13 | XI Sources Lottie | autoplay | Lottie loop | native |
| 14 | RI A3 Sources | mount, loop | 7 states | 12.0s loop |
| 15 | Solutions tickers | always | marquee ±40.6 px/s | linear |
| 16 | Solutions tabs | click | pill switch, panel swap | spring bounce .2 dur .4; panel instant |
| 17 | Nav / buttons / footer | — | global (CLONE_SPEC §12) | — |

---------------------------------------------------------------------------------------------------

## 6. Assets
Assets are listed in `public/assets/MANIFEST.md` under `## /experience-intelligence` and `## /realestate-intelligence`. Files are in `public/assets/pages/experience-intelligence/` and `public/assets/pages/realestate-intelligence/`.

There are no `<video>` elements. Fonts are unchanged from home: Stack Sans Headline 400 and Inter 400/500/600/700. ABC Favorit is **not** used on these pages.

## 7. Unresolved / not measured
1. **Per-variant geometry of the XI card 02/03 and RI A2/A3 states was not decoded.** I have the order and timings from source, plus frames in `reference/pages/states/`. Exact per-variant positions/opacities live in the Framer variant CSS: XI in `MyEJz…mjs` classes `framer-8mKsk` (card 02) and `framer-hjFhd` (card 03); RI in `zJcM_n2tx…mjs`. Build should match visually against the frames, or extract from those modules.
2. **The Silk orb (WebGL) and CTA wave shader** are canvas-rendered. Use the fallback PNGs or reuse home's implementation. The hero rays shader source *is* fully available in the extract.
3. **XI Sources Lottie**: rendered and captured in headless (frames OK), but the brand logos inside the JSON are embedded images — there are no separate files.
4. The use-case opacity transition duration and the tab-pill motion values (beyond the spring config) were not measured directly.
5. The hero chat avatar is the component's built-in default (base64). The page passes no custom avatar.
6. I did not capture the hamburger-open state or the nav dropdowns on these pages. I assume they match home.
