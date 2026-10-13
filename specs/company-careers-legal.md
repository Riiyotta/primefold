Source: https://primefold.ai/

# Primefold — /company, /careers, legal pages (/imprint, /data-privacy, /terms-of-service)

Measured 2026-10-13 on the live site with an isolated headless Chromium (Playwright) at **1440x900**, **810x1080**, **390x844**. Values are computed styles and bounding rects. Where a value says "(source)", it comes from the Framer page modules (`framerusercontent.com/sites/1C0xbF1SKgnQ0Z1nYjvdiv/*.mjs`). Global tokens, fonts, text styles, buttons and eyebrow are in `CLONE_SPEC.md` §0 and are **only referenced** here. Assets are listed in `public/assets/MANIFEST.md` (sections "/company", "/careers", "/imprint, /data-privacy, /terms-of-service").
Reference captures are in `reference/pages/<slug>-1440-fullpage.png` and `<slug>-390-fullpage.png`. They were taken with the cookie banner rejected and a tall viewport. The legal captures are cut off at 16000px.

**Breakpoints/containers are the same as §0.1/§0.2.** Every section below sits in the page column `display:flex; flex-direction:column; align-items:center; background:#fff; overflow:clip`.

**What these pages have in common**
- **Appear animations:** none. I checked the inline pre-hydration styles and found no `data-framer-appear-id`, opacity, or transform starts other than the team ticker. Motion is limited to the eyebrow spinner (global), the nav state (company only), the team ticker, the WebGL shaders, button hovers (global), Lenis smooth scroll (global), and the footer wordmark opacity (global).
- **Hover:** the job rows, commitment cards, stat cards, team cards and careers cards have no hover effect (I diffed the computed styles before and after hover). Only the pill buttons hover, as specified in §0.6.
- **Footer:** REUSE Footer (identical: Desktop/Tablet/Phone variants, same links, wordmark, `#footer-trigger` 200px marker at the end of the content). Its height is 612 @1440, 670 @810 and 1156 @390.
- **Cookie banner:** REUSE CookieBanner (identical, global).

## Navbar initial state per page (REUSE Navbar — add a `variant` prop)
| Page | Desktop (≥1200) | Tablet/phone |
|---|---|---|
| /company | **Same as home.** Starts in "Desktop Transparent" (white logo/links, Sign in = glass "Transparent White Text", Book a call = White). After `#nav-trigger` (top:100px) leaves view it becomes "Desktop Blurred BG" (Header Content max-w 1280, padding 24px 20px, BG layer at 80,8 1280x72, rgba(255,255,255,.72), blur(5px), radius 16, opacity 1, dark logo/links, Sign in "Transparent", Book a call "Black"). Behaviour is identical to CLONE_SPEC §1. | "Mobile Transparent Collapsed": bar 390x80, transparent, white logo and white hamburger lines. Turns white after scroll (as on home). |
| /careers, /imprint, /data-privacy, /terms-of-service | **New variant "Desktop White"**, static from load with **no scroll change**. Wrapper 100%x72, `background:#fff`, **1px bottom border rgb(235,235,235)** (Framer border vars, bottom only). Header Content max-w 1320, padding `16px 20px`; inner BG layer stays opacity 0. Dark logo (`svg/logo-dark.svg`); nav labels rgb(26,24,20); Sign in = "Transparent" (rgba(255,255,255,.12) bg, dark text); Book a call = "Black". | "Mobile White Collapsed" from load: bg #fff, 1px bottom border rgb(235,235,235), height 80, dark logo, hamburger lines rgb(26,24,20). |

---------------------------------------------------------------------------------------------------

# A. /company

Title `Company — Primefold`. Meta description: `One engine, every industry it runs. We build AI-native intelligence from Berlin — evidence first, privacy by architecture, close to the work.`
Document height: 3066 @1440 · 3391 @810 · 4646 @390.

DOM order: **Hero** (with stat cards) → **Content** (white wrapper `max-width:1320px`, column, gap 10) containing **Commitments** and **Team** → `#footer-trigger` → **CTA "Open Roles" variant** (desktop only; tablet/phone use the standard home CTA) → **Footer**.

## A1. Hero (NEW)
`section` 100% wide, **height is content-driven, not 100vh** (1440x902 · 810x1015 · 390x1507). Column, `align-items:center`, **gap 56**, padding `156px 20px 88px`, overflow clip. `#nav-trigger` 1x1 marker at top:100px.
- **Background:** `<img>` `assets/pages/company/cThFoE5iLieFxYjJ383g6O72ETg.webp` absolutely filling the whole section, `object-fit:cover`, alt `City skyline with high-rise offices at dusk`. There is no gradient overlay (the image itself is dark/warm) and no parallax (I measured the transforms while scrolling).
- **Content** (max-w 1280, column, gap 20, left-aligned, x=80 @1440 / 20 @810/390):
  - Text stack (max-w **600**, column, gap 16):
    - Eyebrow (REUSE Eyebrow with differences: spinner glyph and label color are **rgba(255,255,255,.72)** instead of rgb(97,97,97)). Label `Company`.
    - h1 `From the right question to the right decision.` — Stack Sans Headline 400, **56/67.2, ls 1.12px** (0.02em), #fff. Renders 3 lines @1440 (600x202). @810: **48/57.6 ls .96**. @390: **42/50.4 ls .84**.
    - p wrapper **opacity .56**: Inter 16/24 400 ls -0.16px #fff. Copy: `Primefold reads, connects and analyzes information scattered across documents, data and conversations. Ask a question, ` **`understand what it means`** (`<strong>`, 700) `, and decide what to do next.` (3 lines @1440, 600x72).
  - Buttons row (gap 16): REUSE Button **White** `Book a call` (111x40) → `https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold`; REUSE Button **Transparent White Text** (glass: rgba(255,255,255,.12) + blur(10px)) `See open roles` (140x40) → `/careers#roles`.
- **Stat cards** ("Image" grid, max-w 1280): `display:grid`. @1440: 4 cols of 308, gap 16, cards **308x216**. @810: 2 cols of 377, cards 377x200. @390: 1 col of 350, cards 350x192 (the last card is 350x200 because its label wraps to 2 lines).
  - Card (glass): `background: rgba(120,120,120,.24); backdrop-filter: blur(5px); border-radius:16px; box-shadow: 0 0 0 1px rgba(255,255,255,.18), 0 0 0 2px rgba(0,0,0,.24), 0 2px 2px 0 rgba(0,0,0,.12); padding: 40px 41px; overflow:clip`.
  - Inner column, gap **40**: top row (`flex; justify-content:center; align-items:center; gap 12`) = label p (flex:1; Inter 14/20 500 ls -0.084px **rgba(255,255,255,.56)**) + 32x32 icon tile (radius 8). Below it is the value h2 (Stack Sans 400, **48/56 ls .96 #fff** @1440 · 44/48 ls .88 @810 · 32/40 ls .64 @390).
  | # | Label (verbatim) | Value | Icon tile |
  |---|---|---|---|
  | 1 | `Founded in Berlin` | `2024` | `<img>` `xHFcroRcWC2fxNduO7fVX1WKWvQ.svg` 32x32 (German-flag tile), radius 8, `box-shadow 0 0 0 1px rgba(0,0,0,.08)` |
  | 2 | `Where your data sits` | `EU` | tile bg rgba(156,156,156,.12), ring rgba(0,0,0,.08); 20x20 centered mask `mask-stat-data-sits.svg`, fill #fff |
  | 3 | `Products live today` | `2` | tile bg rgba(32,131,116,.12), ring `0 0 0 1px rgba(32,131,116,.16)`; 20x20 inline `icon-stat-products-live.svg` (teal duotone) |
  | 4 | `Credibility: Answers traced to source` (2 lines) | `100%` | tile bg rgba(157,96,68,.12), ring `0 0 0 1px rgba(58,30,17,.16)`; 20x20 mask `mask-stat-credibility.svg`, fill rgb(202,123,87) |

## A2. Commitments (NEW, inside Content)
`section` bg #fff, column, align center, **gap 56** (phone 32), padding-bottom 88.
- Title wrapper: max-w 1320, padding `88px 20px 0` (phone `80px 20px 0`). Title stack max-w **565**, gap 16: REUSE Eyebrow `How we work` + Section H2 (§0.5: 48/56 → 44/48 → 32/40, rgb(33,33,33)) `Four commitments.`
- Cards grid: max-w 1320, padding `0 20px`, `display:grid; gap:24px`. @1440: 4 cols of **302**, cards 302x**182**. @810: 2x2 grid of 373x162. @390: 1 col of 350x162.
  - Card: bg **rgb(250,250,249)**, radius **12**, `box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px 0 rgba(36,36,36,.04)`, padding 24. Column, gap 10: [icon 24x24 (CSS mask, bg rgb(26,24,20)) → 16px → h3] then p.
  - h3: Inter 16/24 500 ls -0.16px rgb(33,33,33). p: Inter 14/20 400 ls -0.084px rgb(84,84,84).
  | Icon | h3 | p |
  |---|---|---|
  | `mask-commit-evidence.svg` (open book) | `Evidence first` | `Every answer points back to the material it came from.` |
  | `mask-commit-conversational.svg` (chat bubble) | `Conversational by design` | `Start with the question, not a dashboard. Keep asking until the answer is clear.` |
  | `mask-commit-privacy.svg` (fingerprint) | `Privacy by architecture` | `Privacy and data separation are built in from the start, not added later.` |
  | `mask-commit-close-to-work.svg` (globe/compass) | `Close to your work` | `Built around how you work, in the language you use.` |

## A3. Team — auto-scrolling ticker (NEW, inside Content)
`section` bg #fff, column, gap **56** (phone 32), padding-bottom 88. Title wrapper is the same as A2 (padding `88px 20px 0` / phone 80), title max-w **620**: Eyebrow `Team` + H2 `Who you'll be working with.` (typographic apostrophe `you’ll` in the render; 2 lines @390).
- Row wrapper: max-w 1320, padding `0 20px`; ticker `ul` (flex row, **gap 20**, list-style none) **with no edge fade and no mask**. The ticker overflows visibly and bleeds edge to edge across the viewport (clipped only by the page `overflow:clip`). See `reference/pages/company-1440-fullpage.png`.
- **Motion (source: Framer Ticker):** `velocity: 40` (px/s, leftward), `gap: 20`, `hoverModifier: 100` (**no slow-down on hover**, which I confirmed by measurement), not draggable, `align: start`, infinite loop (the items are duplicated to fill the row). Measured drift on the live site is about 30–36 px/s. Before measuring, the `ul` renders at `opacity:0; transform:translateX(-20px)`, then switches to opacity 1 (an instant swap, not a tween). Implement it as a CSS marquee: duplicate the list and run `translateX(0 → -50%)` linearly at 40px/s.
- Card ("Variant 2"): column, gap **12**. Image box **240x240** (tablet 240, **phone 200x200**), radius 12, `box-shadow 0 0 0 1px rgba(0,0,0,.08)`, overflow clip, img `object-fit:cover`. Info column gap **4**: name (Inter 14/20 **500** ls -0.084px **#000**) and role (Inter 14/20 500 ls -0.084px **rgb(84,82,78)**). Card height is 296 (phone 256).
- Members in order (CMS):
  | Name | Role | Image |
  |---|---|---|
  | Vlatko | Head of GTM | 3zbWLtUigaimRPvHa17qjHrSo.jpg |
  | Sascha | CTO | A7Zab1F86r1LurCg6qIYp3yuDfk.png |
  | Karin | Head of Operations | RRRMo8VEDPhgXGP0eDSa9hfF79Y.jpg |
  | Leon | Co-CEO | 6h8EguiMMITYb9BMDmhVQXkfK8s.png |
  | Kolja | Co-CEO | h63PIXKy2FbcuS3xvlLNCOqdPJE.png |
  | Sören | Design Engineer | 5NjsgQTPDgQ22BuwjoC7zeK6Wh4.png |
  | Bonnie | Head of R&D | xq7luLsfgY19ghf6ZBb5IJARos.png |
  | Sina | Head of CX | zhGcLxBS5x03ufEDXGoKd3glfLA.jpg |
  | Dominik | Fullstack Engineer | HLubUcaF5PkYUUdao5a1rbVrFlQ.jpg |
  | Hasnain | Fullstack Engineer | uOQue07cY4YYexGJZLdTuFYFo.jpg |
  | Oxana | Quality Assurance Specialist | b4NgR6Stsk2NnqPDsiywkcp0qk.jpg |
  | Sarah | Lead Engineer | 5XYAbfBnho3Vgmn3T7dy4CGFk0.png |
  All images have empty alt and live in `assets/pages/company/`.

## A4. CTA
- **Desktop (≥1200): REUSE CTA with differences ("Open Roles" variant).** The wrapper is named "Open Roles" (bg #fff, padding `24px 20px`, total 1440x416). The card is **1280x368** (not 388) with **padding `110px 20px`** (not 82). It keeps the same bg rgb(26,24,20), radius 24, shadow and **the same wave shader / fallback** as home (confirmed visually). The content is the same structure (gap 20; text gap 12, max-w 620). Copy:
  - H2 `Ready to make an impact?` (1 line @1440, 620x56)
  - p (max-w 372) `See where your work could make a difference.`
  - REUSE Button **White** `See open roles` (140x40) → `/careers#roles`.
- **Tablet and phone: REUSE CTA (identical to home).** Framer swaps in the standard "Main" CTA at these widths: card 770x372 / 350x356, copy `Ask your data. Get the answer.` / `Bring a real business question. Get the answer you need to move forward.` / `Book a call`. This is a Framer authoring quirk, reproduced here as measured.

## A5. Footer — REUSE Footer (identical).

---------------------------------------------------------------------------------------------------

# B. /careers

Title `Careers — Primefold`. Meta description: `Come build what's next. Join a remote-first team of AI pioneers, builders and thinkers shaping the next generation of business intelligence.`
Document height: 2998 @1440 · 3040 @810 · 3923 @390. Navbar is "Desktop White" (see the table above).
DOM order: **Hero** (+ two shader cards) → **Open Roles** (`#roles`) → `#footer-trigger` → CTA (desktop "Open Roles" variant / tablet-phone standard) → Footer.

## B1. Hero (NEW, light)
`section` bg is the page white, column, align center, gap **56**, padding `156px 20px 88px`. Height 1029 @1440 · 1010 @810 · 1471 @390. `#nav-trigger` at top:100.
- Content (max-w 1280, gap 20). Text stack max-w **650**, gap 16:
  - REUSE Eyebrow (identical, grey) `Careers`.
  - h1 `Own the work. See the impact.` — Stack Sans 400 **56/67.2 ls 1.12px, color #000 (rgb(0,0,0))**, 2 lines @1440. 48/57.6 ls .96 @810; 42/50.4 ls .84 @390.
  - p: Inter 16/24 400 ls -0.16px **rgb(84,82,78)**: `Take ideas from first conversation to execution, with the freedom to shape the work and see the result.`
  - Button row: REUSE Button **Black** `See open roles` (140x40) → `#roles` (same-page anchor; Lenis `anchors:true` smooth-scrolls to it).
- **Cards** grid (max-w 1280, gap 16). @1440: 2 cols of **632**, cards **632x435**. @810: 2 cols of 377x435. @390: 1 col of 350x435, row gap 16.
  - Card: bg #fff (under the canvas), radius **16**, `box-shadow 0 0 0 1px rgba(0,0,0,.08)`, overflow clip, position relative.
  - **Background = WebGL GradientWave shader** filling the card. Props (source): `u_colors: [rgb(0,0,0), rgb(0,0,0), rgb(39,168,150), rgb(202,123,87)]`, `u_waveSpeed .55`, `u_waveAngle 105`, `u_waveAmplitude 2.1`, `u_waveFreqX .9`, `u_waveFreqY 6`, `u_blendAmount .54`, `u_maskSoftness .74`, `u_seed 32`, mode `progressive`, animated. This is the same shader family as the home CTA. **Card 2's shader layer is rotated 180°** (`transform: rotate(180deg)` / matrix(-1,0,0,-1)). Static fallbacks: `assets/pages/careers/DLxHDgiuFQf9DQC0sTFOvpSlftU.png` (desktop), `fIGQ0rh0peFiNBGjC1QotXsuII.png` (tablet), `jcUFdKyfpvvIi4q0EUUYzRgd5no.png` (phone), all `object-fit:cover`. Rotate the fallback 180° on card 2 as well. Teal/orange glow sits top/middle on a black base.
  - Overlay: `position:absolute; left:0; right:0; bottom:0; height:249px; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.9) 69.425%, #000 100%)`. Card 2 starts the gradient at `rgba(255,255,255,0)` (visually identical).
  - Text block: absolute, bottom-anchored, full width, padding **40** (phone **32**), column gap 12:
    - h2 (Stack Sans 400 **20/28**, ls normal, #fff): card 1 `How you work`, card 2 `How we hire`.
    - p (Inter 14/20 400 ls -0.084px **rgb(237,237,237)**). It starts with a bold `<strong>` (700) lead followed by prose; I did not transcribe the prose. Card 1: lead **`You own the work, not a ticket queue.`** + 2 sentences (~36 words total, 4 lines @1440). Card 2: lead **`A clear process, from first conversation to offer.`** then a `<br>`, then 2 sentences (~32 words; 3 lines @1440).

## B2. Open Roles (`section#roles`, NEW)
Full-width section, bg **#FAF9F8** (rgb(250,249,248)), overflow clip, height 940 @1440/810 · 892 @390. Inner "Questions" container: max-w 1320, padding **`88px 20px`** (phone **`44px 20px`**), column, **row gap 32**.
- Title block: column gap 16 (eyebrow → h2 → p):
  - REUSE Eyebrow `Questions` (verbatim, even though the section is about roles).
  - Section H2 `Where we need people.` (2 lines @390).
  - Lead p (Inter 14/20 400 ls -0.084px rgb(84,84,84)): `Explore the roles where you can own the work and see the impact.`
  - **Quirk:** Framer gives this title wrapper a fixed height of **128px**. On phone the content is 172px tall, so the lead paragraph's second line ends up under the first job card (visible in `reference/pages/careers-390-fullpage.png`). A clone should use `height:auto`; flag this to the user if pixel-parity is wanted.
- **Job list:** column, **gap 20**, full content width (1280 / 770 / 350). There are no accordions and no expanding: each row is a static card.
  - Row card: bg #fff, radius **12**, `box-shadow 0 0 0 1px rgba(0,0,0,.08)`, padding **24**, overflow clip. Height 136 (phone 156 when the meta line wraps).
  - Inner column, gap **12**:
    1. Meta line (flex row, gap **4**, wrap, align center): Inter **12/16 500** ls normal. The first item is **teal rgb(39,168,150)**; then `·`, item 2, `·`, item 3 in **rgb(97,97,97)**.
    2. Bottom row: `flex; justify-content:space-between; align-items:flex-end`. Left column gap 12: **h5** (Stack Sans 400 **20/28**, ls normal, rgb(33,33,33)) + p (Inter 14/20 400 ls -0.084px rgb(84,82,78)). Right: REUSE Button **Black** `Apply` (**72x40**).
  - Rows (CMS data rendered verbatim — the original repeats the title in fields 1, 2, the h5 and the p):
  | Meta (teal · grey · grey) | h5 | p | Apply → |
  |---|---|---|---|
  | `Key Account Manager` · `Key Account Manager` · `Berlin, Germany, Remote` | Key Account Manager | Key Account Manager | `https://work-at-saypien.jobs.personio.com/job/2801519` |
  | `Design Engineer` · `Design Engineer` · `Remote, Berlin` | Design Engineer | Design Engineer | `https://work-at-saypien.jobs.personio.com/job/2826769` |
  | `Solutions Engineer` · `Solutions Engineer` · `Berlin, Germany, Remote` | Solutions Engineer | Solutions Engineer | `https://work-at-saypien.jobs.personio.com/job/2443678` |
  | `Open application` · `Open application` · `Remote` | Open application | Open application | `/contact` |
  - Row hover: none (only the Apply button's §0.6 Black hover).
  - Phone: the meta line wraps to 2 lines (36px) and the left column narrows to 230px; Apply stays bottom-right.

## B3. CTA — same as A4 (desktop "Open Roles" variant 1280x368 `Ready to make an impact?` → `See open roles` `/careers#roles`; tablet/phone standard home CTA).
## B4. Footer — REUSE Footer (identical).

---------------------------------------------------------------------------------------------------

# C. Legal template (/imprint, /data-privacy, /terms-of-service)

All three pages share **one layout**. Only the rich-text content differs, and each page uses a few different tag presets (detailed below). DOM order: **Legal Content** section (`#scroll-hero`) → `#footer-trigger` (named "Top Anchor" on DP/ToS) → **CTA (REUSE CTA, identical to home**: card 1280x388 padding 82, `Ask your data. Get the answer.` / 2-line p / White `Book a call`; tablet 770x372, phone 350x356) → **Footer (REUSE, identical)**. The navbar is "Desktop White" / "Mobile White Collapsed". There is **no table of contents, no sidebar, no sticky elements and no appear animation**.

| Page | Title tag | Meta description | Doc height 1440 / 810 / 390 |
|---|---|---|---|
| /imprint | `Imprint — Primefold` | `Legal notice (Impressum) for saypien GmbH, the company behind Primefold. Registered in Berlin, Germany.` | 1860 / 1892 / 2427 |
| /data-privacy | `Data Privacy — Primefold` | `How Primefold collects, processes and protects personal data — GDPR-compliant processing, EU hosting and your rights as a data subject.` | 21812 / 23827 / 37283 |
| /terms-of-service | `Terms of Service — Primefold` | `The legal terms governing your use of Primefold's products and services, including subscriptions, billing and acceptable use.` | 18283 / 20467 / 34220 |

## C1. Layout geometry
- `section[Legal Content]`: width 100%, **max-width 1600px**, column, `align-items:flex-start`, `justify-content:center`, gap 120 (only one child). **Padding `152px 80px 120px`** at ≥810, and **`152px 24px 120px`** at phone.
- Inner "text" column: full content width (1280 @1440, 650 @810, 342 @390), column, `align-items:center`.
  - Title wrapper and rich-text wrapper are both **`max-width:768px; width:100%`**, so the reading column is **768px centered (x 336..1104 @1440)**. At 810 it is 650 wide at x=80 (it fills the padded width). At 390 it is 342 wide at x=24.
  - **Title → body gap: 32px** on /data-privacy and /terms-of-service, but **16px** on /imprint (a slightly different wrapper). Measured: h1 bottom 219 → body top 251 (DP/ToS) and 235 (imprint) @1440.
- Page title `h1` (verbatim per page, see C3): Stack Sans Headline 400, **56/67.2 ls 1.12px #000** → 810: **48/57.6 ls .96** → 390: **42/50.4 ls .84**. Margin 0. Font features `"ss04","ss11"` (plus Inter cv features inherited; harmless).

## C2. Rich-text styles (computed; the same at all widths unless noted)
All rich-text blocks are direct children of one wrapper, with **no flex gap**. Spacing comes only from `margin-top`; the first child has margin 0. `white-space: pre-wrap`.
| Element | Font | Size/LH @1440 | @810 | @390 | Weight | Letter-spacing | Color | Margin-top |
|---|---|---|---|---|---|---|---|---|
| `p` | Inter | 18/24 | same | same | **500** | -0.18px (-0.01em) | rgb(26,24,20) | **20px** (0 if first child, and 0 inside `li`) |
| `strong` | Inter | inherit | | | **700** | inherit | inherit | — |
| `em` | Inter italic | inherit | | | 500 | | inherit | — |
| `a` (DP preset) | Inter | inherit | | | 500 | | **#594AFF** rgb(89,74,255), no underline; **hover: color #212121 + underline** (source vars `--framer-link-hover-text-color: #212121`, `--framer-link-hover-text-decoration: underline`), instant (no transition) | — |
| `a` (imprint) | Inter | inherit | | | 500 | | inherits rgb(26,24,20), no underline (no link preset) | — |
| `h2` (ToS) | Stack Sans Headline | **40/48** | **36/40** | **32/36** | 400 | 0.02em (0.8 / 0.72 / 0.64px) | #000 | **40** (390: **32**) |
| `h3` (ToS) | Stack Sans Headline | **32/40** | **28/32** | **26/30** | 400 | normal | rgb(26,24,20) | **20** (810: **28**, 390: **26**) |
| `h3` (DP, only "Privacy Policy") | Stack Sans Headline | 48/56 | 48/56 | 48/56 | 400 | 0.96px | #000 | 40 |
| `h4` (DP) | Stack Sans Headline | **28/33.6** | **26/31.2** | **24/28.8** | **700** | normal | #000 | **28** |
| `h4 strong` (DP, some headings) | Stack Sans Headline | inherit | | | 900 (synthesised from the 700 file) | | #000 | — |
| `h6` (ToS "Last updated…") | Stack Sans Headline | 16/19.2 | same | same | 400 | normal | rgb(26,24,20) | 0 (first child) |
| empty `h1` spacer (DP) | "Stack Sans Headline Regular" (= the 400 file) | 64/72 | same | same | 400 | 1.28px | #000 | 0 → renders as a **72px empty block**. It appears before most DP `h4`s, so the effective gap above those h4s is 72 + 28 = **100px**. Implement as `<div class="h-[72px]" aria-hidden>`. |
| `ul` / `ol` | — | — | | | | | | **0**; `padding:0; margin:0; list-style:none` |
| `li` | Inter | 18/24 | | | 500 | -0.18px | rgb(26,24,20) | 0 (no gap between items). `padding-left: 23.24px` (≈1.29em); contains a `<p>` with margin 0 |
| `li::before` | Inter 18px | | | | | | rgb(26,24,20) | `position:absolute; left:0; top:0;` content **`"•"`** in `ul`, and **`counter(list-item, lower-alpha) "."`** in `ol` (DP's ordered lists all use lower-alpha: a. b. c.) |
| Block after a list | `p` keeps its 20px margin-top | | | | | | | |
Font features on p/li/a/h4: `font-feature-settings: "blwf","cv03","cv04","cv09","cv11"` (Inter alternates: rounded quotes, single-storey a, etc.). h1/h2/h3 also add `"ss04","ss11"`. ToS h3 uses only `"ss04","ss11"`.
`<br>` line breaks inside p are used heavily, especially on the imprint. Some DP h4s end with a trailing `<br>` and so render one empty extra line: `Google Analytics 4` (101px tall @1440), `Meta Pixel` (101), `Hubspot` (67), `Safety` (67), `Conclusion` (67).
**Tailwind:** implement as a `.legal-prose` component class rather than @tailwindcss/typography defaults, because these values differ from typography's.

## C3. Content structure (copy not transcribed; headings verbatim)
Counts: "p" = paragraphs; "short" = one-line/label paragraphs of 12 words or fewer (usually a lone `<strong>` label such as `Description and purpose`, `Legal basis`, `Recipient`, `Transfer to third countries`, `Duration of data storage`, `Revocation`, `Contractual and legal obligation`, `Further information on data protection`). Word counts are approximate.

### /imprint — h1 `Imprint`
7 paragraphs, no headings. Each paragraph is a bold `<strong>` label followed by values on `<br>`-separated lines:
1. **`Legal Notice (Impressum)`** (strong only)
2. **`Information pursuant to § 5 DDG:`** (strong only)
3. Company name and address, 4 lines (no label)
4. `Email:` + mailto link (`support@primefold.ai` → `mailto:support@primefold.ai`) / **`Website:`** + link text `www.primefold.ai` (href is `http://www.saypien.io/`, as on the original)
5. **`Commercial Register:`** + court / **`Registration Number:`** + number (2 lines)
6. **`Managing Directors authorized to represent the company:`** + names (2 lines)
7. **`VAT Identification Number pursuant to § 27 UStG:`** + number (2 lines)
The values (address, register number, director names, VAT ID) are not transcribed per the copy rule. Get them from the live page or the user's own legal data.

### /data-privacy — h1 `Data Privacy`
Preamble: 1 short p (version line, format `DSE primefold | <date> | v2`) + 1 empty p (a `<br>`). Then (an "empty spacer" listed under a heading is the 72px empty h1 at the END of that section, i.e. right before the next h4):
- `h3` 'Privacy Policy' — 1 p (~60w)
- `h4` 'Controller for processing according to GDPR' — 1 p (~35w); 5 short label/one-line p; 1 empty spacer
- `h4` 'Data protection officer' — 7 short label/one-line p; 1 empty spacer
- `h4` 'What are personal data?' — 1 p (~63w); 1 empty spacer
- `h4` 'Scope of anonymous data collection and data processing' — 1 p (~66w); 1 empty spacer
- `h4` 'Legal basis for the processing of personal data' — lists: ol×5 items (~190w); 1 empty spacer
- `h4` 'Use of cookies' — 2 p (~271w); 1 empty spacer
- `h4` 'Creation of log files' — 1 p (~104w); 1 empty spacer
- `h4` 'Duration of storage of personal data' — 1 p (~35w); 1 empty spacer
- `h4` 'Contact opportunities' — 1 p (~240w); 1 empty spacer
- `h4` 'Newsletter' — 1 p (~255w); 1 empty spacer
- `h4` 'Routine deletion and blocking of personal data' — 1 p (~85w); 1 empty spacer
- `h4` 'Rights of the data subject' — 1 p (~31w); 1 empty spacer
- `h4` 'Right of access by the data subject acc. to Art. 15 GDPR' — 2 p (~80w); lists: ol×8 items (~155w); 1 empty spacer
- `h4` 'Right to rectification acc. to Art. 16 GDPR' — 1 p (~36w); 1 empty spacer
- `h4` 'Right to erasure acc. to Art. 17 GDPR' — 3 p (~116w); lists: ol×6 items (~147w), ol×5 items (~134w); 1 empty spacer
- `h4` 'Right to restriction of processing acc. to Art. 18 GDPR' — 2 p (~102w); lists: ol×4 items (~108w); 1 empty spacer
- `h4` 'Notification obligation regarding rectification or erasure of personal data or restriction of processing acc. to Art. 19 GDPR' — 1 p (~61w); 1 empty spacer
- `h4` 'Right to data portability acc. to Art. 20 GDPR' — 1 p (~54w); lists: ol×2 items (~119w); 1 empty spacer
- `h4` 'Right of objection acc. to Art. 21 GDPR' — 1 p (~178w); 1 empty spacer
- `h4` 'Right to revoke the declaration of consent under data protection law pursuant to Art. 7 (3) GDPR' — 1 p (~40w); 1 empty spacer
- `h4` 'Right to lodge a complaint with a supervisory authority acc. to Art. 77 GDPR' — 1 p (~85w); 1 empty spacer
- `h4` 'Automated decision in individual cases including profiling' — 3 p (~143w); lists: ol×3 items (~57w); 1 empty spacer
- `h4` 'Integration of other third-party services and content' — 3 p (~269w); 3 short label/one-line p; 1 empty spacer
- `h4` 'Data transmission to third countries' — 4 p (~328w); 1 empty spacer
- `h4` 'Applications' — 1 p (~399w); 1 empty spacer
- `h4` 'Analytics, marketing and customer communications' — 1 p (~104w); 1 empty spacer
- `h4` 'Calendly' — 7 p (~398w); 12 short label/one-line p
- `h4` 'Google Analytics 4' — 8 p (~487w); 9 short label/one-line p
- `h4` 'Hubspot' — 10 p (~510w); 9 short label/one-line p
- `h4` 'Meta Pixel' — 8 p (~461w); 11 short label/one-line p; lists: ul×3 items (~403w)
- `h4` 'Safety' — 1 p (~54w)
- `h4` 'Conclusion' — 1 p (~29w); 1 empty spacer
(The h4s from "Calendly" through "Meta Pixel" are sub-services of "Analytics, marketing and customer communications" and have **no spacer** before them.) DP has 13 links (C2 `a` preset), all external (keyed.de, gdpr.eu, calendly, hubspot, facebook, dataprivacyframework.gov, hellotrust.de).

### /terms-of-service — h1 `Terms of Service`
- `h6` 'Last updated 2 April 2026' — (no body)
- `h2` 'AGREEMENT TO OUR LEGAL TERMS' — 8 p (~346w)
- `h2` '1. OUR SERVICES' — 1 p (~87w)
- `h2` '2. INTELLECTUAL PROPERTY RIGHTS' — (no body)
- `h3` 'Our intellectual property' — 3 p (~103w)
- `h3` 'Your use of our Services' — 5 p (~206w); lists: ul×3 items (~30w)
- `h3` 'Your submissions and contributions' — 9 p (~501w); lists: ul×4 items (~128w)
- `h3` 'Copyright infringement' — 1 p (~37w)
- `h2` '3. USER REPRESENTATIONS' — 2 p (~153w)
- `h2` '4. USER REGISTRATION' — 1 p (~57w)
- `h2` '5. PURCHASES AND PAYMENT' — 4 p (~287w); 1 short label/one-line p; lists: ul×3 items (~2w)
- `h2` '6. SUBSCRIPTIONS' — (no body)
- `h3` 'Billing and Renewal' — 1 p (~61w)
- `h3` 'Free Trial' — 1 p (~32w)
- `h3` 'Cancellation' — 1 p (~44w)
- `h3` 'Fee Changes' — 1 p (~25w)
- `h2` '7. PROHIBITED ACTIVITIES' — 1 p (~43w); 1 short label/one-line p; lists: ul×23 items (~540w)
- `h2` '8. USER GENERATED CONTRIBUTIONS' — 2 p (~140w); lists: ul×13 items (~314w)
- `h2` '9. CONTRIBUTION LICENSE' — 4 p (~334w)
- `h2` '10. THIRD-PARTY WEBSITES AND CONTENT' — 1 p (~322w)
- `h2` '11. SERVICES MANAGEMENT' — 1 p (~141w)
- `h2` '12. PRIVACY POLICY' — 1 p (~102w)
- `h2` '13. COPYRIGHT INFRINGEMENTS' — 1 p (~110w)
- `h2` '14. TERM AND TERMINATION' — 2 p (~188w)
- `h2` '15. MODIFICATIONS AND INTERRUPTIONS' — 2 p (~181w)
- `h2` '16. GOVERNING LAW' — 1 p (~112w)
- `h2` '17. DISPUTE RESOLUTION' — (no body)
- `h3` 'Informal Negotiations' — 1 p (~78w)
- `h3` 'Binding Arbitration' — 1 p (~100w)
- `h3` 'Restrictions' — 1 p (~85w)
- `h3` 'Exceptions to Informal Negotiations and Arbitration' — 1 p (~130w)
- `h2` '18. CORRECTIONS' — 1 p (~49w)
- `h2` '19. DISCLAIMER' — 1 p (~319w)
- `h2` '20. LIMITATIONS OF LIABILITY' — 1 p (~165w)
- `h2` '21. INDEMNIFICATION' — 1 p (~184w)
- `h2` '22. USER DATA' — 1 p (~101w)
- `h2` '23. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES' — 1 p (~131w)
- `h2` '24. MISCELLANEOUS' — 1 p (~231w)
- `h2` '25. CONTACT US' — 1 p (~23w); 1 short label/one-line p
The ToS has no links in its body. The final "short" block under `25. CONTACT US` is a 5-line `<br>` address block (company, street, city, country, email).

## C4. Responsive summary (legal)
| | 1440 | 810 | 390 |
|---|---|---|---|
| Section padding | 152 80 120 | 152 80 120 | 152 **24** 120 |
| Reading column | 768 centered | 650 (full) | 342 (full) |
| h1 | 56/67.2 | 48/57.6 | 42/50.4 |
| ToS h2 / h3 | 40/48 mt40 · 32/40 mt20 | 36/40 mt40 · 28/32 mt28 | 32/36 mt32 · 26/30 mt26 |
| DP h4 | 28/33.6 | 26/31.2 | 24/28.8 |
| Body p | 18/24 mt20 | same | same |

---------------------------------------------------------------------------------------------------

# D. Globals reused (summary)
- Navbar: company = home behaviour; careers/legal = new static "Desktop White" / "Mobile White Collapsed" variant (spec in the table at the top).
- Footer, CookieBanner, Lenis smooth scroll, footer ghost-wordmark opacity: identical.
- Button variants used: White, Black, Transparent White Text (glass), Transparent (nav). Hover per §0.6.
- Eyebrow: identical on careers, legal and company sections. On the company hero it uses a 72% white spinner and label.
- CTA: identical on legal, company/careers tablet+phone. On company/careers desktop it is a variant (padding 110, height 368, different copy/link).
- Not used on these pages: Testimonials, logo ticker, Outcomes, Trust, Solutions.

# E. Unresolved / not measured
- The WebGL shaders (careers cards, CTA) can't be read as pixels in a deterministic way. Uniforms come from source; reproduce them with the fallback PNGs, optionally with a slow animated drift.
- The ticker speed reads as about 30–36 px/s in headless Chromium, against `velocity: 40` in source. Use 40.
- I did not check the Apply links' `target` attribute (personio is an external domain). Assume they open in the same tab, as other Framer links do.
- The careers phone overlap (B2 quirk) is reproduced as measured. Decide whether to replicate it or fix it.
- DP `h4 strong` renders at weight 900 with only a 700 file loaded (browser-synthesised bold). Visual parity needs the same synthesis, so don't add a 900 face.
- The legal full-page reference captures are cut off at 16000px (DP is 21812px tall, ToS is 18283px).
