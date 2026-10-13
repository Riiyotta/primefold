Source: https://primefold.ai/

# Primefold CMS: Blog + Case Studies spec

Routes: `/blog`, `/blog/:slug` (12 posts), `/case-studies`, `/case-studies/:slug` (3 studies).
Measured 2026-10-13 with headless Chromium (Playwright) at **1440x900**, **810x1080** and **390x844**, using computed styles, bounding rects, Framer style-preset CSS rules, and the card component module (`VB8TpR4Gw.*.mjs`). Unless marked otherwise, values are at 1440 → 810 → 390.

- Data for every item (titles, dates, authors, covers, stats, block structure): **`specs/cms-data.json`**.
- Assets: `public/assets/cms/*`, catalogued in `public/assets/MANIFEST.md` under **## CMS**.
- Reference screenshots (full page) in `reference/pages/`: `blog-1440.png`, `blog-390.png`, `case-studies-1440.png`, `case-studies-390.png`, `blog-post-primefold-xi-is-here-{1440,390}.png`, `case-study-nas-{1440,390}.png`. The cookie banner shows in the bottom-right of every capture; it is the third-party consent widget (home spec §11), not page content.

Global tokens, fonts, pill Button, Eyebrow spinner, CTA, Footer and Navbar are defined in `CLONE_SPEC.md` §0/§1/§9/§10. They are **referenced** here, not re-specced.

---------------------------------------------------------------------------------------------------

## 0. Shared across all four CMS routes

### 0.1 Page frame
- Body/page bg **#ffffff**. The `#FAF9F8` wrapper Framer emits is `display:contents`, so it paints nothing. Do not add a tinted background.
- Order: Navbar (fixed) → page section(s) → **REUSE CTA block** (`CLONE_SPEC §9`, "Main" wrapper `padding:24px 20px`, card 1280 wide) → **REUSE Footer** (`§10`, including the sticky Ghost Wordmark).
- There is no gap between the last content section and the CTA "Main" wrapper (its own 24px top padding is the only space), except on `/case-studies`, where the grid section has `padding-bottom:100px`.
- **REUSE Lenis smooth scroll** (`§0.6`). **REUSE Cookie consent** (`§11`) if the home clone has it.
- `<title>` = `<Title> — Primefold` (em dash with spaces). og:image on every CMS page = `assets/kCEvWj6X9M889dINz1Dophu60Y8.png` (already in assets).
  - `/blog`: title `Blog — Primefold`, description `From the fold: product news, releases and thinking on AI-native business intelligence from the Primefold team.`
  - `/case-studies`: title `Case Studies — Primefold`, description `Proof, not promises. How teams across DACH went from questions to decisions with Primefold's AI-native intelligence.`
  - Posts: description `Read the full story on the Primefold blog — product news, releases and thinking on AI-native business intelligence.` (the same for all 12).
  - Case studies: description `How teams go from questions to decisions with Primefold — a customer story with the evidence behind it.` (the same for all 3).

### 0.2 Navbar initial state (all four routes, every page)
**REUSE Navbar** with a third, static variant. On CMS pages there is **no transparent/hero state and no scroll change**: the same values hold at scrollY 0 and 1500.
- Desktop (≥1200) variant **"Desktop White"**: bar 100%x**72**, bg **#fff**, **1px bottom border rgb(235,235,235)** (drawn as an `::after` hairline). Header Content max-width 1320, padding `16px 20px`. The `[BG]` glass layer stays at opacity 0. Logo = dark (`svg/logo-dark.svg`) at (80,24). Nav text rgb(26,24,20). "Sign in" uses the **Transparent** variant (dark text). "Book a call" uses the **Black** variant. Item x-positions match home §1 state A (607/726/796/887/1018, buttons 1155/1249).
- Tablet/phone variant **"Mobile White Collapsed"**: bar 100%x**80**, bg #fff, the same 1px bottom border rgb(235,235,235), Header Content padding `24px 20px`, dark logo + hamburger. The expand behaviour is unchanged from home §1.
- Implementation: `<Navbar variant="white" />` (always solid). Content starts under it at y=156 (page top padding, see below), not at 72.

### 0.3 Motion on CMS routes (complete inventory)
- **No load/appear animations and no scroll-reveal.** I checked the SSR HTML and found no `data-framer-appear-id` and no `opacity:0` initial states on content.
- Eyebrow spinner on the index heroes: **REUSE Eyebrow** (80ms braille cycle).
- Card hover (index pages): see §1.3 and §2.2. Framer transition for the card component (from source): `{ type: "spring", bounce: 0.2, duration: 0.4, delay: 0 }`. CSS approximation: `transition: color .4s cubic-bezier(.34,1.2,.64,1), gap .4s cubic-bezier(.34,1.2,.64,1)`.
- Rich-text links: color and underline change on hover. Framer gives no duration; use the global `.3s` tween.
- Pill buttons: **REUSE Button** hover (glow, 0.3s linear).
- Footer wordmark scroll-linked opacity: **REUSE Footer**.
- YouTube embeds are click-to-play facades (thumbnail + play glyph, then iframe). There is no autoplay.

### 0.4 Extra fonts needed (added to `public/fonts/`, see MANIFEST "CMS fonts")
- `Inter` **italic** 400/500/700: `Inter-{400,500,700}italic-latin.woff2`, used by `<em>` in body and blockquotes.
- `"Stack Sans Text"` 400: `StackSansText-400.woff2` (latin, already present) + `StackSansText-400-latin-ext.woff2`. Used only by the in-body "primary" button (§3.6). Fallback stack: `"Stack Sans Text", "Stack Sans Text Placeholder", sans-serif`.
- Framer sets `font-feature-settings` on CMS text. Inter presets use `"blwf","cv03","cv04","cv09","cv11"`. Stack Sans Headline presets use the same plus `"ss04","ss11"`. Card titles, rich-text headings and h6 eyebrows set only `"ss04","ss11"`. Apply these to match glyph shapes (Inter cv11 = single-storey a, and so on).

### 0.5 Colors used on CMS routes (beyond §0.3 tokens)
| Use | Value |
|---|---|
| meta / date / role text | `rgb(102,102,102)` #666 |
| hairlines, image borders, info card border | `rgb(235,235,235)` #EBEBEB |
| tag pill bg | `rgb(245,245,241)` |
| stat & quote card bg | `rgb(246,246,246)` |
| card ring | `box-shadow: 0 0 0 1.6px rgba(0,0,0,.08)` |
| numbered (dark) card bg | `rgb(40,38,34)` (= panel-1) |
| body link | `#594AFF` → hover `#212121` + underline |
| heading anchor link | `#212121` → hover `#545454` |
| blockquote text / rule | `#999` / `rgb(221,221,221)` |
| in-body primary button bg / text | `rgb(251,249,246)` / `rgb(16,15,13)` |
| stat value colors (per item, in data) | teal `rgb(32,131,116)`, green `rgb(20,169,0)`, orange `rgb(255,123,0)` |
| XI badge / RI badge | `rgb(32,131,116)` / `rgb(202,123,87)` (SVGs in assets/cms) |

---------------------------------------------------------------------------------------------------

## 1. `/blog` index

Document height 2675 @1440, 4023 @810, 6808 @390.

### 1.1 Hero (`section[Blog Hero]`)
- Section: full width, `padding: 156px 20px 88px`, flex column, align center, overflow clip. Inner content max-width **1280**, flex column, **gap 20**, align start.
- Text block (max-width **570**, flex column, **gap 16**):
  1. **REUSE Eyebrow** with label `Blog` (Inter 14/20 500, ls -0.084px, rgb(97,97,97), spinner + 4px gap).
  2. `h1` `Stay curious.`: Stack Sans Headline 400, **56/67.2 → 48/57.6 → 42/50.4**, ls 0.02em (1.12 / 0.96 / 0.84px), color **#000**, `ss04 ss11`.
  3. Lead `p`: `Follow what we're building, what we're learning, and where AI-powered decision making is heading.` Inter **16/24** 400, ls -0.16px, color **rgb(84,82,78)**. Wraps to 2 lines at 1440/810 and 3 at 390.
- Newsletter form: **REUSE the Footer newsletter form** (§10), but `max-width: 300px` (300x48 here vs 320 in the footer). Same structure: bg #fff, radius 999, 1px ring, padding `6px 6px 6px 16px`, gap 8, input placeholder `you@company.com`, black `Subscribe` button 100x36 (Inter 13/16 500 #fff).
- Positions @1440: eyebrow y156, h1 y192, lead y275, form y343. Hero bottom (grid starts) at y479 (1440), 470 (810), 486 (390).

### 1.2 Grid (`section[Blog Grid]`)
- Section `padding: 0 20px` (no bottom padding), max-width 100%. Inner grid max-width **1280**, centered.
- `display:grid; column-gap:20px; row-gap:32px; align-items:start` (cards keep their own height, top-aligned).
  - ≥1200: **4 columns** of `1fr` (305px @1440). 810–1199: **2 columns** (375px @810). <810: **1 column** (350px @390).
- All 12 posts on one page, newest first, in the order in `cms-data.json` (`blog[]`). **No filters, categories, tags, search or pagination.**

### 1.3 Blog card (`a[Blog]`, whole card is one link → `/blog/:slug`)
- `display:flex; flex-direction:column; gap:20px`.
- **Image**: width 100%, **aspect-ratio 16/9** (305x172, 375x211, 350x197). `border-radius:16px`, `object-fit:cover`, center. **1px solid rgb(235,235,235) border overlay** (Framer `::after` inset 0, same radius, pointer-events none). Source = `cover` in data.
- **Info** (flex column, **gap 20**):
  - Title group (flex column, **gap 16**):
    - Date `p`: Inter **14/20** 400, ls -0.084px (-0.006em), **#666**, for example `Oct 1, 2026` (this is the card `date` in data).
    - Title `h2`: Stack Sans Headline 400 **20/28** at every breakpoint, ls 0, color **rgb(26,24,20)**, `ss04 ss11`. Wraps freely (1–3 lines).
  - Author row (flex row, align center, **gap 12**): avatar **36x36** circle (radius 999, overflow clip, `object-fit:cover`) + text column (gap 0):
    - name: Inter 500 rgb(26,24,20), **16/24 ls -0.16px → 14/20 ls -0.14px → 12/16 ls -0.12px**
    - role: Inter **12/16** 400, ls 0, #666
  - **Posts with no author** (5 posts, `author: null` in data): the original renders Framer's empty-image placeholder (a 36px light-grey circle with diagonal hatch) and no text. Reproduce as a 36x36 circle `background: rgb(235,235,235)` and no name/role, or omit the row. Card heights differ by 32px depending on this.
- **Hover** (on the whole `<a>`): title color `rgb(26,24,20)` → **`rgb(84,84,84)`** (#545454). Image, date and author do not change. There is no scale, no shadow and no underline. Transition per §0.3.
- Measured card heights @1440 (for QA): 3-line title + author = 372, 2-line + no author = 340, 2-line + author = 344.

---------------------------------------------------------------------------------------------------

## 2. `/case-studies` index

Document height 1879 @1440.

### 2.1 Hero (`section[Hero]`)
Identical to §1.1 (same paddings, max-widths, gaps and type) except:
- Eyebrow label `Case Studies`. `h1` `Proof, not promises` (2 lines at 390). Lead `How teams across DACH went from question to decision, and what changed once they did.`
- Instead of the newsletter form: **REUSE Button "Black"** `Book a call` (111x40, label Inter 16/24 500 rgb(254,250,243)). It links to the external Calendly booking used by the nav button (same href as the home "Book a call").
- Grid starts at y471 (1440), 505 (390).

### 2.2 Grid + case card (`a[Case Study]`)
- Grid identical to §1.2 (4/2/1 cols, gap 32/20, max 1280), but the section padding is `0 20px 100px`. 3 cards in order: Gainback, NAS, DIRTS.
- Card = blog card structure (same image spec: 16:9, radius 16, 1px #EBEBEB overlay border, gap 20) with a different Info block:
  - Title group (flex column, gap 16) in visual order: **title `h2`** (Stack Sans Headline 20/28, rgb(26,24,20)), then the **"Read story" row**.
  - "Read story" row: flex row, align center, **gap 16px**. Label `Read story` Inter **16/24** 500, ls -0.16px, rgb(26,24,20). Then a 16x16 arrow drawn as a mask (`assets/cms/icon-arrow-right-mask.svg`) with `background-color: rgb(84,82,78)`.
  - No date and no author.
- **Hover**: title → **rgb(84,84,84)**. The "Read story" row **gap 16 → 20px**, so the arrow slides 4px right. Spring per §0.3.
- Card height 260 @1440.

---------------------------------------------------------------------------------------------------

## 3. Blog post template `/blog/:slug`

Sampled all 12 posts (data in `cms-data.json`). Screenshots: `blog-post-primefold-xi-is-here-*`. Height for that post: 5414 @1440, 5603 @390.

### 3.1 Article container (`section[Article]`)
- `max-width: 840px; padding: 156px 20px 0; margin: 0 auto` → **content column 800px** @1440 (x 320..1120), 770 @810, 350 @390.
- Flex column, align center, **gap 60px** between: Header → Banner → Body. The body is followed directly by the CTA "Main" wrapper.

### 3.2 Header (`div`, flex column, **gap 24**)
1. `h1` title: Stack Sans Headline 400, **48/56 → 44/48 → 32/40**, ls 0.02em (0.96 / 0.88 / 0.64px), color **rgb(26,24,20)**, `blwf cv03 cv04 cv09 cv11 ss04 ss11`. Full column width, wraps.
2. Divider: 1px line, `background: rgb(235,235,235)`, full width.
3. Meta row:
   - ≥810: flex **row**, `align-items:flex-end`, gap 12. Left = author block (flex 1). Right = `time`.
   - <810: flex **column**, align start, **gap 12**. Author first, then time.
   - Author: avatar **36x36** circle + 12px gap + text column. Name Inter 500 rgb(26,24,20) **16/24 (-0.16px) → 14/20 (-0.14px) → 12/16 (-0.12px)**. Role Inter 12/16 400 #666. No-author posts show the placeholder circle only (see §1.3).
   - `time`: `Last updated: <Mon D, YYYY>`, Inter **14/20** 400, ls -0.084px, **#666**, right-aligned on desktop. The date shown is `lastUpdated` in data, which is **not** the card date.
- **No category, tag or read-time is shown anywhere**, and the only date is "Last updated".

### 3.3 Banner (`div[Banner]`)
- Full column width, **aspect-ratio 16/9** (800x450, 770x433, 350x197), `border-radius:16px`, `object-fit:cover`, plus a 1px rgb(235,235,235) overlay border (`::after`, radius 16).
- Source = `banner` in data. **For 4 posts the banner differs from the index card cover** (`bannerSameAsCover:false`): `the-insight-hub-is-about-to-get-sharper`, `primefold-xi-is-here`, `introducing-primefold---saypien-is-becoming-primefold`, `nas-invest-turned-tenant-insight-into-tenant-strength`.

### 3.4 Body: rich-text styles (`div[Content]`, full column width)
Framer spacing model: **every block gets `margin-top` = its preset's paragraph-spacing, and the first block gets 0**. There is no margin-bottom. Body text column max-width = the column (800 / 770 / 350). Headings are wrapped in an in-page anchor `<a href="#<slugified-heading>">`, so give each heading an `id` and wrap its text in that link.

| Element | Font | Size/LH 1440 → 810 → 390 | Weight | Letter-spacing | Color | margin-top |
|---|---|---|---|---|---|---|
| `p` (body) | Inter | **18/24** at all widths | 500 | -0.01em (-0.18px) | rgb(26,24,20) | **20** |
| `strong` | inherit | — | **700** | inherit | inherit | — |
| `em` | Inter italic | inherit | inherit (500 → italic 500) | inherit | inherit | — |
| `a` in p (body link) | inherit | inherit | inherit (500) | inherit | **#594AFF**, no underline → hover **#212121 + underline** | — |
| `h1` (2 posts use it inside the body: `design-and-reports…` repeats the title as its first block, `the-insight-hub…` has 3 empty h1 spacers) | Stack Sans Headline | 56/67.2 → 48/57.6 → 42/50.4 (lh 1.2em) | 400 | 0.02em | #000 (anchor rgb(33,33,33)) | **0** |
| `h2` | Stack Sans Headline | **40/48 → 36/40 → 32/36** | 400 | 0.02em (0.8 / 0.72 / 0.64px) | text #000 but visible anchor **#212121** (hover #545454) | **40 → 40 → 32** |
| `h3` (only in `nobody-asks…shopify.`) | Stack Sans Headline | 32/40 → 28/32 → 26/30 | 400 | 0 | rgb(26,24,20) (anchor #212121) | 20 → 28 → 26 |
| `h4` (only in `introducing-primefold…`) | Stack Sans Headline | 28 → 26 → 24, lh **1.2em** | **700** | 0 | #000 | **28** |
| `h5` (only in `the-insight-hub…`; used as the image caption, text starts with `*`, and once as a bold subheading) | Inter | **18 / lh 1.4em (25.2)** at all widths | **700** | **-0.04em** (-0.72px) | #000 | **40** |
| `ul` / `ol` | — | — | — | — | — | **20** (padding-left 0, `list-style:none`) |
| `li` | as body p (18/24 500) | | | | | 0 (items stack with no gap) |
| `li` marker | `li{position:relative; padding-left:23.24px}` `li::before{position:absolute;left:0;top:0}` with content **`"•"`** (ul) or **`counter(list-item) "."`** (ol). Same font and color as the text. | | | | | |
| `blockquote` (only in `design-and-reports…`) | Inter **italic** | **16 / 1.8em (28.8)** | 400 (bold-italic 700 for `strong`) | 0 | **#999** | **20**, `padding-left:22px; position:relative`, `::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;border-radius:1px;background:rgb(221,221,221)}` |
| `img` (block) | — | full column width, height auto (keep intrinsic ratio; most are 854x532 or 16:9) | | | | **20**, `border:1px solid rgb(235,235,235); border-radius:16px` |
| YouTube embed (`primefold-xi-is-here`) | — | full width, **16:9** (800x450), `border-radius:24px; overflow:hidden` + 1px rgb(235,235,235) inset overlay border (radius 24); thumbnail cover + centered play glyph | | | | 20 |
| In-body button (see §3.6) | — | full column width | | | | 20 |
| empty `p` / `h1` spacer (`type:"spacer"` in data) | one empty line box at that preset's line-height | | | | | its preset's margin |

Not used anywhere in the 12 posts: `figure`/`figcaption` (captions are `h5` text starting with `*`), `code`/`pre`, `h6` (posts), tables. If the Build team needs fallbacks: `code` → Inter-adjacent mono 0.9em on rgb(245,245,241) with radius 4. That fallback is **not measured**; it is only a suggestion.

### 3.5 Content after the body
- **No related-posts section, no share links, no prev/next, no back link, no author bio, no newsletter.** The body ends, then the **REUSE CTA block** (`Ask your data. Get the answer.` + White `Book a call`), then the **REUSE Footer**.

### 3.6 In-body button blocks (Framer components placed inside rich text)
Data `type:"button"` with `variant`:
- **`Black`** (4 posts: `primefold-ri-is-here…` "Book a call", `primefold-xi-speaks-german-now` ×2, `we-rebuilt-our-website…` "Get in touch"): **REUSE Button "Black"** stretched to **full column width** (800x40, label centered). Same ring shadow, glow hover and label style (Inter 16/24 500 rgb(254,250,243)).
- **`primary`** (2 posts: `how-we-built-sunday-s-survey-design-agent` "Design your survey", `nobody-asks…shopify.` "Start 30 days free"): full width x **44px**, `background: rgb(251,249,246)`, **border-radius 10px**, no border/shadow, label centered `"Stack Sans Text"` **16/22.4** 400 color **rgb(16,15,13)**. Hover state: not captured (there is no CSS hover rule in the preset; leave static or use opacity .8).
- External destinations (xi.primefold.ai, Calendly) are kept as labels only in the data. Internal ones carry `href` (`/plans`, `../plans`).

---------------------------------------------------------------------------------------------------

## 4. Case-study template `/case-studies/:slug`

All 3 measured (gainback, nas, dirts) and structurally identical. Screenshots: `case-study-nas-*`. NAS height 6203 @1440.

### 4.1 Container (`section[Case Study Content]`)
- `max-width:1320px; padding:156px 20px 0` → **content width 1280** @1440 (x 80..1360), 770 @810, 350 @390.
- Flex column, align start, **gap 60** between: Header → Banner → Stats → Content (body + About). Then the **REUSE CTA**, then the **REUSE Footer**.

### 4.2 Header (flex column, **gap 24**)
1. **Breadcrumb** (flex row, gap 4, align center): link `Case Studies` → `/case-studies` (Inter 14/20 500, ls -0.084px, **rgb(84,84,84)**, hover **#212121**), `/` (same type, **#666**), client short name (same, #666), for example `NAS`.
2. `h1`: Stack Sans Headline 400 **48/56 → 44/48 → 32/40**, ls 0.02em, rgb(26,24,20). For example `NAS Invest + Primefold XI/RI`.
3. Subtitle `p` (max-width **800**): Inter **18/24** 500, ls -0.18px, rgb(26,24,20).
4. Divider 1px rgb(235,235,235), full width.
5. **Pills** row: `display:flex; flex-wrap:wrap; gap:12px`. Each pill height 36, `padding: 8px 12px` (with icon: `8px 12px 8px 8px`), gap 8, bg **rgb(245,245,241)**, radius 999. Label Inter **14/20** 500, ls -0.084px, rgb(26,24,20). Optional 20x20 icon = `assets/cms/badge-xi.svg` / `badge-ri.svg`. Gainback and DIRTS have 4 and 7 pills (one row at 1440). At 390 they wrap to 2–3 rows.

### 4.3 Banner
Full width, `border-radius:16px`, 1px rgb(235,235,235) overlay border, `object-fit:cover`. **Height follows the image's intrinsic aspect ratio** (not 16:9): NAS 1600x1012 → 1280x810, DIRTS 1299x867 → 1280x854, Gainback 1024x648 → 1280x810. Source = `banner` (equals `cover` for all 3).

### 4.4 Stats (`div[Stats]`, 3 items in data `stats[]`)
- Grid: **3 columns** (416px @1440, 246px @810), **gap 16**. At <810 it becomes **1 column** (350).
- Card: flex column, **gap 16**, **padding 32**, bg **rgb(246,246,246)**, **radius 24**, `box-shadow: 0 0 0 1.6px rgba(0,0,0,.08)`, overflow clip. Height = tallest (184 @1440 NAS, 208 Gainback/DIRTS).
- Value `h2`: Stack Sans Headline 400 **48/56 → 44/48 → 32/40**, ls 0.02em, color per stat (`valueColor`).
- Label `p`: Inter 500 rgb(84,82,78), **16/24 (-0.16px) → 14/20 (-0.14px) → 12/16 (-0.12px)**.

### 4.5 Content wrapper (flex column, **gap 40**): rich-text body, then About
**Body rich text** (full content width 1280 / 770 / 350; spacing model as §3.4: margin-top = own paragraph-spacing):

| Element | Font | 1440 → 810 → 390 | Weight | Color | margin-top |
|---|---|---|---|---|---|
| `h6` section eyebrow (for example `The Challenge`, `The Solution`, `What surprised NAS`) | Inter | **14 / lh 1em (14px)** | 400 | h6 #616161, but the visible text is the anchor link **#212121** (hover #545454) | **14** |
| `h3` section heading | Stack Sans Headline (`ss04 ss11`) | **32/40 → 28/32 → 26/30** | 400 | rgb(26,24,20), anchor #212121 | **20 → 28 → 26** |
| `p` | Inter | 18/24 | 500, ls -0.18px | rgb(26,24,20) | 20 |
| empty `h6` / `p` spacers | one empty line (14px / 24px) | | | | 14 / 20 |
| YouTube embed (NAS, DIRTS) | full width 16:9 (1280x720), `border-radius:24px`, overflow hidden, 1px rgb(235,235,235) inset border overlay | | | | 20 |

**Quote card** (component inside the rich text, `type:"quoteCard"`, 2 per study): flex column, **gap 72**, **padding 48 (≥810) / 24 (<810)**, bg **rgb(246,246,246)**, **radius 25.6px**, `box-shadow: 0 0 0 1.6px rgba(0,0,0,.08)`, overflow clip. margin-top 20.
- Quote `h3`: Stack Sans Headline **weight 300**, **32/40 → 28/32 → 26/30**, ls 0, rgb(26,24,20). The text includes its own opening and closing quote marks (`"…”`).
- Author: column, gap 0. Name Inter **18/24** 500 (-0.18px) rgb(26,24,20). Role Inter **16/24** 400 (-0.16px) rgb(40,38,34) at **opacity .8**.

**Numbered cards** (`type:"numberedCards"`, 3 cards): grid 3 columns, **gap 16**, overflow clip. margin-top 20.
- ≥1200: 3 × 416. **810–1199: Framer bug.** It renders 3 fixed 300px columns inside 770px, centered and clipped, so the outer cards are cut off. Prefer `repeat(3, 1fr)` (≈246px), or replicate the clip if pixel-faithful. <810: 1 column, cards stacked (gap 16).
- Card: flex column, align start, **gap 24**, **padding 32**, bg **rgb(40,38,34)**, **radius 24**, `box-shadow: 0 0 0 1.6px rgba(0,0,0,.08)`. All cards in a row share the tallest height (348 @1440 NAS).
  - Number badge **32x32** circle, centered digit Inter **18/24** 500 (-0.18px). The 3 color schemes, in order:
    1. bg `rgba(32,131,116,.24)`, digit `rgb(63,209,188)`
    2. bg `rgba(202,123,87,.24)`, digit `rgb(249,157,114)`
    3. bg `rgba(255,255,255,.24)`, digit `#fff`
  - Title `p`: Inter **24/32** 500, ls -0.02em (-0.48px), **#fff** (verbatim in data).
  - Body `p`: Inter **14/20** 500, ls -0.084px, **rgb(203,199,192)**.

**About block** (`div[Company Info]`, flex column, **gap 32**):
- `h3` `About <Client>`: Stack Sans Headline **32/40 → 28/32 → 26/30**, 400, rgb(26,24,20).
- Cards row: ≥810 flex row, **gap 24**. <810 stacked column, gap 24. **Both cards height 432** at every breakpoint.
  - **Left image card** (1440: 596 wide, 810: 341; formula `calc((100% - 88px)/2)`; 390: 100%): **radius 16**, padding 32, flex column `justify-content:space-between`, `box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)`, overflow clip.
    - Background image `about.aboutImage` (absolute fill, cover) plus an overlay `linear-gradient(180deg, rgba(26,24,20,.24) 0%, rgb(26,24,20) 100%)`.
    - Top: client logo, **height 40** (NAS 93x40, DIRTS 94x40, Gainback 40x40), object-fit cover.
    - Bottom (max-width 454, gap 32): description `h3` Stack Sans Headline **30/38 → 26/30 → 24/28**, 400, **#fff**. Then **REUSE Button "Transparent (Arrow Icon)"** with label `Visit Website` (127x32, opens the client's external site).
  - **Right "Information" card** (1440: 660, 810: 405; = left + 64px; 390: 100%): **radius 24**, padding 32, flex column, **gap 24**, bg #fff, **1px solid rgb(235,235,235)** border (overlay).
    - Rows (`info[]`): flex row `justify-content:space-between`. Label Inter **18/24** 500 (-0.18px) **rgb(84,82,78)**. Value same type, **rgb(26,24,20)**, right-aligned. Rows are separated by a 1px rgb(235,235,235) line (rows: Employees / Clients or Revenue / Industry).
    - Last row "Products in use": label (Inter 18/24 500, color **#000**) above a pill row (gap 16) of the same pills as §4.2 (with XI/RI badges).

### 4.6 After the content
No related studies, share links or navigation. Then the **REUSE CTA** and **REUSE Footer**.

---------------------------------------------------------------------------------------------------

## 5. Data contract (`specs/cms-data.json`)
- `blog[]` (12, index order = newest first): `slug, url, title, date` (card date), `lastUpdated` (post header), `category:null, tags:[], excerpt:null` (**the original shows no excerpt, category or tags**), `author {name, role, avatar} | null`, `cover` (card), `banner` (post), `bannerSameAsCover`, `bannerIntrinsic`, `metaDescription`, `docTitle`, `h1`, `blocks[]`.
- `caseStudies[]` (3): `slug, url, title, cardCta, client {name, aboutHeading, logo, logoIntrinsic, aboutImage, description (verbatim, ≤2 sentences), websiteButton}, breadcrumb, subtitle, pills[], stats[] (verbatim value/label/valueColor), info[], cover, banner, blocks[]`.
- `blocks[]` types: `p {words, hasBold?, allBold?, hasItalic?, links?[{label, href?|external}], arrowLead?}`, `h1..h4 {text}`, `h5 {role: caption|subheading, text}`, `h6 {role: eyebrow, text}`, `ul/ol {items, words}`, `quote {words}`, `img {src, alt, intrinsic, renderedAt1440}`, `video {label}` (YouTube, external), `button {label, variant, href?|external}`, `spacer {tag}`, `quoteCard {quoteWords, author, role}`, `numberedCards {cards[{n, title, bodyWords}]}`.
- Body prose is **not transcribed**. Generate placeholder text of about `words` words per block. Headings, captions, stats, card titles and names are verbatim.
- `arrowLead:true` means the paragraph starts with `→ ` followed by a link (a pattern in `primefold-xi-is-here`).

## 6. Not measurable / caveats
- External destinations (Calendly, xi.primefold.ai, help.primefold.ai, cal.com, client websites, YouTube) are recorded as labels only, per instructions. YouTube thumbnails (i.ytimg.com) were not downloaded. Use a dark 16:9 placeholder with a centered play glyph, or a `youtube-nocookie` facade if the Build team chooses.
- In-body "primary" button hover state: no hover rule found in its CSS, so it is not captured.
- The no-author placeholder is Framer's default empty-image pattern; the exact hatch SVG was not exported.
- Avatar `U4h1tpH3vCNYO7BOdYlJ9L3BA0.jpg` is a 9.6 MB original, so downscale it.
- Dates are Framer-formatted strings (`MMM D, YYYY`). They are stored as displayed, not as ISO.
