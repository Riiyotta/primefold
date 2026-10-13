Source: https://primefold.ai/

# Primefold: `/plans`, `/security`, `/contact`, `/404` clone spec

Measured 2026-10-13 from the live site with an isolated headless Chromium (Playwright, from `/Users/riyaghosh/V3/website-builder/node_modules`) at **1440x900**, **810x1080** and **390x844**. Values come from computed styles, bounding rects, and pseudo-element styles, plus rAF-sampled animation timings. They are not eyeballed. Coordinates are page coordinates `x,y` @1440 unless noted otherwise.
Global tokens, fonts, text styles, pill buttons, eyebrow spinner, Lenis and stacking rules are defined in `/Users/riyaghosh/V3/primefold/CLONE_SPEC.md` §0. This file only references them.
Reference screenshots are in `reference/pages/` (WebGL on, cookie banner dismissed): `plans-1440-fullpage.png`, `plans-390-fullpage.png`, `plans-1440-RI-state.png`, `plans-390-RI-state.png`, `security-{1440,390}-fullpage.png`, `contact-{1440,390}-fullpage.png`, `404-{1440,390}-fullpage.png`.
New assets are in `public/assets/pages/<slug>/` and are listed in `public/assets/MANIFEST.md` (sections "## /plans", "## /security", "## /contact").

---------------------------------------------------------------------------------------------------

## 0. Cross-page notes (apply to all four pages)

### 0.1 Appear / scroll animations
None. I compared every element's opacity, transform and filter at load+0, load+2.5s and after a full scroll pass on all four pages at 1440 and 390. No element starts hidden or offset, and nothing is scroll-triggered. The only continuous motion is (a) the eyebrow spinner (global), (b) the WebGL wave shaders (CTA cards, Security trust cards), and (c) the Security hero comet rings (§2.1). Lenis smooth scroll is global.

### 0.2 Navbar initial state per page (`src/components/Navbar.jsx`)
| Page | Desktop (≥1200) at top | Desktop after scroll | Tablet/Phone at top | Tablet/Phone after scroll |
|---|---|---|---|---|
| `/security` | **Desktop Transparent**, identical to home: white logo, white links, "Sign in" Transparent White Text, "Book a call" **White** | Desktop Blurred BG (identical to home §1 state B; switches when the 1x1 `Nav-Trigger` at hero top:100px leaves the viewport) | Mobile Transparent Collapsed (white logo, no bottom border) | Mobile White Collapsed |
| `/plans`, `/contact`, `/404` | **NEW variant "Desktop White"** (see below) | **unchanged**: stays "Desktop White" (measured at scrollY 600; no Nav-Trigger on these pages) | Mobile White Collapsed | unchanged |

**"Desktop White"** (REUSE Navbar with differences; add a `variant="white"` / `solid` prop):
- Outer wrapper 1440x72, `background:#fff`, `::after` bottom border **1px solid rgb(235,235,235)** (full width). No blur and no rounded BG (the `[BG]` layer stays at opacity 0).
- Header Content: max-width **1320**, padding **16px 20px** (the same geometry as Desktop Transparent: logo at 80,24; item x positions 607/726/796/887/1018; Sign in at 1155; Book a call at 1249).
- Logo is the dark variant (`assets/svg/logo-dark.svg`, 124x24). Nav labels are rgb(26,24,20).
- Buttons: "Sign in" uses the **Transparent** variant (bg rgba(255,255,255,.12), text rgb(26,24,20)). "Book a call" uses **Black** (bg rgb(26,24,20), text rgb(254,250,243)).
- Hover behaviour is the same as home (link opacity → .7, button glows).

**"Mobile White Collapsed"** at 810/390: bar 100%x80, `background:#fff`, `::after` bottom border 1px solid rgb(235,235,235), Header Content padding 24px 20px, dark logo, hamburger. The home spec already describes this state; here it is simply the **initial** state.

### 0.3 Footer
REUSE Footer (identical) on all four pages. It uses the Desktop/Tablet/Phone variants: 612 / 670 / 1156 px tall. The Ghost Wordmark appears at opacity .2 before its trigger, exactly as on home.

### 0.4 CTA block
- `/plans` and `/404`: **REUSE CTA (identical)**. This is the "Main" wrapper with the card 1280x388 / 770x372 / 350x356, the copy "Ask your data. Get the answer.", and the White "Book a call" button.
- `/security` and `/contact`: **REUSE CTA with differences at ≥1200 only.** At 810 and 390 both pages render the **identical global CTA** ("Ask your data. Get the answer." / Book a call), measured.
- On desktop the global CTA is swapped for a page-specific card that uses the same shader background, radius 24, bg rgb(26,24,20), shadow `0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)`, and the same text styles (H2 Stack Sans 48/56 ls .96px #fff centered, p Inter 14/20 -0.084px #fff centered max-width 372, gap text→button 20, title→p 12):

| Page | Wrapper | Card | Padding | H2 | p | Button (White pill) |
|---|---|---|---|---|---|---|
| security | `[Security]` bg #fff, padding 24px 20px | 1280x**408** | **120px 20px** | `Questions about security?` | `Data processing agreement and security documentation available on request. Security issue? Contact us below.` (2 lines) | `Contact us` 110x40 → `/contact` |
| contact | `[Open Roles]` bg #fff, padding 24px 20px | 1280x**368** | **110px 20px** | `Ready to make an impact?` | `See where your work could make a difference.` (1 line) | `See open roles` 140x40 → `/careers#roles` |

### 0.5 Cookie banner / misc
The cookie consent card appears on all pages (REUSE `CookieBanner.jsx`, identical). A dark 60px circle at the bottom-left in some captures is the **Framer editor-bar launcher** (an `iframe` from `framer.com/edit`). It is not part of the site, so do not clone it.

### 0.6 Shared new pieces (used on several pages)
- **Info card** ("Variant 1"; Plans "In every plan" and Security "Three things"): bg `rgb(250,250,249)`, radius **12**, `box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)`, padding **24**, column. Inside: `[Column]` (gap 16) holding the **24x24 mask icon** (bg rgb(26,24,20)) then the title, followed 10px later by the description.
  - Title: Inter 16/24 500, ls -0.16px, rgb(33,33,33).
  - Description: Inter 14/20 400, ls -0.084px, rgb(84,84,84).
  - The card has no hover state.
- **Section title row** ("Title" block; Plans Trust and FAQ, Security Four Facts): max-width 1320, padding `88px 20px 0` (phone `80px 20px 0`), `row; justify-between; align-items:flex-end` (phone: column). The left block is max-width 565, gap 16: eyebrow → H2 (global Section H2 style 48/56 → 44/48 → 32/40) → optional lead p (max-width 428). The right side optionally holds a lead p, max-width 428, bottom-aligned. The gap from the title row to the content is 56 (phone 32).
- **XI/RI product badge**: 20x20 square, radius 4, bg **rgb(32,131,116)** (XI) / **rgb(233,116,0)** (RI). Centered white text "XI"/"RI" in Inter Bold 12.1px/18.15px, ls -0.121px.

---------------------------------------------------------------------------------------------------

## 1. `/plans`

Title `Plans & Pricing — Primefold`. Meta description `Start free with 30 days of full access. Business and Enterprise plans for teams that run live research continuously. No card required.`
Document height: 6180 @1440 / 7133 @810 / 8717 @390 (XI state). The RI state is 3621 @1440.
Page bg #fff. DOM order: Hero & Pricing → Comparison Table → Trust ("In every plan") → FAQ → CTA (global) → Footer.

The page has **two product states** driven by the XI/RI toggle in §1.1:
- **XI** (default) shows the pricing cards (§1.2) and the comparison table (§1.3).
- **RI** swaps the pricing cards for a single "RI CTA" card (§1.2b), **removes the comparison table**, hides the billing toggle, and changes the hero lead text.

### 1.1 Hero & Pricing: header + toggles
Section `[Hero & Pricing]`: column, gap 20, align center, padding **156px 20px 88px** (810: same; 390: `156px 20px 40px`), overflow clip, no bg (white).

**Content block** (max-width 1280, column gap 20, left-aligned):
- Text stack (max-width 600, gap 16):
  - Eyebrow `Plans` (global).
  - **H1** `Start free.` ⏎ `Stay for the answers.` (forced line break): Stack Sans Headline, 56/67.2 ls 1.12px @1440 → **48/57.6 ls .96px** @810 → **42/50.4 ls .84px** @390. Color **rgb(0,0,0)** (pure black, not ink). `font-feature-settings: "ss04","ss11"` (plus Inter cv features, ignorable). 600x134 @1440.
  - Lead p (max-width 501): Inter 16/24 400, ls -0.16px, rgb(84,82,78). 2 lines.
    - XI copy: `Experience Intelligence starts with 30 days of full access.` ⏎ `No credit card. No feature gates. Just the full product.`
    - RI copy: `Talk to us to see how RI turns your asset data into traceable insights and recommendations.`
- Buttons row (gap 16, 20px below the text):
  - **Black** pill `Start free trial` (132x40) → `https://xi.primefold.ai/`.
  - **Transparent** pill `Book a call` (111x40, bg rgba(255,255,255,.12), text ink) → calendly.
  - The buttons do not change with the RI state.

**Toggle row** (max-width 1280, `row; justify-between; align-center; wrap`, padding-bottom 36, at y 470 @1440; 810 same row). At 390 it becomes a **column, gap 20, padding-top 24**, with both toggles left-aligned.
- **Product toggle** (424x44 @1440): track bg **rgb(250,250,249)**, radius 999, padding 2, row gap 0. Two segments, each 210x40, radius 999, padding `10px 12px`, gap 12: XI badge + label `Experience Intelligence` / RI badge + label `Real Estate Intelligence` (Inter 14/20 500, ls -0.084px, rgb(26,24,20)).
  - Active segment: bg #fff, `box-shadow:0 0 0 1px rgba(0,0,0,.08)`, label opacity 1.
  - Inactive segment: bg rgba(255,255,255,0), shadow transparent, label opacity **.7**. Hovering an inactive segment raises the label opacity to 1.
  - **Phone (390):** the labels shorten to `XI` / `RI` (text 13px wide), so the segments are 69x40 and the track is 142x44.
- **Billing toggle** `[Monthly]` (246x44 @1440, right-aligned; 390 left): same track/segment styles.
  - Segment 1 is `Monthly` (78x40).
  - Segment 2 is `Save annually` + `-17%` (164x40). Both texts are Inter 14/20 500 in **teal rgb(39,168,150)**, with the inactive opacity .7 applied to the "Save annually" label only.
  - The wrapper carries `transition: opacity .2s, visibility .2s`. In the RI state it gets **opacity 0** (and visibility hidden). Its framer name changes to "Yearly".
- **Toggle motion (measured):** a click cross-fades the active-segment bg/shadow between segments. The bg alpha goes 1→0 / 0→1 in about **150–180 ms** (samples: 85ms 95%, 126ms 99%, 178ms done), which matches Framer's tween 0.2s ease. There is no sliding thumb; each segment fades in place.
- **Effect of Monthly→Annual (measured):** nothing changes in the pricing cards. In the comparison-table sticky header (§1.3), the Business sub-label changes `Upon request, billed monthly` → **`€408 per month, billed annually`** and the Enterprise sub-label changes `Get a custom quote, billed monthly` → **`Get a custom quote, billed annually`**. The Free Trial sub-label is unchanged.
- **Effect of XI→RI:** see §1.2b. Switching back restores the XI content; the toggle fade is about 180 ms.

### 1.2 Pricing cards (XI state)
Grid (max-width 1280, at y 570 @1440): `grid-template-columns: repeat(3, 416px)` (1fr each), **column gap 16, row gap 24**. All cards stretch to the row height (697 @1440).
- 810: `repeat(2, 377px)`, rows 677 + 689. Enterprise wraps to row 2, column 1.
- 390: 1 column 350 wide; card heights 501 / 669 / 701.

Card: radius **16**, `box-shadow:0 0 0 1px rgba(0,0,0,.08)`, padding **32**, column gap 24.
- Backgrounds: **Free Trial** rgb(250,249,248). **Business** transparent (white). **Enterprise** rgb(250,249,248).
- Top block (gap 24): header (gap 10) → price → full-width button.
  - Header row (`justify-between, align-center`): plan name **h2** in Stack Sans Headline 20/28 400, ls normal, rgb(26,24,20), ss04/ss11. It is paired with a **tag pill**: height 24, padding `4px 8px`, radius 999, `box-shadow 0 0 0 1px rgba(0,0,0,.08)`, text Inter 12/16 500 rgb(26,24,20). Free Trial's tag bg is rgb(250,250,249); Business's is #fff.
  - Description: Inter 14/20 400, ls -0.084px, rgb(84,84,84). Its box is 40 tall (2 lines max).
  - Price row (row gap 8, align flex-end): price in Stack Sans Headline **48/56** ls .96px rgb(26,24,20) (810: **44/48**; 390: **32/40** ls .64px). Suffix in Inter 16/24 400, ls -0.16px, rgb(84,84,84), with padding-top 6.
  - Button: 352x40 full width (radius 999, padding `8px 14px`, label 16/24 500).
- Divider ("Graphic"): 352x3, `public/assets/pages/plans/card-divider.svg`, a 1px line in **#E1E1D4**, stretched with `preserveAspectRatio=none`.
- Feature list (column gap **12**): each row is a 20px tick + 12px gap + label (Inter 14/20 **500**, ls -0.084px, rgb(26,24,20)). Labels wrap at narrow widths.
  - **Tick**: a 20x20 circle, radius 100, bg **rgba(39,168,150,.24)**, padding 2. Inside is a 16x16 mask `icon-tick-16.svg` with bg **rgb(39,168,150)**.
  - **Quarter tag** (feature not yet shipped): a pill at the row's right end. It is 24 tall, padding `4px 8px`, radius 999, bg #fff, `0 0 0 1px rgba(0,0,0,.08)`, with text Inter 12/16 500. When a tag is present the label width shrinks (e.g. 266 instead of 320).

| Card | Tag | Description | Price | Suffix | Button | Features (verbatim) |
|---|---|---|---|---|---|---|
| Free Trial | `30 days` | `Full product, unrestricted, for a month.` | `€0` | `/ for 30 days` | **White** `Start free for 30 days` → https://xi.primefold.ai/ | Unlimited users · Unlimited live surveys · Everything in Business · Upgrade or export your data · Onboarding call · Priority support |
| Business | `Popular for SMEs` | `For a team running live research continuously.` | `On request` | (empty) | **Black** `Book a call` → calendly | Up to 3 users in a workspace · Up to 5 live surveys · Survey creation with AI · Distribution via QR code, link, embed or Shopify · Survey data analysis with AI · Workspace organization & user management · Survey templates · Multilingual surveys [`Q2`] · Onboarding call · Priority support |
| Enterprise | (none) | `For organizations requiring a dedicated security environment.` | `Custom` | (empty) | **White** `Book a call` → calendly | Unlimited users & workspaces · Unlimited live surveys · Everything in Business · Private hosting · Individual tools & custom API integrations · Workflow automations [`Q3/Q4`] · RBAC, audit-ready controls, data isolation & SLAs [`Q3/Q4`] · APIs & SDK [`Q3/Q4`] · Priority support · Onboarding call · Dedicated support |

The cards have no hover state (only the buttons react, via global button hover).

### 1.2b RI state: "RI CTA" card (replaces the grid)
A single card 1280x480 @1440: bg rgb(250,249,248), radius 16, `0 0 0 1px rgba(0,0,0,.08)`, padding **96px 32px**, column gap 32, centered.
- Text block (max-width 720, gap 16, centered):
  - eyebrow-style label `PRIMEFOLD RI` (Inter 14/20 500, ls -0.084px, rgb(97,97,97), centered, uppercase as typed, no spinner).
  - **h2** `Explore Primefold RI` (Stack Sans Headline **56/67.2** ls 1.12px, rgb(33,33,33), centered).
  - p `Interested in piloting Primefold RI? Let’s talk about your use case.` (Inter 16/24, ls -0.16px, rgb(84,84,84), centered).
- **Black** pill `Let’s talk`, **260x40** (fixed width), → calendly.
- Section order in the RI state: Hero & Pricing → Trust → FAQ → CTA → Footer. The comparison table is not rendered.

### 1.3 Comparison Table (XI state only)
Section `[Comparison Table]`: max-width 1320, padding **88px 20px** (390: 44px 20px), bg #fff. The inner column is 1280 wide with gap 24 between groups.

**Sticky header `[Main Row]`**: `position: sticky; top: 72px; z-index:3`, bg #fff, height 174, row, `::after` bottom border 1px solid **rgb(234,234,234)**.
- Column widths @1440: label column **438**, then 3 plan columns of **281** each (x 518 / 799 / 1079). At 810 the label column is 264 and the plan columns 169. At 390 they are 120 / 77.
- Label cell (`justify-end`, padding 24px 0, gap 16):
  - `Product Details` in Inter 14/20 400, ls -0.14px, rgb(84,82,78).
  - Product chip 210x40: radius **8**, bg #fff, `0 0 0 1px rgba(0,0,0,.08)`, padding `10px 12px`, gap 12, containing the XI badge and `Experience Intelligence`. It is static here (no RI option).
- Plan header cells (padding 16px 0, inner padding 0 24, gap 24 / 10):
  - Name in Stack Sans Headline 20/28, ls .2px, rgb(0,0,0). **`Business` uses gradient text** `linear-gradient(90deg, rgb(32,131,116) 0%, rgb(0,183,155) 42.64%, rgb(33,170,149) 100%)` (background-clip:text).
  - Tag pill as in §1.2 (`30 days` on Free Trial, `Popular for SMEs` on Business).
  - Sub-label in Inter 14/20, ls -0.084px, **rgb(102,102,102)**: `€0 for 30 days, no card required` / `Upon request, billed monthly` / `Get a custom quote, billed monthly` (annual variants in §1.1).
  - Button 233x40: White `Start free for 30 days` → xi / **Black** `Book a call` → calendly / White `Book a call` → calendly.
- **Tablet & phone:** the three plan header cells are **not rendered** (measured). The sticky header shows only the label cell (`Product Details` + XI chip), 770x174 / 350x174, still `top:72px`.

**Groups**: each group is a column. It starts with a category row (1280x72, bg #fff, padding 24px 0) that is **`position: sticky; top: 246px; z-index:1`** (sits under the main header). The category heading is h3 in Stack Sans Headline 20/28 rgb(26,24,20). The data rows follow.
- Data row `[Icons]`: 1280x72, row, `::after` bottom border 1px solid rgb(234,234,234). The category row has the same bottom border.
- Label cell: padding 24px 0, Inter **16/24 500**, ls -0.16px, rgb(84,82,78). It is **14/20** (ls -0.084) @810 and **12/16 500** ls -0.12px @390.
- Value cells are centered.
  - Text values: Inter 16/24 500, rgb(53,51,46) (same size steps as the labels).
  - Tick: 20x20 as in §1.2.
  - **Cross**: 24x24 mask `icon-cross-16.svg`, bg **rgb(162,158,152)**.
  - Quarter text is plain (`Q2`, `Q3/Q4`), not a pill.

| Group | Row label | Free Trial | Business | Enterprise |
|---|---|---|---|---|
| **Usage** | Users | Unlimited | Up to 3 | Unlimited |
| | Live surveys | Unlimited | Up to 5 | Unlimited |
| | Historical data retention | 30 days | Unlimited | Unlimited |
| **Build & ask** | Survey creation with AI | ✓ | ✓ | ✓ |
| | Survey templates | ✓ | ✓ | ✓ |
| | Distribution: QR, link, embed, Shopify | ✓ | ✓ | ✓ |
| | Multilingual surveys | Q2 | Q2 | Q2 |
| | Import external survey data | ✓ | ✓ | ✓ |
| **Understand & act** | AI analysis with traceable evidence | ✓ | ✓ | ✓ |
| | One-click stakeholder reports | ✓ | ✓ | ✓ |
| | Shared workspaces & role-based access | ✓ | ✓ | ✓ |
| | Workflow automations | ✕ | ✕ | Q3/Q4 |
| | APIs & SDK | ✕ | ✕ | Q3/Q4 |
| **Security & control** | EU hosting, Frankfurt | ✓ | ✓ | ✓ |
| | GDPR-compliant processing | ✓ | ✓ | ✓ |
| | Never trained on your data | ✓ | ✓ | ✓ |
| | Private hosting | ✕ | ✕ | ✓ |
| | RBAC, audit controls, data isolation, SLAs | ✕ | ✕ | Q3/Q4 |
| **Support** | Onboarding call | ✓ | ✓ | ✓ |
| | Priority support | ✓ | ✓ | ✓ |
| | Dedicated support contact | ✕ | ✕ | ✓ |

Group y positions @1440 are Usage 1641, Build & ask 1953, Understand & act 2409, Security & control 2865, Support 3321. Each group is 72 + n×72 tall, with a 24px gap between groups.

### 1.4 Trust: "In every plan"
Section `[Trust]` bg #fff, column gap 56 (phone 32), padding-bottom 88. It follows the shared title row (§0.6).
- Eyebrow `In every plan`; H2 `Trust is not an upgrade.`
- Right-aligned lead p (428 wide): `Security is built into every plan. Your plan determines access and limits, not the security standards we apply to your data.` At 810 it sits beside the title (385 each). At 390 it stacks below.

Cards `[Cards]` (max-width 1320, padding 0 20): grid **4 × 302px, gap 24**, card height 202 @1440. At 810: 2×373, rows 182/182. At 390: 1×350.
Each card is a §0.6 info card with a 24px icon at the top:

| # | Icon (24x24 mask, bg rgb(26,24,20)) | Title | Description |
|---|---|---|---|
| 1 | `plans/icon-answers-rely.svg` | Answers you can rely on | Every recommendation traces back to a real response, clause or line item. |
| 2 | `plans/icon-never-trained.svg` | Never used for training | We never train our models on your data. Not by default, and never through a clause in your terms. |
| 3 | `plans/icon-eu-hosted.svg` | EU-hosted | Your data is hosted safely within the EU. |
| 4 | `plans/icon-privacy-by-design.svg` | Privacy by design | Identifiers are separated from content and replaced with keys – pseudonymisation under GDPR Art. 4(5). |

This is a NEW section. It is not the home "Trust" component; it shares only the title-row pattern.

### 1.5 FAQ accordion
Section `[FAQ]` **bg rgb(250,249,248)**, column gap 56 (phone 32), padding-bottom 88.
- Title row: eyebrow `Questions`, H2 `Before you pick a plan.`, lead p under the H2 (max-width 428) `Something not answered here? Write to us. A real person replies.`

List (max-width 1320, padding 0 20): column **gap 12**. Each item is its own card:
- Card: bg #fff, radius **12**, `box-shadow:0 0 0 1px rgba(0,0,0,.08)`, overflow clip, column gap 6.
- Padding: **18px 24px 18px** when collapsed (76 tall @1440) and **18px 24px 24px** when expanded.
- Title row (padding 6px 0, gap 12, align center): question **h3** in Stack Sans Headline 20/28 400, rgb(33,33,33), followed by a 24x24 icon.
- Icon: two bars of **18x1**, radius 10, bg rgb(84,82,78), centered. Bar 2 is `rotate(90deg)` when collapsed (plus sign) and `rotate(0)` when expanded (minus sign).
- Answer: Inter 14/20 400, ls -0.084px, rgb(84,82,78), full width. It is opacity 0 and takes no height when collapsed.
- **Default:** item 1 expanded, the rest collapsed. Items toggle **independently**: opening one does not close the others.
- **Cursor:** `auto`, not pointer (measured). Clicking anywhere on the card toggles it. There is no hover style.
- **Motion (rAF-measured, @1440, 76→128px item):**
  - Open: height grows 76→128, answer opacity 0→1, bar-2 rotation 90°→0°. The motion starts about 12 ms after the click and settles at about **220 ms**, with an ease-in-out profile (55ms: 82px/a .09; 99ms: 99px/a .44; 145ms: 119px/a .72; 191ms: 127px/a .97).
  - Close: the reverse, finishing in about 200 ms of motion. Use a Framer-style tween of **0.2s, ease [0.44,0,0.56,1]** for height, opacity and rotate together.

| # | Question (verbatim) | Answer |
|---|---|---|
| 1 (open) | What happens when the trial ends? | `Nothing disappears. Move to a paid plan and carry on, or export your data and close the workspace. Your responses, analyses, reports and documents come with you.` |
| 2 | Is the trial a reduced version of the product? | 2 paragraphs, about 55 words in total (the 2nd covers XI 30 days vs RI one portfolio for four weeks). Prose; do not transcribe; source in DOM. |
| 3 | Can we start with one product and add the other later? | `Yes. Experience Intelligence and Real Estate Intelligence run on the same engine, so adding the second is a licensing change, not a migration. Your workspace, users and permissions carry over.` |
| 4 | Where does our data live, and is it used for training? | `Your data is hosted within the EU. Names, IPs and responses are stored separately. Data is not used to train shared models, on any plan.` |
| 5 | How is a quarter marker (Q2, Q3/Q4) different from a shipped feature? | `A quarter marker is a commitment on the roadmap, not something you can use today. We label it so you can plan around it rather than discover it later. Everything without a marker works now.` |
| 6 | Do you offer discounts for nonprofits or research? | `Yes, on a case-by-case basis. Tell us a little about your work and we'll come back with an offer.` |

(Answers 1 and 3–6 are short, about 1–3 sentences, so they are recorded verbatim because the builder needs them as data.)

Responsive: the question text wraps (390: h3 266 wide, 2–3 lines). The item padding is unchanged.

### 1.6 CTA → REUSE CTA (identical). 1.7 Footer → REUSE Footer (identical).

---------------------------------------------------------------------------------------------------

## 2. `/security`

Title `Security — Primefold`. Meta description `Security isn't a feature, it's the foundation. Hosted in Germany, built to GDPR requirements — and we do not use your data to train AI models.`
Height 3203 @1440 / 3429 @810 / 4492 @390. DOM order: Hero → Four Facts → Trust image cards → CTA (security variant on desktop, global on tablet/phone) → Footer.
Navbar: transparent over the dark hero (§0.2).

### 2.1 Hero (NEW)
Section `[Hero]`: bg **rgb(26,24,20)**, height **1046** @1440 (810: 1080; 390: 1084), padding 0 20, overflow clip, `display:flex; justify-center; align-center`.
- **BG Glow**: an absolute 1689x1034 div (390: 780x477), opacity **.2**, `background: radial-gradient(35% 35% at 48.8% 46.9%, rgba(171,160,136,.5) 0%, rgba(171,160,136,0) 100%)`. It is centered on the point (604,84) @1440, (340,86) @810, (176,130) @390 via `translate(-50%,-50%)`.
- Inner row (max-width 1280, padding 80px 0, gap 40, wrap, `justify-center; align-center`). Two columns:
  - **Text column** (600 wide @1440; 345 @810; 350 @390, stacked first), column gap 20, vertically centered (text top y=330 @1440):
    - Eyebrow `Security`. Its spinner and label are **rgba(255,255,255,.56)**.
    - **H1** `Security is the foundation.` ⏎ `Not a feature.`: Stack Sans 56/67.2 ls 1.12px **#fff** (810: 48/57.6; 390: 42/50.4), 3 lines @1440.
    - Lead p: Inter 16/24 400, ls -0.16px, **rgb(203,199,192)**. 3 lines @1440. Copy: `Your data stays yours. Every answer links back to the source it came from. Hosted in Germany, with separated data storage and source-level traceability built in from the start.`
    - **White** pill `Book a call` (111x40) → calendly.
  - **Animation column** (640x886 @1440, padding 0 20, centered; 810: 385x533; 390: 350x484 stacked below the text at y 519): the `[Animation]` box is **432x598** (max-width 432; scales to 345x478 @810 and 310x429 @390, keeping the aspect ratio). Layers, all centered in the box:
    1. **Comet ring 3** (outermost) 432x598: outline `security/5VCZg5sAtGKE9kue20SB1hKakM.svg` (rounded rect, rx 215.5, stroke #fff @ .12) plus a teal comet **rgb(63,209,188)**.
    2. Plain ring 384x551: `::after` 1px solid rgba(255,255,255,.12), radius 1000.
    3. **Comet ring 2** 337x503: outline `yFZlaSMJO94kOliLaTZAnrObeo.svg` (336x502, rx 167.5) plus an orange comet **rgb(249,157,114)**.
    4. Plain ring 289x456: `::after` 1px solid rgba(255,255,255,.12), radius 1000.
    5. **Comet ring 1** 242x408: outline `OEPL3dBKruUXfEl5LHRLXPksC3I.svg` (240x405, rx 119.5) plus a white comet **rgb(255,255,255)**.
    6. **Center pill `[Row]`**: laid out as 333x176 and rotated 90°, so it shows as **176 wide x 333 tall** @1440 (144x266 @810, 131x239 @390).
       - bg **rgba(23,21,18,.8)**, radius 999, padding 16, gap 16, `::after` 1px solid rgba(255,255,255,.12).
       - Shadow: `0 4.37px 2.21px rgba(0,0,0,.06), 0 10.51px 5.32px rgba(0,0,0,.08), 0 19.78px 10px rgba(0,0,0,.12), 0 35.29px 15px rgba(0,0,0,.15)`.
       - Contents, top to bottom: GDPR tile `security/7ERMi7fk0ghkwyi7viAZS06g6w.svg` (144x144, rendered 141x141; alt "GDPR badge for the EU-Central-1 hosting region") and fingerprint tile `security/ibbCaDYtLP74SJYvXs8caLQZw.svg` (144x144; alt "Fingerprint mark symbolising data security"). Each is counter-rotated -90°, so in practice build a vertical 176x333 pill with the two tiles stacked.
- **Comet motion (measured; this is the only animation on the page):**
  - Each comet ring is an SVG whose `d` path traces the rounded rect. It has `pathLength="100"` and stroke-width 1.
  - The ring is drawn as a static track (stroke rgba(255,255,255,.12)) plus **13 dash copies**, each `stroke-dasharray="1.7286 98.2714"`.
  - The head copy has `stroke-linecap="round"`; the others use butt.
  - Trail copy *i* has `stroke-dashoffset = head + i × 1.42857`, with opacities `1, .888, .781, .680, .584, .493, .408, .330, .258, .193, .135, .085, .044`.
  - The head offset **decreases linearly at 25 units/s**, so one lap takes **4.0 s**. The loop is infinite and never pauses.
  - All 3 rings move at the same speed and direction but start at different phases. At one sample the head offsets were ring1 ≈30.5, ring2 ≈43.3, ring3 ≈23.1 (pathLength units).
  - Snapshot SVGs with exact paths and colors are saved as `security/hero-comet-ring-{0,1,2}.svg` (0 = white 240x405, 1 = orange 336x502, 2 = teal 432x598).
  - Implement with CSS `@keyframes` on stroke-dashoffset (from X to X−100, 4s linear infinite), applied to each copy with its fixed offset.
- `[Nav-Trigger]` is a 1x1 marker at top:100px that drives the nav swap (§0.2).

### 2.2 Four Facts: "Three things you should know." (NEW)
Section bg #fff, column gap 56 (phone 32), padding-bottom 88. Title row (§0.6): eyebrow `Where your data lives`, H2 `Three things` ⏎ `you should know.` (2 lines, 565 wide). There is no lead p.
Cards: grid **3 × 410.66px, gap 24** (max-width 1320, padding 0 20), height 162 @1440. At 810: 2×373 (rows 182/142; card 3 wraps to the left). At 390: 1×350 (162/182/142).
Info cards (§0.6) with 24px icons:

| # | Icon | Title | Description (verbatim, including the live typo) |
|---|---|---|---|
| 1 | `security/icon-hosted-germany.svg` | Hosted in Germany | `our data is stored on servers in Germany, built to GDPR requirements.` (the leading "Y" is missing on the live site) |
| 2 | `security/icon-data-separation.svg` | Data separation | Names, IPs and content are stored separately, and access is limited to what each function needs. |
| 3 | `security/icon-never-train-ai.svg` | Never used to train AI models | We do not use your data to train AI models. |

### 2.3 Trust image cards (NEW)
Section `[Trust]` (max-width 1320, padding **24px 20px 88px**). Inner grid (max-width 1280): **2 × 632px, gap 16**, height 435. At 810: 2×377. At 390: 1×350, stacked with gap 16.
Card: radius **16**, `0 0 0 1px rgba(0,0,0,.08)`, overflow clip, bg #fff (fallback).
- **Background**: a full-bleed Framer **WebGL "Shader" canvas** (the same black/teal/orange wave as the CTA; see CLONE_SPEC §9). Card 2's shader container is `rotate(180deg)`. Fallback: `assets/5V8gmDlH6VshGL3t6Yw2BakE8M.png` (cover), mirrored for card 2.
- **Overlay**: an absolute strip at the bottom, 249 tall @1440 (it starts 186px from the top), `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,.9) 69.43%, #000 100%)`. Card 2 starts from `rgba(255,255,255,0)`.
- Text: absolute at the bottom, padding **40**, gap 12.
  - h3 in Stack Sans Headline 20/28 400 **#fff**.
  - p in Inter 14/20, ls -0.084px, **rgb(237,237,237)**.

| Card | h3 | p |
|---|---|---|
| 1 | Answers you can rely on | 2 sentences, about 30 words, 3 lines @1440 (traceable answers, low-confidence flagged). Prose; source in DOM. |
| 2 | Data that stays yours | `Your documents and the data extracted from them are stored on servers in Germany, built to GDPR requirements.` |

There is no hover state.

### 2.4 CTA: REUSE CTA with differences on desktop (§0.4: `Questions about security?` / `Contact us` → /contact). Tablet and phone use the global CTA (identical).
### 2.5 Footer: REUSE Footer (identical).

---------------------------------------------------------------------------------------------------

## 3. `/contact`

Title `Contact — Primefold`. Meta description `Tell us what you want to find out. Send us a message — a person replies. Or reach us at support@primefold.ai.`
Height 2040 @1440 / 2109 @810 / 2908 @390. DOM order: Contact Form section → CTA (contact variant on desktop, global on tablet/phone) → Footer. Navbar: "Desktop White" / "Mobile White Collapsed" (§0.2).
Fonts: this page additionally loads **Stack Sans Text 400** (Submit label only): `public/assets/pages/contact/StackSansText-400.woff2` (Google Fonts v1 latin). Declare it as `@font-face{font-family:"Stack Sans Text";src:url(/assets/pages/contact/StackSansText-400.woff2) format("woff2");font-weight:400;font-display:swap}` with the fallback stack `"Stack Sans Text", "Stack Sans Text Placeholder", sans-serif`.

### 3.1 Contact Form section (NEW)
Section max-width 1320, bg #fff, **padding 168px 20px 88px** (810 same; **390: 44px 20px 44px**). It is a row with wrap, **gap 32px 56px**, align center (both columns are 755 tall @1440).
- Left column `flex:1` (580 @1440; 325 @810; 350 @390), column gap 20.
- Right card 644 @1440 (389 @810; 350 @390, stacked below at y 527).

> **Live-site bug at 390 (measured, also on /404):** the section padding-top is only 44px while the fixed mobile nav is 80px tall, so the eyebrow (y 44) and the top of the H1 (y 80) sit **under the white nav bar** (see `reference/pages/404-390-fullpage.png`). Decide with the user whether to replicate this. Recommendation: replicate the measured value but flag it.

**Left column**
- Title stack (gap 16):
  - Eyebrow `Contact`.
  - **H1** `Let's start with your question.`: Stack Sans 56/67.2 ls 1.12px **rgb(33,33,33)**, 2 lines (810: 48/57.6, 3 lines; 390: 42/50.4).
  - p `Tell us what you're working on. A person will get back to you.` (Inter 14/20, ls -0.084px, rgb(84,84,84)).
- Link cards stack (350 wide, gap 8, 20px below the title). Each card is an `a` **350x74**:
  - bg rgba(255,255,255,.12) (it reads as white), radius **12**, padding 16, column gap 6, overflow clip.
  - Row 1 (gap 8): 20x20 mask icon + title in Inter 14/20 **500**, ls -0.14px, **rgb(44,44,44)**.
  - Row 2 (padding-left 28): sub text in Inter 12/16 400, rgb(84,82,78).
  - **Hover:** bg goes to **rgb(250,249,248)**. The tween takes about 0.2–0.25 s (rAF samples: 73ms ≈2%, 246ms ≈99%) and reverses on leave. Text does not change.

| Card | Icon (mask) | Icon color | Title | Sub | href |
|---|---|---|---|---|---|
| 1 | `contact/icon-mail.svg` | rgb(26,24,20) | support@primefold.ai | General enquiries and support. | `mailto:support@primefold.ai` |
| 2 | `contact/icon-calendar.svg` | rgb(26,24,20) | Book a 20-minute call | Straight into the calendar. | calendly |
| 3 | `contact/icon-linkedin.svg` | **rgb(9,102,194)** | LinkedIn | Fastest if we have already met. | https://www.linkedin.com/company/primefold/ |

**Right card `[Send us a message]`**: bg #fff, radius **16**, `0 0 0 1px rgba(0,0,0,.08)`, padding **32**, column gap 24.
- **h2** `Send us a message`: Stack Sans Headline **32/40** (810: 28/32; 390: 26/30), ls normal, rgb(26,24,20), ss04/ss11.
- **Form** (580 wide @1440), column gap **24**:
  1. Row (gap 24; it stays 2-up at every width: 278+278 @1440, 151+151 @810, 131+131 @390):
     - **Name**: label `Name`, `input type=text name="Name" placeholder="Your name" required`.
     - **Work Mail**: label `Work Mail`, `input type=email name="Email" placeholder="you@company.com" required`.
  2. **Company Name**: label `Company Name`, `input type=text name="CompanyName" placeholder="Company" required`.
  3. **Phone** (optional), label `Phone`. A custom country-code field:
     - Wrapper 46 tall, bg **#fff** (not the input tint), radius 10, ring `0 0 0 1px rgba(34,34,34,.12)`, padding 12.
     - Left `role=combobox` trigger (cursor pointer): flag emoji 🇩🇪 (18px/1.2), 8px gap, `+49` (14px/1.2, ls -0.14px, rgb(26,24,20)), then a 16x16 chevron SVG (`<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`, color rgb(84,82,78), margin 0 8px).
     - Then `input type=tel name="Phone Number" placeholder="1512 3456789"` (padding-left 8). A hidden `input name="Full Phone Number"` holds the combined value.
     - **Dropdown (open on click):** `role=listbox`, absolute `top:100%` + margin-top 8, full width (580), **height 200**, bg #fff, border 1px solid rgb(235,235,235), radius 10, `box-shadow 0 4px 8px rgba(43,43,43,.35)`, z-index 7.
       - Inside, a padding-8 search box `input placeholder="Search countries..."` (padding 8px 12px, bg and border rgb(235,235,235), radius 10, Inter 14px/1.2, ls -0.01em, color rgb(26,24,20)).
       - Then a scroll list (overflow-y scroll, padding 0 8 8) of **195** `role=option` rows: flex, gap 8, padding 12px 16px, radius 8, line-height 1.2, 14px rgb(0,0,0), cursor pointer, 43px tall. Format: `🇦🇫 Afghanistan +93`, `🇦🇱 Albania +355`, … (alphabetical). The default selection is Germany +49.
  4. **Your Message**: label `Your Message`, `textarea name="Message" placeholder="Enter a message" required`. The box is 580x172 and the textarea padding is 12 (resizable; the default webkit resizer is drawn in #999).
  5. **Consent** (row gap 10): `input type=checkbox name="Consent" required` (16x16) + text `I agree that Primefold may process this enquiry in accordance with its Privacy Notice.` (Inter 12/16, rgb(84,84,84); wraps to 2 lines @810, 3 @390). The "Privacy Notice" text is not a link (measured).
  6. **Submit** `button type=submit`: full width x40, radius 100, bg rgb(26,24,20), padding 12, label `Submit` in **Stack Sans Text 14/19.6 400 #fff**.
- Below the form: a centered line in Inter 12/16 500. `Prefer a call?` is rgb(84,84,84); the link `Book 20 minutes` is rgb(33,33,33) → calendly.
- Labels: Inter 14/20 **500**, ls -0.084px, **rgb(44,44,44)**. Label→field gap 8.
- **Hidden honeypot inputs** (not rendered, keep for parity or skip): `website, company, message, subject, title, description, feedback, notes, details`, … These are Framer anti-spam fields.

**Field states (computed from Framer's form CSS variables):**
| State | Text inputs / textarea wrapper | Checkbox |
|---|---|---|
| Default | bg **#FBF9F60D** (rgba(251,249,246,.05)), `box-shadow:0 0 0 1px #2222221F`, radius 10, padding 12. Text Inter 14px / 1.2em (16.8px), 400, ls 0, color **#1A1814**. Placeholder **#616161** | 16x16, radius 4, bg #fff, `0 0 0 1px #00000014`, `appearance:none` |
| Hover | no change (measured) | no change |
| Focus | wrapper `:focus-within::after` draws an inset **1px solid #54524E** border (radius 10). bg and shadow are unchanged. No outline | `:focus::after` 1px solid **#09f** (a blue ring is visible after click) |
| Filled | as default | **Checked**: bg **#FAF9F8**; check glyph = mask `M4 8 L6.5 10.5 L11.5 5.5` (stroke 2, round caps) filled with **#44423E**; glyph fades in via `opacity` (transition property only) |
| Invalid (e.g. `bad` typed in email, then blur) | **no visual change**. Validity is only native (`required`, `type=email`). There are no inline error messages before submit | n/a |

Transitions: the wrappers declare `transition-property: background, box-shadow` (and the checkbox `box-shadow, background`) with no duration set, so the change is effectively instant.

**Submit button variants (measured):**
- **"Disabled"**: `disabled` attribute, **opacity .5**. This is the initial state and holds while any required field (Name, Email, CompanyName, Message, Consent) is empty or invalid. The phone field is optional.
- **"Default"**: enabled, opacity 1. The 0.5→1 change animates in about 0.2–0.35 s once the last required field becomes valid.
- **Hover** (enabled): opacity 1 → **.5**. This is a tween settling at about **210 ms** with an ease-in-out profile (69ms .90, 119ms .69, 169ms .53, 219ms .50).
- **Submit/success/error states were NOT exercised** (the form was not submitted, per instructions). See Unresolved.

### 3.2 CTA: REUSE CTA with differences on desktop (§0.4: `Ready to make an impact?` / `See open roles` → /careers#roles). Tablet and phone use the global CTA (identical).
### 3.3 Footer: REUSE Footer (identical).

---------------------------------------------------------------------------------------------------

## 4. `/404` (Framer "not found" page)

The HTTP status is 404, for both `/404` and any unknown path. The **document title and meta description are copied from Contact** on the live site (`Contact — Primefold`, same description). This is a live-site quirk; recommended title is `404 — Primefold`, but parity says Contact's.
Height 1948 @1440 / 2170 @810 / 1903 @390. DOM order: hero block → CTA (global) → Footer. Navbar: "Desktop White" / "Mobile White Collapsed".

### 4.1 Not-found block (NEW, small)
Section (it reuses the contact section shell): max-width 1320, bg #fff. Height is **900** @1440 / **1080** @810 (= 100vh), with padding **168px 20px 168px**. At 390 the padding is **44px 20px** (height 342; it has the same under-nav overlap bug as /contact §3.1).
The content is centered (column, align center, max-width 600, gap 16; the button sits 16px under the p). The block is vertically centered: text top y 316 @1440, 415 @810.
- Eyebrow (centered row) `OOOPPS!` with the spinner (global eyebrow).
- **h1** `404!`: Stack Sans 56/67.2 ls 1.12px rgb(33,33,33), centered (810: 48/57.6; 390: 42/50.4).
- **h2** `Nothing to see here.`: global Section H2 (48/56 → 44/48 → 32/40), rgb(33,33,33), centered.
- p `The page you’re looking for may have moved, changed, or no longer exists.`: Inter 14/20, rgb(84,84,84), centered (2 lines @390).
- **Black** pill `Back to homepage` (170x40) → `/`.

### 4.2 CTA → REUSE CTA (identical). 4.3 Footer → REUSE Footer (identical).

---------------------------------------------------------------------------------------------------

## 5. New color values introduced by these pages (not in CLONE_SPEC §0.3)
| Value | Use |
|---|---|
| rgb(250,250,249) #FAFAF9 | toggle tracks, info-card bg, "30 days" tag bg |
| rgb(234,234,234) #EAEAEA | comparison-table row dividers (`::after` bottom border) |
| #E1E1D4 | pricing-card divider line |
| rgba(39,168,150,.24) | tick circle bg (with #27A896 glyph) |
| rgb(162,158,152) #A29E98 | comparison cross icon |
| rgb(53,51,46) #35332E | comparison text values |
| rgb(102,102,102) #666 | comparison header sub-labels |
| rgb(32,131,116) #208374 / rgb(233,116,0) #E97400 | XI / RI badge squares |
| linear-gradient(90deg,#208374 0%,#00B79B 42.64%,#21AA95 100%) | "Business" gradient text in the table header |
| rgb(44,44,44) #2C2C2C | form labels, contact link-card titles |
| #FBF9F60D, #2222221F, #54524E, #616161 | form input bg / ring / focus border / placeholder |
| #09f | checkbox focus ring |
| rgb(9,102,194) | LinkedIn icon on /contact |
| rgba(23,21,18,.8) | security hero center pill |
| rgba(171,160,136,.5) | security hero glow |
| rgb(203,199,192), rgba(255,255,255,.56), rgb(237,237,237) | security hero lead / hero eyebrow / trust-card body |

## 6. Assets (new; full list in `public/assets/MANIFEST.md`)
- `/plans`: `icon-tick-16.svg`, `icon-cross-16.svg`, `icon-answers-rely.svg`, `icon-never-trained.svg`, `icon-eu-hosted.svg`, `icon-privacy-by-design.svg` (all are mask icons; the live site inlines them as data-URI `mask-image`, so use them as `mask: url(...) center/contain no-repeat` with a `background-color`), plus `card-divider.svg`.
- `/security`: `7ERMi7fk0ghkwyi7viAZS06g6w.svg` (GDPR tile), `ibbCaDYtLP74SJYvXs8caLQZw.svg` (fingerprint tile), ring outlines `OEPL3dBKruUXfEl5LHRLXPksC3I.svg` (240x405), `yFZlaSMJO94kOliLaTZAnrObeo.svg` (336x502), `5VCZg5sAtGKE9kue20SB1hKakM.svg` (432x598), comet snapshots `hero-comet-ring-{0,1,2}.svg`, and icons `icon-hosted-germany.svg`, `icon-data-separation.svg`, `icon-never-train-ai.svg`.
- `/contact`: `icon-mail.svg`, `icon-calendar.svg`, `icon-linkedin.svg`, `StackSansText-400.woff2`.
- `/404`: none.
- Reused from existing assets: the CTA shader fallback `assets/5V8gmDlH6VshGL3t6Yw2BakE8M.png` (also for the Security trust cards), the footer wordmark, logos, Inter, and Stack Sans Headline (all already present).

## 7. Unresolved / not measurable
1. **Contact form submission**: the success message, server error state and post-submit redirect were not exercised (not submitted, by instruction). Framer forms typically swap the button to a "Success" variant. Unknown here.
2. **Inline validation UI**: none appears before submit. Whether Framer shows a styled error state on submit is unknown (requires submitting).
3. **Shader visuals** (CTA cards, Security trust cards) are WebGL canvases. Only their look is captured (reference PNGs rendered with SwiftShader). Exact shader parameters for the trust cards were not read from source; assume the same wave as the CTA (CLONE_SPEC §9), with card 2 rotated 180°.
4. **Comet ring phases**: speed (25 pathLength units/s, 4s lap), direction and trail are measured, but the exact start phase per ring depends on when the page mounted. Use the offsets listed in §2.1 or any staggered start.
5. **Contact link-card hover duration**: the rAF sampling was coarse (about 0.2–0.25 s). The exact Framer transition object was not read.
6. **Tablet/phone comparison table** has no plan column headers on the live site (measured). The values are unlabeled at ≤1199px. This is replicated as-is in this spec; flag it to the user.
7. **390 header overlap** on /contact and /404 (content under the nav) is a measured live-site bug (§3.1).
8. **Typo** `our data is stored…` on /security is live copy (§2.2).
9. The Products/Resources/Company nav dropdowns are global and unchanged here. External links (xi.primefold.ai, help.primefold.ai, calendly, LinkedIn/X) were not visited.
