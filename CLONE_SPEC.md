Source: https://primefold.ai/

# Primefold — Home (`/`) clone spec

Measured 2026-10-13 from the live site with an isolated headless Chromium (Playwright 1.63) at **1440x900** (primary), **810x1080** (tablet) and **390x844** (phone), and cross-checked against Framer's own component source (props, variant CSS, transition objects) downloaded from `framerusercontent.com/sites/1C0xbF1SKgnQ0Z1nYjvdiv/*.mjs`. All values are computed styles / bounding rects unless marked "(from source)". Assets: `public/assets/MANIFEST.md`. Reference images: `reference/` (see end).

Page title: `Primefold — All the layers, one intelligence`
Meta description: `One AI-native engine applied to every industry it runs. Surveys, portfolios and company data turned into decisions — Experience, Real Estate and Corporate Intelligence.`
Favicons: `assets/M6DJjtLV2Hcvugi8jnGRQrtj4AQ.png` (light), `assets/6ZajvfY2Qd7ebNvpcE5rKduPAoo.png` (dark), apple-touch `assets/3yxlygKzhxi7QeanjmIbfyH244.png`; og:image `assets/kCEvWj6X9M889dINz1Dophu60Y8.png`.

---------------------------------------------------------------------------------------------------

## 0. Global

### 0.1 Breakpoints (Framer)
| Name | Media query | Framer canvas width |
|---|---|---|
| Desktop | `(min-width: 1200px)` | 1200 (fluid, measured at 1440) |
| Tablet | `(min-width: 810px) and (max-width: 1199.98px)` | 810 |
| Phone | `(max-width: 809.98px)` | 390 |

Tailwind suggestion: `screens: { md: '810px', lg: '1200px' }` (mobile-first).

Total document height: 7834px @1440, 9361px @810 (9541 after all lazy content), 10691px @390.

### 0.2 Containers
- Standard content wrapper: `max-width: 1320px; padding: 0 20px` → 1280px content at ≥1320 viewport (content x = 80..1360 @1440).
- Nav inner: max-width 1320 (transparent state) / 1280 (scrolled state).
- Page background: body `#ffffff`; html body bg token `rgb(250,249,248)` (#FAF9F8) under the Content sheet; most sections `#ffffff` or `#FAF9F8` as noted.

### 0.3 Color tokens (all measured)
| Token | Value | Use |
|---|---|---|
| ink | `rgb(26,24,20)` #1A1814 | dark text, black buttons, CTA bg, card dark panels |
| ink-2 | `rgb(33,33,33)` #212121 | section H2s, trust item titles |
| ink-cta-text | `rgb(33,30,28)` | hero white-CTA text |
| grey-600 | `rgb(84,84,84)` #545454 | body paragraphs, footer links/legal |
| grey-550 | `rgb(84,82,78)` | intelligence card descriptions |
| grey-500 | `rgb(97,97,97)` #616161 | eyebrows + spinner |
| social-icon | `rgb(68,66,62)` | footer social icons (hover → ink) |
| page-alt | `rgb(250,249,248)` #FAF9F8 | Content sheet, How It Works bg, Trust right panel |
| card-tint | `rgba(0,0,0,0.04)` | intelligence card outer frame (desktop) / `rgb(240,239,238)` on tablet/phone |
| divider | `rgb(226,226,226)` | footer dividers + footer ring shadow |
| nav-border | `rgb(235,235,235)` | scrolled nav BG 1px border |
| track | `rgb(237,237,237)` | trust indicator track |
| teal | `rgb(39,168,150)` #27A896 | trust indicator fill, sweep gradient |
| teal-2 | `rgb(63,209,188)` #3FD1BC | A1 loop dots/checks/branches |
| teal-xi | `rgb(32,131,116)` | "Live today ·" |
| orange | `rgb(202,123,87)` #CA7B57 | "Beta · GA H2 2026", sweep gradient |
| orange-2 | `rgb(249,157,114)` #F99D72 | A1 answer dot, window border gradient, glows |
| glow-teal | `#16FFDE` (rgb 22,255,222) | button hover glow |
| purple | `rgb(89,74,255)` | "Planned 2027" |
| dark-window | `rgb(22,21,19)` | A1 window/answer body |
| dark-stage | `rgb(11,11,12)` | A1 stage bg |
| panel-1 | `rgb(40,38,34)` | card mock surfaces |
| panel-2 | `rgb(68,66,62)` / `rgb(53,51,46)` | PDF image area / CI icon circles |
| cream-text | `rgb(254,250,243)` | text on black buttons |
| A1 text | `rgb(240,238,234)` primary, `rgb(203,199,192)` secondary, `rgba(255,255,255,.5)` muted, `rgba(255,255,255,.4)` placeholder |

### 0.4 Fonts (`public/fonts/`)
```css
@font-face{font-family:"Stack Sans Headline";src:url(/fonts/StackSansHeadline-400.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Stack Sans Headline";src:url(/fonts/StackSansHeadline-700.woff2) format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:"ABC Favorit Trial Book";src:url(/fonts/ABCFavoritTrial-Book-350.woff2) format("woff2");font-weight:350;font-display:swap}
/* Inter 400/500/600/700: Inter-<w>-latin.woff2 (latin range) + Inter-<w>-latin-ext.woff2 (latin-ext range) — ranges in public/assets/MANIFEST.md */
```
Fallback stacks exactly as Framer: `"Stack Sans Headline", "Stack Sans Headline Placeholder", sans-serif`; `Inter, "Inter Placeholder", sans-serif`; `"ABC Favorit Trial Book", "ABC Favorit Trial Book Placeholder", sans-serif`. Hero/testimonial titles set `font-feature-settings: 'ss04' on`; outcome digits `'ss11' on`. Spinner glyphs use the UA `monospace` font (computed `monospace`, 16px/20.8px).
Fonts actually loaded on home: Stack Sans Headline 400, ABC Favorit 350, Inter 400/500/600/700. (Fragment Mono, Stack Sans Text are declared by Framer but never used — skip.)

### 0.5 Text styles (computed @1440 → @810 → @390)
| Role | Family | Size/LH (1440) | 810 | 390 | Weight | Letter-spacing | Color |
|---|---|---|---|---|---|---|---|
| Hero title (h1 / div) | Stack Sans Headline | 64/72 | 64/72 | **ABC Favorit 48/56, ls -1.92px (-0.04em), wt 350** | 400 | 1.28px (0.02em) | #fff |
| Hero body | Inter | 18/24 | 18/24 | 18/24 | 400 | 0 | #fff |
| Hero CTA | Inter | 16/22.88 (1.43em) | same | same | 500 | -0.16px | rgb(33,30,28) on white / #fff on glass |
| Hero tab label | Inter | 16/24 | 14/20 | 14/20 | 500 | -0.16px / -0.14px | #fff, active rgb(26,24,20) |
| Nav link / nav button | Inter | 16/24 | – | – | 500 | -0.16px | #fff (top) → rgb(26,24,20) (scrolled); black button text rgb(254,250,243) |
| Eyebrow | Inter | 14/20 | 14/20 | 14/20 | 500 | -0.084px (-0.006em) | rgb(97,97,97) |
| Section H2 | Stack Sans Headline | 48/56 | 44/48 | 32/40 | 400 | 0.02em (0.96 / 0.88 / 0.64px) | rgb(33,33,33) |
| Section lead p | Inter | 14/20 | same | same | 400 | -0.084px | rgb(84,84,84) |
| Testimonial quote (h2) | Stack Sans Headline | 48/56 | 44/48 | **ABC Favorit 32/40 ls -0.64px wt 350** | 400 | 0.96px | #fff |
| Testimonial eyebrow | Inter | 14/20 | same | same | 500 | -0.084px | #fff |
| Testimonial name | Inter | 18/24 | same | same | 500 | -0.18px | #fff |
| Testimonial role | Inter | 16/24 | same | same | 400 | -0.16px | #fff @ opacity .8 |
| Intelligence card head title | Inter | 16/24 | same | same | 500 | -0.16px | rgb(26,24,20) |
| Intelligence card eyebrow | Inter | 14/20 | same | same | 500 | -0.14px | rgba(26,24,20,.56) + colored prefix |
| Intelligence card body title | ABC Favorit | 20/28 | same | same | 350 | -0.2px | rgb(26,24,20) |
| Intelligence card desc | Inter | 14/20 | same | same | 400 | -0.14px | rgb(84,82,78) |
| Solutions card h3 | Stack Sans Headline | 20/28 | same | same | 400 | 0 | #fff |
| Solutions card p | Inter | 14/20 | same | same | 400 | -0.084px | #fff, wrapper opacity .72 |
| Small button label ("Explore RI") | Inter | 12/16 | same | same | 500 | 0 | #fff |
| Trust item title | Inter | 16/24 | same | same | 500 | -0.16px | rgb(33,33,33) |
| Trust item desc | Inter | 14/20 | same | same | 400 | -0.084px | rgb(84,84,84) |
| Outcome digits | ABC Favorit | 80/88 per row | same | same | 350 | -2.4px (-0.03em) | #fff |
| Outcome h3 | Stack Sans Headline | 32/40 | 28/32 | 26/30 | 400 | 0 | #fff |
| Outcome name | Inter | 16/24 | same | same | 500 | -0.16px | #fff |
| Outcome role | Inter | 14/20 | same | same | 400 | -0.084px | #fff @ opacity .5 |
| CTA H2 | Stack Sans Headline | 48/56 | 44/48 | 32/40 | 400 | 0.02em | #fff |
| CTA p | Inter | 14/20 | | | 400 | -0.084px | #fff (two lines, centered) |
| Footer column head | Inter | 16/24 | | | 500 | -0.16px | rgb(33,33,33) |
| Footer link | Inter | 14/~17 line box (20px row) | | | 400 | -0.084px | rgb(84,84,84) → hover rgb(33,33,33) |
| Footer brand text | Inter | 14/20 | | | 400 | | rgb(84,84,84) |
| Footer legal / copyright | Inter | 12/16 | | | 400 | 0 | rgb(84,84,84) → hover rgb(33,33,33) |
| Subscribe | Inter | 13/16 | | | 500 | 0 | #fff on ink |
| A1 demo text | Inter | 12/16 (labels 14/20 500) | 12/16 | 10/12 (source pills) | 400 | 0 | see tokens |
| A1 "3.2 days" (h6) | Stack Sans Headline | 16/19.2 | | | 400 | | rgb(240,238,234) |

### 0.6 Shared components
**Pill button (Framer "Button" component)** — height 40, padding `8px 14px`, radius 999, label Inter 16/24 500 -0.16px. Structure: outer `a` with ring shadow `0 0 0 1px rgba(38,57,90,.16), 0 1px 1px 0 rgba(38,57,91,.1)` → `[Glow]` (absolute, inset ~1px/4px, radius 44, opacity 0, contains `filter: blur(5px)` textured gradient) → `[BG]` (absolute fill, radius 999) → label.
| Variant | BG | Label | Hover |
|---|---|---|---|
| White | #fff | rgb(26,24,20) | Glow opacity 0→.6; BG shadow 2nd layer → `0 5px 5px 0 rgba(38,57,91,.15)` |
| Black | rgb(26,24,20) | rgb(254,250,243) | Glow → .7 |
| Transparent White Text (nav top "Sign in") | rgba(255,255,255,.12) + `backdrop-filter: blur(10px)` | #fff | BG → rgba(255,255,255,.4), Glow → .3 |
| Transparent (nav scrolled "Sign in") | rgba(255,255,255,.12), blur 0 | rgb(26,24,20) | same as above |
| Transparent (Arrow Icon) (Solutions "Explore") | rgba(255,255,255,.2), padding 8/8/8/12, height 32, label 12/16 | #fff + 16px arrow (mask `svg/icon-caret-right-mask.svg`, bg #fff), gap 8 | BG → .4, Glow → .3 |
Hover transition: tween **0.3s linear** (from source `{duration:.3, ease:[0,0,1,1]}`). Glow texture = WebGL shader (teal #16FFDE / orange #F99D72 blobs) with fallback PNGs (`assets/5Ckt2QR4YEmQXqkie4amifMhcg.png` White, `fMC6yM5PTPfly3IfYCBIb5mD8.png` Arrow-icon, etc.). Implement as `background:url(fallback) center/cover; filter:blur(5px)` (or the radial-gradient recipe below).

**Hero CTA glow** (hero component's own CSS, from source): wrapper `::before{left:-2px;right:-2px;top:5px;bottom:-7px;border-radius:44px;background: radial-gradient(35% 95% at 8% 42%,#F99D72 0%,rgba(249,157,114,0) 72%), radial-gradient(35% 95% at 30% 60%,#16FFDE 0%,rgba(22,255,222,0) 72%), radial-gradient(35% 95% at 52% 44%,#F99D72 0%,rgba(249,157,114,0) 72%), radial-gradient(35% 95% at 74% 58%,#16FFDE 0%,rgba(22,255,222,0) 72%), radial-gradient(38% 95% at 96% 46%,#F99D72 0%,rgba(249,157,114,0) 72%), linear-gradient(90deg,#16FFDE,#F99D72,#16FFDE); filter:blur(7px); opacity:0; transition:opacity .3s ease}`; `:hover::before{opacity:1}` (secondary/glass CTA uses `opacity:.3`); the CTA itself `transition: box-shadow .3s ease` → hover `0 0 0 1px rgba(38,57,90,.16), 0 5px 5px 0 rgba(38,57,91,.15)`. Re-use this recipe for all pill-button glows.

**Section eyebrow** — row, gap 4: spinner box 15x20 (glyph 11x21, UA monospace 16px, color rgb(97,97,97)) cycling `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` every **80ms**; then label (Inter 14/20 500). Title stack: eyebrow → 16px → H2 → 16px → lead p.

**Smooth scroll** — Lenis (from source): `new Lenis({ smoothWheel: true, duration: 1.4, anchors: true, autoRaf: true, allowNestedScroll: true, stopInertiaOnNavigate: true })` with Lenis' default easing `t => Math.min(1, 1.001 - Math.pow(2, -10 * t))`. Ignored on touch.

**Stacking** — Hero is a normal-flow 100vh section with a JS parallax (`translateY = 0.6 × scrollY`, i.e. Framer speed 40); the next block **Content** (`z-index:4`, bg #FAF9F8, `border-radius:16px 16px 0 0`, `padding-top:16px`) scrolls over it. Nav is `position:fixed; top:0; left:50%; transform:translateX(-50%); width:100%; z-index:8`.

---------------------------------------------------------------------------------------------------

## 1. Navbar (fixed, two desktop states)

Geometry @1440 (state A, scrollY < 100): wrapper 1440x72; `[Header Content]` max-width 1320, padding `16px 20px`, centered (x 60..1380); inner row 1280x40 `justify-between, align-center`.
- Left: logo `svg/logo-white.svg` 124x24 at (80,24) → link `/`.
- Right group (gap 24): Navigation (gap 12) + buttons (gap 16).
  - Items, each padding `6px 8px`, height 36: **Products ▾** (107w, caret 16x16 = `icon-caret-right-mask.svg` as mask, rotated 90deg; open = rotated -90deg), **Plans** → `/plans`, **Security** → `/security`, **Resources ▾** (119w), **Company ▾** (113w). Item x positions: 607, 726, 796, 887, 1018.
  - Buttons: **Sign in** (79x40, x1155) → `https://xi.primefold.ai`; **Book a call** (111x40, x1249) → `https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold`.
- `[BG]` layer: absolute `top:4px; bottom:4px; left:0; right:0` of Header Content, `background: rgba(255,255,255,.72); backdrop-filter: blur(5px); border:1px solid rgb(235,235,235); border-radius:16px; opacity:0`.

State B "Desktop Blurred BG" (once the `Nav-Trigger` 1x1 marker at hero top:100px leaves the viewport, i.e. scrollY ≥ ~100; reverts when scrolling back up):
- Header Content max-width **1280**, padding **24px 20px** → wrapper height 88; BG inset **top/bottom 8px** → visible bar 1280x72 at (80,8); BG opacity **1**.
- Logo → `svg/logo-dark.svg` (fill rgb(33,33,33)) at (100,32). Nav text → rgb(26,24,20).
- Sign in → "Transparent" (text rgb(26,24,20), bg rgba(255,255,255,.12), no blur). Book a call → "Black" (bg rgb(26,24,20), text rgb(254,250,243)).
- Transition: tween **0.3s, ease [0.44,0,0.56,1]** (all props incl. layout/padding).
- Nav stays visible all the way to the footer (no hide-on-scroll).

Hover: nav link label opacity 1 → **0.7** (tween .3s ease [.44,0,.56,1]); dropdown caret rotates 90° → -90° (spring bounce .2, .4s). Buttons per 0.6.
Dropdown (Products, click/hover): white panel ~240x156 at (607,64), radius ~12, soft shadow; small grey heading "Products" (Inter 12/16, grey) then items Inter 16/24 500 rgb(26,24,20), 38px rows: "Experience Intelligence", "Real Estate Intelligence", "More in 2027". (Visual only — see `reference/states/nav-products-click.png`; Resources/Company menus not captured — see Unresolved.)

Tablet/Phone: variant "Mobile Transparent Collapsed" → bar 100%x80, Header Content padding 24px 20px, BG inset 4px (390x72 @390), logo left + hamburger 32x32 right; links stack hidden (opacity 0) in a column below (expanded variants "Mobile White Expanded" etc. switch with tween **0.2s** ease [.44,0,.56,1]); after scroll → "Mobile White Collapsed" (white bg + 1px bottom border rgb(235,235,235)).

---------------------------------------------------------------------------------------------------

## 2. Hero — autoplay slide carousel (custom code component "Router Marquee Hero")

Section: 100% x **100vh** (900 @1440), bg #000, `overflow:hidden` on inner section. Parallax: whole hero container `translateY(0.6·scrollY)` (measured: scroll 100→60px, 600→360px).

Slides (stacked absolute `inset:0`; active `z-index:2; visibility:visible`, previous `z-index:1` stays visible during the transition, others `visibility:hidden`):
| # | Background (cover) | Title | Body | CTA 1 (white) | CTA 2 (glass) |
|---|---|---|---|---|---|
| 1 | `RAjs2AsxMPYWQK7qgQzwPegjUEI.webp` | `Everything answers.  If you simply ask.` (renders 2 lines: "Everything answers." / "If you simply ask.") | `Type a question, get the work done: the analysis, the report, the next move. One intelligence per field.` | Book a call → calendly | See how it works → `./#see-the-platform` (scrolls to "How It Works" title; `scroll-margin-top:80px`) |
| 2 | `whU1ew3cUmTlwn8jZq7aYOjcWOU.webp` | `Ask your customers, your tenants, your teams. Anyone.` (h1, 3 lines @1440) | `Experience Intelligence, built to find the value in every voice.` | Explore XI → `/experience-intelligence` | Book a call → calendly |
| 3 | `0ludMTRIYsIsZjBXbYoAOYh09IY.webp` | `Ask your portfolio anything.` | `Real Estate Intelligence, built to grow asset value.` | Explore RI → `/realestate-intelligence` | Book a call → calendly |
| 4 | (card only, not a slide) | | | | |

Overlay per slide: `linear-gradient(108deg, rgba(0,0,0,.56) 0%, rgba(0,0,0,0) 98.86%)` (phone: `.6`).
Content block: `padding: 156px 20px 180px` (tablet/phone bottom **200px**), centered column, inner `max-width:1280` then `max-width:650` (left-aligned; x=80 @1440). Title 650x144 (2 lines) → **24px** → body (650x48) → **40px** → CTA row (`display:flex; gap:16px; flex-wrap:wrap`). CTAs: height 43 (padding 10px 14px, radius 999, label 16/22.88 500 -0.16px). White CTA bg #fff text rgb(33,30,28); glass CTA bg rgba(255,255,255,.24) + `backdrop-filter: blur(11.6px)` text #fff. Both have ring shadow `0 0 0 1px rgba(38,57,90,.16), 0 1px 1px rgba(38,57,91,.1)`. Hover glow per 0.6 (white = opacity 1, glass = .3).

Tab cards row (bottom): wrapper `padding: 0 20px 32px`, inner max-width 1280, cards row `gap:16px` at y=766, each card **215x102**, `padding:20px; gap:16px; flex-direction:column; border-radius:8px; backdrop-filter: blur(3.55px)`:
- inactive: bg rgba(255,255,255,.12), `border:1px solid rgba(255,255,255,.16)`, label #fff.
- active: bg #fff, `border:1px solid rgba(255,255,255,.4)`, label rgb(26,24,20); tab-1 icon swaps to active SVG (cross-fade opacity .2s ease).
- Content: icon 20x20 then label (16/24 500, single line, clip).
- Progress bar inside active card: absolute bottom, left/right 1px, height **3px**, track `rgba(26,24,20,.18)`, fill `rgb(26,24,20)`, `transform-origin:left`, animation `scaleX(0)→scaleX(1)` **6s linear forwards** (measured 0.0833/0.5s). On completion → next slide (loop 1→2→3→1). Card 4 "More coming in 2027" (icon `FKdTY48...svg`) is a non-interactive div, same inactive style.
- Clicking a tab jumps to that slide (direction L/R by index).
- Screen-reader text "Autoplay is on. Use the Pause button for a better experience with a screen reader." (visually hidden). No pause button on desktop (`showPlayButton:false`).

Slide transition (from source constants `Xd=300, Zd=1000, Yd=cubic-bezier(0.42,0,0,1), Qd=[60,80,100,120]`):
- Incoming slide panel: `@keyframes slideInR {from{transform:translateX(100%)} to{transform:translateX(0)}}` **300ms cubic-bezier(.42,0,0,1)** (L variant from -100% when going backwards). Outgoing stays beneath (z 1).
- Incoming content blocks (title, body, CTA row, …) each: `translateX(60px | 80px | 100px | 120px) → 0` (index 0,1,2,3+) over **1000ms** same easing, all starting together (measured title at +275px partway — the panel and content offsets compound).
- `prefers-reduced-motion`: no animations.

Phone (390): title ABC Favorit 48/56; content x=20 width 350; body below title; tabs become a horizontally scrolling single row at y=824: chips **44px tall**, `padding:11px 16px; gap:8px` (row direction: icon + label 14/20), active chip scrolled into view (row translateX), above them a right-aligned pair of round buttons 48x48 (`bg rgba(0,0,0,.44); backdrop-filter: blur(12px); border-radius:50%`), gap 8, prev/next. Tablet: tabs row at y=698..868 (wraps), label 14/20.

---------------------------------------------------------------------------------------------------

## 3. Content sheet → "How It Works" (`#see-the-platform`)

Content sheet starts at y=900 @1440: bg #FAF9F8, radius 16 16 0 0, padding-top 16, z-index 4.
How It Works section: bg #FAF9F8, column, children centered. **Scroll-linked offset** (desktop & tablet, disabled on phone): `transform: translate(80px, 80px)` at scrollY=0, interpolating to `translate(0,0)` at scrollY=500 (driven by a hidden 1x500 "Scroll Spacer" at the top of Content; measured 100→64px, 300→32px, 600→0). Framer smooths with spring `stiffness 500, damping 60, mass 1, bounce .2`.

### 3.1 Logo ticker
- Container: max-width 1280, height 120, bg #FAF9F8, `overflow:clip`; track `display:flex; gap:12px` (phone gap 0).
- 10 logos (manifest order: webedia, fischerAppelt, SportScheck, SPORTFIVE, Maggiore Suites, ECE, NAS Real Investments, Vickii, t3n, SirPlus), each **246x120** (`aspect-ratio 2.0583`), phone **164x80**. Images are full SVG wordmarks (grey).
- Ticker: continuous leftward marquee at **50 px/s**, duplicated list for seamless loop, not draggable, no hover slow-down (hover modifier 100%).
- Per-logo appear (scroll in-view, threshold .5, **re-triggers every time**, animateOnce=false): from `opacity:0; translateY(20px)` → `opacity:1; translateY(0)`, tween **0.3s ease [.44,0,.56,1]**, stagger delays **0, .08, .16, .24, .32, .40, .48, .56, .64, .72s** by logo index. Exit goes back to the initial state with the same per-index delay.

### 3.2 "Ask-Read-Decide" title
Block max-width 1320, padding `120px 20px 0` (phone `80px 20px 0`), title stack max-width 548, left aligned.
- Eyebrow: `Ask. Understand. Act.`
- H2: `How a question becomes a next move.` (2 lines @1440, 548 wide)
- Gap title→demo: 56px (phone 32).

### 3.3 A1 Loop demo (dark animated product demo)
Row padding 20 → card **1280x520** @1440 (`max(min(100vw,1320px) − 40px)`; tablet/phone height **500**), `background: rgb(11,11,12); border-radius:16px (phone 12); box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04); overflow:clip`.
Layers (coordinates relative to card, desktop):
- **Stage**: image `6SGxSZ97zxsJhQI7QRmEcVF3QE.jpg` cover 1280x520; **Veil** `radial-gradient(60% 70%, rgba(11,11,12,.7) 0%, rgba(11,11,12,.25) 70%, rgba(11,11,12,0) 100%)`.
- Row inset 24px left/right (1228 wide), three zones: Left 369w, Window 342w, Right 517w.
- **Sources** (x48,y78; column gap 20): 6 pills **180x44**, radius 22, bg rgba(255,255,255,.06), padding `0 14px 0 7px`, gap 10: icon circle 30x30 radius 15 bg `rgba(63,209,188,.16)` with 16px icon; label Inter 14/20 500 rgb(240,238,234) ("Surveys", "Reviews", "Email", "Tickets", "Contracts", "Spreadsheets"); "Read" check badge 16x16 radius 8 bg rgb(63,209,188) with 10px check (opacity 0 until read).
- **Branches**: 6 connector paths from pill right edge (x228) to the window left edge (x393), drawn as bordered boxes (1px teal lines, corner radius 10 — "Branch n A" vertical leg with `border-radius:0 10px 0 0` / `0 0 10px`, "Branch n B" horizontal with `0 0 0 10px` / `10px 0 0`), revealed by animating clip wrappers ("Draw A/B" width/height 0→full); travelling **Dots** 7x7 bg rgb(63,209,188), `box-shadow: 0 0 0 3px rgba(63,209,188,.22)`. Converge on y≈200–320 at x393.
- **Primefold window** (x393,y68) **342x400**, radius 19, padding 1px, `background: linear-gradient(135deg, rgba(249,157,114,.55) 0%, rgba(255,255,255,.08) 38%, rgba(255,255,255,.08) 62%, rgba(63,209,188,.5) 100%)` (gradient border), `box-shadow: 0 24px 60px rgba(0,0,0,.45)`; under it "Sweep fade" with a rotating **Reading sweep** `conic-gradient(from 0deg, rgba(202,123,87,0) 0deg, rgba(202,123,87,0) 220deg, rgb(202,123,87) 280deg, rgb(39,168,150) 330deg, rgba(39,168,150,0) 360deg)` square ~700–965px, rotating 360° every **2.4s linear** (visible only while reading).
  - Inner **Window** 340x398, bg rgb(22,21,19), radius 18, padding 16, column gap 16:
    - Header: logo (84x16, white) "Primefold".
    - Question row (right-aligned bubble 250x50): bg rgba(255,255,255,.07), radius 12, padding `9px 12px`, text 12/16 rgb(240,238,234): `Why are customers cancelling, and what do we fix first?`
    - Working (gap 6): status `Working…` ⇄ `Worked for 4s` (12/16 rgba(255,255,255,.5), cross-fade); Steps box bg rgba(255,255,255,.03) radius 10 padding `8px 10px` gap 7: rows (14px icon, gap 8, 12/16 rgb(203,199,192), trailing 10px chevron): `Reading 6 sources`, `Analyzed 212 responses`, interim finding (12/16 rgb(240,238,234)) `Onboarding is the top complaint, and support replies run late.`, `Checked service agreement`, `Creating 1 chart`.
    - Composer 308x90, radius 12, padding `10px 10px 8px 12px`, gap 10: placeholder `Ask about your data, or describe what you want to achieve…` (12/16 rgba(255,255,255,.4)); actions row: Attach 26x26 radius 7 bg rgba(255,255,255,.07); Send 26x26 radius 7 bg rgba(255,255,255,.35).
- **Out connector**: 157px line from window right edge to the answer, end dot 7x7 bg rgb(249,157,114), `box-shadow 0 0 0 3px rgba(249,157,114,.22)`.
- **Answer** card (x892,y107) **340x371**, radius 18, same gradient border + shadow; body bg rgb(22,21,19) radius 17 padding 15 gap 16:
  - Headline `Slow onboarding drives 41% of cancellations.` (12/16 rgb(240,238,234)).
  - Result card bg rgba(255,255,255,.03) radius 12 padding 14 gap 9: title `Why customers cancel` (14/20 500); 3 bar rows (label 104w 12/16 rgb(203,199,192), value 30w rgba(255,255,255,.5), track 130x8 radius 4 bg rgba(255,255,255,.07) with fill): `Slow onboarding 41%`, `Unanswered tickets 22%`, `Pricing 14%`; Comparison row (padding-top 10, space-between): `First reply time` vs value column `3.2 days` (h6 Stack Sans 16/19.2) + `vs. 24 h in agreement`.
  - Clause preview overlay (292x78, bg rgb(30,29,27), radius 10, `box-shadow 0 -8px 24px rgba(0,0,0,.45)`, padding `10px 12px`): `Service agreement.pdf · p.4` / highlight (bg rgba(202,123,87,0→~.2), radius 4, padding `2px 4px`) `§4.2 Response times: first reply to a customer ticket within 24 hours of receipt.`
  - Sources chips (gap 3, wrap): 22px tall, radius 9, bg rgba(255,255,255,.05), padding `3px 6px 3px 3px`, icon box 16x16 radius 5 bg rgba(255,255,255,.07): `Survey Q3`, `Service agreement §4.2`, `Ticket log`.
  - Next step chip 188x32, radius 10, bg rgba(255,255,255,.05), padding `8px 12px`, icon 14 + `Draft onboarding fix plan`.
  - **Thinking** overlay: centered 64x64 **Orb** (bg rgb(11,11,12), radius 50%, `box-shadow 0 10px 28px rgba(0,0,0,.5)`), containing "Silk" shader (fallback `KjnavIi882AxaQJ0giG8NHlLX58.png`, 100x100), Rim (`inset 0 0 6px rgba(255,255,255,.35), inset 0 -8px 14px rgba(0,0,0,.25)`), Gloss 26x13 bg rgba(255,255,255,.28) radius 50% blur 5px. Orb pulses scale ~1.0–1.06.

**Timeline (from source; loops forever, starts on mount):**
| State | Holds for (ms) before next |
|---|---|
| 01 Rest | 1000 |
| 02 Ask (question bubble + window fade in, sweep starts) | 2600 |
| 03 Sent | 400 |
| 04 Understand (branches draw, sources get checks one by one, steps appear) | 3800 |
| 05 Act (answer card reveals: headline, bars grow, sources, next step) | 7200 |
| 06 Press | 250 |
| 07 Trace (clause preview + highlight) | 5500 |
| 08 Fade | 600 |
| 09 Reset | 150 → 01 |
Total ≈ 21.5 s. Per-element transitions inside states are tweens with ease `[.4,0,.2,1]` 0.15–0.6s (delays 0.05–0.98s), linear `[0,0,1,1]` 0.067–0.42s for line draws, `[.22,1,.36,1]` 0.35s, `[.45,0,.55,1]` 0.5/1.2s, and springs `bounce .15, duration .9, delay .9/1`. Word-by-word text reveal is used for some answer copy. Per-state layer values: **Appendix A**. State screenshots: `reference/states/a1-*.png`. Tablet (T01–T09) and phone (M01–M09) use the same delays (phone Act holds 7300ms) with a compact layout (phone: source pills 10/12 text, card 350x500).

---------------------------------------------------------------------------------------------------

## 4. "One Engine" — intelligence cards

Title block: padding `120px 20px 0` (phone 80), centered, stack max-width 600:
- Eyebrow (centered): `One intelligence. Applied to different fields.`
- H2 centered: `Turn questions into` ⏎ `better decisions.` (explicit `<br>`)
- p centered: `Each intelligence has its own language, its own sources, its own expertise.`
- Gap to cards: 56. Cards block padding-bottom 88.

### 4.1 Desktop (≥1200): 3-card row (Framer "Cards" component)
Row: `display:flex; gap:16px; padding:0 20px; align-items:center`, cards `flex: 1 0 0` → **416x560** each @1440 (x 160, 592, 1024 — row width 1280 inside 1320 container).
Card shell: `a` (cards 1–2 link to `/experience-intelligence`, `/realestate-intelligence`; card 3 is a div), bg **rgba(0,0,0,.04)**, radius **18**, padding **2px**, column.
- Head row 412x56, padding `16px 24px`, gap 8: badge 20x20 (XI/RI/CI svg) + 12px + title (Inter 16/24 500): `Experience Intelligence` / `Real Estate Intelligence` / `Next Intelligence`. Eyebrow absolutely right-aligned (right 24, vertically centered), hidden (`opacity:0; translateY(-10px)`): card1 `Live today · ` (rgb(32,131,116)) + `CX · HR · product` (rgba(26,24,20,.56)); card2 `Beta · GA H2 2026` (rgb(202,123,87)); card3 `Planned 2027` (rgb(89,74,255)). 14/20 500 -0.14px.
- Content 412x500, bg #fff, radius 16, `box-shadow 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)`, overflow clip:
  - Visual 412x376, bg rgb(26,24,20), radius `0 0 16px 16px`, padding `0 14px`, centered:
    - Card1: mock 346x289 (bg rgb(40,38,34), radius 16) = photo `U0tJJ7Y3amMDQd4StUat5cOK8uk.png` 344x169 (radius 12) + text block padding 16 gap 8: `How was your experience with us?` (14/20 500 #fff), `A quick two-minute survey your honest feedback helps us fix what's slow and keep what you love.` (12/16 rgba(255,255,255,.56), 2-line clamp), 5-star graphic 132x20.
    - Card2: photo `0nTcgouZiu10WBq79OBdBOz9v8.webp` 383x312 radius 12 (cover), plus hidden PDF card 227x312 (bg rgb(40,38,34), radius 12, padding 12, gap 12, absolute right 72): image area 203x164 bg rgb(68,66,62) radius 12 with doc icon 20x24 at (12,12) and "PDF" tag (bg rgb(250,250,249), radius 4, 12/16 500 #000) at (12,132); rows (16px icon + 8px + 12/16 500 #fff): `Villa Serena`, `Leased`, `Renews in 5 months`, `Coral Gables · FL`, `Break Option` …… `Flag`.
    - Card3: 3x4 grid (width 160, gap 20, wrap) of 40x40 circles bg rgb(53,51,46), `box-shadow 0 0 0 1px rgba(255,255,255,.18), 0 0 0 2px rgba(0,0,0,.24)`, padding 10, icon 20x20 (`svg/img-variant-1-*.svg`).
  - Text block padding 24, gap 8: title ABC Favorit 20/28 (`Experience Intelligence` / `Real Estate Intelligence` / `More coming in 2027`), desc 14/20 rgb(84,82,78), 2-line clamp: `Turn every survey, review, ticket and message into a prioritized decision your team can act on – in one conversation, on live data.` / `Underwriting, risk, rent rolls and capex, answered in one conversation.`
**Hover (mouseenter on a card; mouseleave restores):** hovered card `flex: 2.7 0 0` → widths **714 / 267 / 267** (Card 1 or 2 hovered). Eyebrow becomes inline (opacity 1, y 0). Card 1 hover additionally fades in a Lottie overlay (`assets/lottie/xNm1ok67qiSXrtlhAImlRlSghE.json`, 696px wide, centered, plays once) showing a "Top Theme · Product Freshness" bar chart card and a "Decision: Expand the rescued-produce category first. From 649 responses" card, and shows a black **Explore** button (Black pill 40h) bottom-right of the text block. Card 2 hover reveals the PDF card beside the photo (photo shifts left). Card 3 hover: grid widens to 429px (icons spread to one row band) — measured widths stayed 416 for card 3 (no grow). Transition: **spring stiffness 210, damping 30, mass 1**. See `reference/states/cards-hover-Card{1,2,3}.png`.

### 4.2 Tablet & phone: sticky stacked cards (different component)
Container `[Mobile]`: column, gap **120px**, padding `0 20px 88px`, width `min(100vw,1320) capped 500 (tablet) / 390 (phone) − 40`. Each card is `position: sticky` with `top: 40px / 60px / 80px` (cards 1/2/3). Card shell bg rgb(240,239,238), radius 18, padding 2; heights 616 / 620 / 496. Scroll-linked scaling when the next card arrives (spring stiffness 500 damping 60): card1 → `scale(.86) translateY(-20px)`, card2 → `scale(.91) translateY(-20px)` (phone `opacity .98, scale .91, y -10`), card3 → `scale(.96)`. Text block padding 16, gap 12, includes black **Explore** button (84x40, label `Explore`, text rgb(254,250,243)) right-aligned. Mobile copy differs:
- XI: `Turn every survey, review, ticket and message into a prioritized decision your team can act on. In one conversation, on live data.`
- RI: `Make sense of underwriting, rent rolls and CapEx. Turn complexity into clarity and get ready for action. Every answer grounded in its source.`
- CI bottom title: `Coming in 2027`.
Each card's inner mock animates on scroll-in (variant appear, threshold 1). The XI animated card uses Lottie `1ZEqVNGcLr5LXnzhYZ2dZA8Wl7I.json`.

---------------------------------------------------------------------------------------------------

## 5. Testimonials carousel

Section: bg #fff, padding `120px 20px 24px` (phone `80px 0 24px`), overflow clip. Slide track: slides 1280x650 (phone 358x600), gap 24 → step **1304px**; neighbours visible off-screen (overflow visible). Active slide expands to `viewport − 48px` (1392 @1440, "spread fullpage, padding 24"), neighbours offset ±56px. No autoplay. Change: **0.5s tween ease [.42,0,0,1]** (measured full 1304px shift in ~500ms); swipe enabled.
Order: (1) Janek Strobel, (2) Ammar Tahirovic, (3) Jakob Hebenstreit, (4) Nicole Bilecki (loops).

Card (`a` → `/experience-intelligence` or `/realestate-intelligence`): radius **24**, `box-shadow 0 0 0 1px rgba(0,0,0,.16)`, padding **64** (phone `40px 20px 24px`), column `justify-between`; background image cover + overlay `rgba(0,0,0,.56)`.
- Upper (max-width 800, gap 24): eyebrow row (XI/RI badge 20 + 8 + label 14/20 500 #fff); quote h2; White pill button (104x40, padding `8px 14px`) `Explore XI` / `Explore RI`.
- Bottom row (space-between, align center): name (18/24 500) + role (16/24, opacity .8); customer logo right, height 56 (see manifest).
| Slide | Image | Eyebrow | Quote | Name / role | Logo |
|---|---|---|---|---|---|
| 1 | `9Yky6fB1AoenMkNm8rzRwLJxM8.jpg` | Experience Intelligence | `"The next bestselling color was never on the list."` | Janek Strobel / Head of Operations | `mlevCnZoqAApeTSZWClq74jYCg.png` 132x56 |
| 2 | `OCJYK6agr32RKk3h6WGSSJgSB0g.jpg` | Real Estate Intelligence | `"If you don't fully know your assets, collecting and analyzing everything about them is a struggle, try Primefold."` | Ammar Tahirovic / Intelligence Analyst | `0I7dW2NSk2zVnHLMvfACsc1BIr8.png` 130x56 |
| 3 | `qkL7CkFhbnE5G6A9rxHv5zbgxz8.jpg` | Experience Intelligence | `"As an early-stage startup, you drown in signals. Primefold XI turned them into decisions."` | Jakob Hebenstreit / Co-Founder | `vBdLAfXU5G3G8FMre5KLbUkCzWc.svg` 56x56 |
| 4 | `07ZMtQS80wekxrvQAxnTtIZWXc.jpeg` | Experience Intelligence | `"With Primefold, we were able to gain completely new insights into our target group, which led to more specific content formats and new sponsorships."` | Nicole Bilecki / Head of Women & Lifestyle | `zBz0VomWfjQ5l9E8sVDczIDkkM.webp` 181x36 |
Controls: arrows 40x40 white circles (`border-radius:999px`, icon 14px chevron stroke 2 color rgb(19,19,19)), absolutely positioned `left:45px` / `right:45px` (phone inset 24), vertically centered (`top:325px` = 50%, `translateY(-20px)`); `:active { scale:.9 }`, `transition: opacity .2s ease, scale .15s ease`. Dots: centered at `bottom:24px`, 8x8 radius 999, gap 8, active #fff, inactive rgba(255,255,255,.35). Hover on card: only the White button reacts (0.6).

---------------------------------------------------------------------------------------------------

## 6. Solutions — "Built for every team." (drag/drift card carousel)

Section bg #fff, padding-bottom 120 (phone 80), gap 56 (phone 32).
Header: max-width 1320, padding `120px 20px 0` (phone 80), row `justify-between, align-end`: title stack (548w) eyebrow `Solutions` + H2 `Built for every team.`; right: two arrow buttons **56x40**, radius 999, bg #fff, ring shadow, 20px chevron stroke 1.6 color rgb(19,19,19), gap 8, disabled opacity .4 (`transition opacity .2s, scale .15s`, `:active scale .9`). Phone: header stacks (column, gap 16).
Track: padding `0 20px`, cards **465x488** (phone 320x364), gap 24, overflow visible, starts at x=80. Scroll-linked entry offset: `translate(120px,120px)` → 0 while the hidden "Scrol 2" spacer (500px tall, top at section top+100) scrolls in (spring stiffness 500, damping 83).
Behaviour (from source, "Card Carousel"): arrow → snap to next multiple of 489px (card+gap), clamped to `maxOffset = 5·465 + 4·24 − containerWidth` (= 1141 @1440); transition **0.5s tween [.42,0,0,1]**. **Scroll drift**: while the carousel is in the viewport, each window scroll delta `d` (clamped ±150) moves the offset by `0.40·d` (scrollSpeed 40), clamped to [0, maxOffset], applied through a spring (stiffness 110, damping 28, mass .6). Swipe (≥50px horizontal) also steps.
Card (`Solutions Card`): radius 12, `box-shadow 0 0 0 1px rgba(0,0,0,.08)`, overflow clip, column `justify-end`; image cover; overlay bottom 319px `linear-gradient(rgba(8,8,8,0) 0%, rgb(9,9,9) 100%)`; content padding 32, gap 16; text gap 8; button "Transparent (Arrow Icon)" (0.6).
| # | Image | h3 | p | Button → |
|---|---|---|---|---|
| 1 | `RIjH19JJ8DvQamX9HDKg7VWbBM.webp` | Asset manager | Talk to your portfolio. Know your exposure, renewals and obligations, down to the clause. | `Explore  RI` (two spaces) → /realestate-intelligence |
| 2 | `gKDbEEFrzbOGZRjHe04RbEaotM.webp` | CX manager | Know why customers leave and how to fix it. | `Explore  XI` → /experience-intelligence |
| 3 | `JGTzpslef9rSgfzJqV3ZOBMFwQ.webp` | HR / People manager | Ask your people. Act while it still matters. | `Explore  XI` |
| 4 | `R6Jj9Z2JPALtAXaI6edzv92aGE.webp` | Marketing manager | Every campaign, survey and review. Read and turned into your next move. | `Explore  XI` |
| 5 | `TxwVY1FIAJFI0frWJNMxfQCJecU.webp` | Product manager | Talk to your users. Know what to build next, ranked by impact. | `Explore  XI` |

---------------------------------------------------------------------------------------------------

## 7. Trust

Section bg #fff; inner max-width 1320, padding `88px 20px` (phone `44px 20px`), `display:flex; flex-wrap:wrap; gap:32px 56px; align-items:center`. Two columns **612x588** each @1440 (tablet 357 each; phone stacked 350 wide).
Left column (`justify-between`, height 588):
- Eyebrow `Trust`; H2 `Trust, built into every layer.`; p (max-width 420) `Your data passes through three layers of protection before you receive a recommendation.`
- Info block at bottom (516x218): row gap 32 = **indicator** (1px wide x 218, track bg rgb(237,237,237), overflow hidden; fill bg rgb(39,168,150) starts as 1px at top and grows to full height over **10s linear** once the Trust eyebrow is fully in view — re-triggers) + list (gap 24, items gap 6):
  1. `Hosted in Germany & GDPR-compliant` — `Your data is stored on servers in Germany, built to GDPR requirements.`
  2. `Answers you can trace, not guess` — `Every answer links back to the source it came from. See the evidence behind the answer, not just the result.`
  3. `Your workspace` — `What the platform learns stays in your workspace.`
Right column "Stop": 612x588, bg #FAF9F8, radius 16 — DotLottie player with `assets/lottie/HY16h57JG9iHUXsmkr9vgGV0A.json`; state "Before Play" (paused at frame 0) → "Play" (autoplay + loop) when the Trust eyebrow is fully in view. (Did not paint in headless capture — see Unresolved.)

---------------------------------------------------------------------------------------------------

## 8. Outcomes

Section bg #fff; inner padding `64px 20px 120px` (phone `44px 20px`). Title (max 550): eyebrow `Outcomes`; H2 `Real impact.` ⏎ `Real outcomes.` (source string has extra spaces; renders as 2 lines); p (max 420) `How teams turn intelligence into action.` Gap 56 (phone 32) to cards.
Grid: 2 rows (`gap:16px` between rows), each row `flex; gap:16px; wrap`: row 1 = 500 + 764, row 2 = 764 + 500 (all **492 tall**). Tablet: 500-wide cards become `flex:1`; phone: all 350x492 stacked.
Card: radius 16, `box-shadow 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)`, padding 40, column `justify-between`, overflow clip; image cover + overlay `linear-gradient(rgba(26,24,20,.24) 0%, rgb(26,24,20) 100%)`.
- Top (gap 32): customer logo (height 40, or 22 for the webp wordmark) then rolling number.
- Bottom (max-width 454, gap 32): h3 + author column (gap 2): name / role (opacity .5).
| Card | Image | Logo | Number | h3 | Name / role |
|---|---|---|---|---|---|
| 1 (500w) | `vukJGGeDQ72ugU8BMCw9S7b0NI8.png` | DIRTS png 94x40 | `5x` | More units sold with data-driven color selection. | Janek Strobel / Head of Operations, DIRTS |
| 2 (764w) | `2YKiPQOWTotKpViisGGHGQbghrM.jpeg` | Gainback svg 40x40 | `150 customers` | Seven touchpoints, one picture of the market . This clarity got us from zero to 150 customers. | Jakob Hebenstreit / Co-Founder, Gainback |
| 3 (764w) | `OCJYK6agr32RKk3h6WGSSJgSB0g.jpg` | NAS png 93x40 | `1 hour` | To read a 300-page commercial lease, against 2-3 days it takes by hand. | Ammar Tahirovic / Intelligence Analyst, NAS Invest |
| 4 (500w) | `NS0Wgwn5twaEyiw0qOiX49499Y.jpg` | webp 111x22 | `1 market` | Identified one new target market, defined adapted content formats and acquired new sponsors. | Nicole Bilecki / Head of Women & Lifestyle |
**Digit roll** (custom code component, from source): each character is a column (`overflow:hidden; height:88px`, gap 0.05em, spaces 0.25em wide) containing the same character **4×** stacked (88px each). On first in-view (once, +100ms): column translateY **0 → −264px** over **0.5s ease [.25,.46,.45,.94]**, per-character delay **0.1s × index**, while each glyph runs `filter: blur(0) → blur(2px) → blur(2px) → blur(0)` at times [0,.2,.8,1] (easeOut). Clicking restarts. Measured: all columns settle within ~0.9s for "5x".

---------------------------------------------------------------------------------------------------

## 9. CTA ("Main" wrapper, outside Content)

Wrapper bg #fff, padding `24px 20px`. Card **1280x388** @1440 (tablet 770x372, phone 350x356): bg rgb(26,24,20), radius **24**, `box-shadow 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)`, padding `82px 20px`, overflow clip. Background: animated WebGL "wave" shader (colors black, black, rgb(39,168,150), rgb(202,123,87); waveSpeed .55, angle 105°, amplitude 2.1, seed 32) — implement with fallback `assets/5V8gmDlH6VshGL3t6Yw2BakE8M.png` (cover, optionally slow drift) — see reference frame `reference/frames-1440/f08.png`.
Content centered, gap 20; text gap 12, max-width 620:
- H2 `Ask your data. Get the answer.` (2 lines @1440, centered, #fff)
- p (372w, centered, #fff) `Bring a real business question.` ⏎ `Get the answer you need to move forward.`
- White pill `Book a call` (111x40) → calendly.

---------------------------------------------------------------------------------------------------

## 10. Footer (Desktop / Tablet / Phone variants)

`footer` column, overflow clip, height 612 @1440 (Footer Content 412 + Ghost Wordmark 200).
**Footer Content** (z-index 1 over the wordmark): bg #fff, radius `0 0 24px 24px`, `box-shadow 0 0 0 1px rgb(226,226,226)`, padding `64px 20px 0`; body max-width 1280.
- Columns row: `flex; wrap; gap:64px; padding-bottom:64px`.
  - Brand (320w, gap 20): logo dark 116x22 → `/`; text (14/20 rgb(84,84,84), 2 paragraphs) `One intelligence. Built for every field.` / `Stay in the loop. Update on what's new.`; Newsletter form 320x48: bg #fff, radius 999 (ring border), padding `6px 6px 6px 16px`, gap 8; input placeholder `you@company.com` (Inter 14, grey); Subscribe button 100x36, bg rgb(26,24,20), radius 999, padding `8px 16px`, label 13/16 500 #fff.
  - Link columns container: `flex:1; justify-end; gap:40px 64px; wrap`; each column gap 16 (head 16/24 500 rgb(33,33,33)), links gap 12 (14px rgb(84,84,84), hover rgb(33,33,33)):
    - **Products**: Experience Intelligence (/experience-intelligence), Real Estate Intelligence (/realestate-intelligence)
    - **Explore**: How it works (/), Plans (/plans), Security (/security)
    - **Resources**: Blog (/blog), Help Center XI (https://help.primefold.ai/xi), Help Center RI (https://help.primefold.ai/ri)
    - **Company**: About (/company), Careers (/careers), Contact (/contact)
    - x positions @1440: 763, 979, 1128, 1287.
- Divider 1px rgb(226,226,226).
- Legal & Social row (padding 20px 0, space-between): `© 2026 saypien GmbH · Berlin & Frankfurt` (12/16); right group gap 24: legal links gap 16 — Imprint (/imprint), Data privacy (/data-privacy), Terms of service (/terms-of-service), Cookie Settings (opens consent dialog) — then socials gap 16: X (https://x.com/primefoldai), LinkedIn (https://www.linkedin.com/company/primefold/), Mail (/contact): 16x16 masks bg rgb(68,66,62) → hover rgb(26,24,20).
- Divider.
- Bottom row (padding `16px 0 24px`): German flag 20x15 + 12px + `Hosted in Germany · Built to GDPR requirements` (12/16 rgb(84,84,84)).
**Ghost Wordmark**: `position: sticky; bottom: 0; height: 200px` (tablet 140, phone 64), padding `32px 20px 0` (phone 24), image `assets/L5IVS7Cn2X7mzYJB2j1MVEECRKk.svg` width `min(100vw − 40px, 1280px)` (1280x218 → clipped to 168 visible), fill #1A1814. It sits under the Footer Content and is revealed as the page bottoms out. Opacity scroll-linked **0.2 → 1** as the 200px "Footer Trigger" marker at the end of Content scrolls into view.
Phone: columns stack (gap 64 → brand; link columns column gap 40); legal links stack (column, gap 24) above copyright; tablet link columns use `grid-template-columns: repeat(auto-fill, minmax(120px,1fr))` (2x161px cols, gap 40/64).

---------------------------------------------------------------------------------------------------

## 11. Cookie consent (third-party custom component — optional)
Fixed bottom-right card 520 max-width at (904,687) @1440: bg #fff, `border:1px solid rgb(229,229,229)`, radius 16, `box-shadow 0 4px 24px rgba(0,0,0,.12)`, padding 24, z-index 999999, font `Inter, system-ui, sans-serif`. Heading `We value your privacy` (18 700 rgb(17,17,17)); text 14/21 rgb(102,102,102) `We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking Accept All, you consent to our use of cookies.` + link `Read our Privacy Policy` (/data-privacy, rgb(17,17,17)); buttons (radius 8, padding `10px 20px`, 14/600): Customize, Reject All (transparent, 1px rgb(229,229,229)), Accept All (bg rgb(17,17,17), #fff). Stored in localStorage; reopened via "Cookie Settings".

---------------------------------------------------------------------------------------------------

## 12. Motion inventory (summary)
| # | Element | Trigger | Animation | Timing |
|---|---|---|---|---|
| 1 | Lenis smooth scroll | wheel | inertial scroll | duration 1.4s, expo-out easing |
| 2 | Nav state | scroll past y≈100 (Nav-Trigger) | transparent→blurred white bar, padding 16→24, BG inset 4→8, colors/logo swap | tween .3s [.44,0,.56,1] |
| 3 | Nav link hover | hover | label opacity →.7 | tween .3s [.44,0,.56,1] |
| 4 | Hero parallax | scroll | translateY = .6·scrollY | continuous |
| 5 | Hero autoplay | timer | progress bar scaleX 0→1 | 6s linear, then advance |
| 6 | Hero slide change | autoplay/tab click | panel translateX(100%)→0; content blocks translateX(60/80/100/120px)→0 | 300ms / 1000ms cubic-bezier(.42,0,0,1) |
| 7 | Pill buttons hover | hover | glow opacity, BG/shadow change | .3s linear (hero CTAs .3s ease) |
| 8 | Content sheet / How It Works | scroll 0→500 | translate(80,80)→(0,0) | spring k500 c60 |
| 9 | Logo ticker | always | marquee left | 50 px/s |
| 10 | Logo appear | in view (50%), repeats | opacity 0→1, y 20→0 | .3s [.44,0,.56,1], stagger .08s |
| 11 | Section eyebrow spinners | always | braille frames ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏ | 80ms/frame |
| 12 | A1 Loop | mount, loops | 9-state demo (Appendix A) | ≈21.5s cycle |
| 13 | A1 reading sweep | during reading | conic gradient rotate 360° | 2.4s linear |
| 14 | Intelligence cards hover | mouseenter | flex 1→2.7, eyebrow fade/slide, Lottie overlay (card 1) | spring k210 c30 m1 |
| 15 | Mobile intelligence stack | scroll | sticky cards scale .86/.91/.96, y −20 | spring k500 c60 |
| 16 | Testimonial carousel | arrow/dot/swipe | translateX by 1304px | .5s [.42,0,0,1] |
| 17 | Solutions entry | scroll ("Scrol 2") | translate(120,120)→0 | spring k500 c83 |
| 18 | Solutions drift | scroll while visible | x offset += .4·Δscroll | spring k110 c28 m.6 |
| 19 | Solutions arrows | click | snap ±489px | .5s [.42,0,0,1] |
| 20 | Trust indicator | eyebrow fully in view (repeats) | fill 1px→full height | 10s linear |
| 21 | Trust Lottie | same trigger | play + loop | Lottie native |
| 22 | Outcome digits | first in view | column y 0→−264, blur 0→2→2→0 | .5s [.25,.46,.45,.94], +.1s/char |
| 23 | CTA background | always | WebGL wave (use fallback PNG) | — |
| 24 | Footer wordmark | scroll (Footer Trigger) | opacity .2→1, sticky reveal | scroll-linked |
| 25 | Footer link/social hover | hover | color → rgb(33,33,33) / icon → ink | instant-ish (~.2s) |
No `<video>` elements on the page. No CSS @keyframes besides the hero/spinner ones above.

---------------------------------------------------------------------------------------------------

## 13. Reference captures (`/Users/riyaghosh/V3/primefold/reference/`)
- `primefold-1440-fullpage.png`, `primefold-810-fullpage.png`, `primefold-390-fullpage.png` — Playwright fullPage at scrollY 0 after a full scroll-through (note: scroll-linked offsets are at their scrollY=0 values, e.g. How It Works shifted +80/+80, Solutions +120/+120).
- `primefold-{1440,810,390}-stitched.png` + `frames-{w}/fNN.png` — viewport frames captured while scrolled (what a user sees; fixed nav repeats; last frame overlaps the previous one because scroll clamps at the bottom).
- `states/` — `a1-NN-<state>.png` (A1 loop states), `cards-rest.png`, `cards-hover-Card{1,2,3}.png`, `nav-products-hover.png`, `nav-products-click.png`, `nav-scrolled.png`, `testimonial-1.png`, `testimonial-2.png`, `trust-*.png`, `outcomes.png`.

## 14. Unresolved / not measurable
1. **Trust Lottie** (`HY16h57JG9iHUXsmkr9vgGV0A.json`) and **Card-1 hover Lottie** are played by DotLottie (wasm from cdn.jsdelivr.net); the Trust panel painted empty in headless Chromium, so its visual is unverified — render the downloaded JSON with `lottie-web`/`@lottiefiles/dotlottie-react`.
2. **WebGL shaders** (CTA wave, button glows, A1 "Silk" orb) are canvas-rendered; only their fallback PNGs and uniform values are available. Exact animated look cannot be replicated pixel-for-pixel without porting the shader (source is in `QuoteCarousel.DYSbGkpW.mjs` / `script_main.C_y12exf.mjs`, not copied).
3. **Resources / Company dropdown** contents were not opened; only Products dropdown captured visually (no computed styles for the dropdown panel).
4. A1 Loop per-element transitions are only summarized; Appendix A values were sampled ~0.1–1.3s after each state change, so some are mid-transition.
5. Exact hover transition durations for footer text links were not read from source (end states measured).
6. Tablet/phone hero/menu expanded states (hamburger open) not captured.

---------------------------------------------------------------------------------------------------

## Appendix A — A1 Loop per-state layer values (@1440)
Format: `Parent>Layer : x y w h opacity transform filter bg` relative to the A1 card's top-left (card at page x160). First block = full "01 Rest" baseline; following blocks list only layers that changed (`before => after`).

```
BASE 01 Rest
  Stage = 0 0 1280 520 1
  Stage>Veil = 0 0 1280 520 1
  Stage>Row = 24 0 1228 520 1
  Row>Left zone = 24 0 369 520 1
  Left zone>Sources = 48 78 180 364 1
  Sources>Source 1 = 48 78 180 44 1   rgba(255, 255, 255, 0.06)
  Source 1>Icon = 55 85 30 30 1   rgba(255, 255, 255, 0.07)
  Source 1>Read = 198 92 16 16 0   rgb(63, 209, 188)
  Sources>Source 2 = 48 142 180 44 1   rgba(255, 255, 255, 0.06)
  Source 2>Icon = 55 149 30 30 1   rgba(255, 255, 255, 0.07)
  Source 2>Read = 198 156 16 16 0   rgb(63, 209, 188)
  Sources>Source 3 = 48 206 180 44 1   rgba(255, 255, 255, 0.06)
  Source 3>Icon = 55 213 30 30 1   rgba(255, 255, 255, 0.07)
  Source 3>Read = 198 220 16 16 0   rgb(63, 209, 188)
  Sources>Source 4 = 48 270 180 44 1   rgba(255, 255, 255, 0.06)
  Source 4>Icon = 55 277 30 30 1   rgba(255, 255, 255, 0.07)
  Source 4>Read = 198 284 16 16 0   rgb(63, 209, 188)
  Sources>Source 5 = 48 334 180 44 1   rgba(255, 255, 255, 0.06)
  Source 5>Icon = 55 341 30 30 1   rgba(255, 255, 255, 0.07)
  Source 5>Read = 198 348 16 16 0   rgb(63, 209, 188)
  Sources>Source 6 = 48 398 180 44 1   rgba(255, 255, 255, 0.06)
  Source 6>Icon = 55 405 30 30 1   rgba(255, 255, 255, 0.07)
  Source 6>Read = 198 412 16 16 0   rgb(63, 209, 188)
  Left zone>Branch 1 A = 228 100 68 90 1
  Left zone>Branch 1 B = 295 190 98 10 1
  Left zone>Connected 1 = 24 0 369 520 1
  Connected 1>Draw A = 228 99 0 91 1
  Draw A>Draw A height = 228 99 68 3 1
  Draw A height>Branch 1 A = 228 100 68 90 1
  Connected 1>Draw B span = 295 190 98 11 1
  Draw B span>Draw B = 295 190 0 11 1
  Draw B>Branch 1 B = 295 190 0 10 1
  Left zone>Drop 1 = 228 100 1 1 1
  Drop 1>Leg 1 = 228 100 1 1 1
  Leg 1>Leg 2 = 228 100 1 1 1
  Leg 2>Leg 3 = 228 100 1 1 1
  Leg 3>Dot = 225 97 7 7 0   rgb(63, 209, 188)
  Left zone>Drop 1 last leg = 296 200 97 1 1
  Drop 1 last leg>Grow = 296 200 1 1 1
  Grow>Dot = 293 197 7 7 0   rgb(63, 209, 188)
  Left zone>Branch 2 A = 228 164 56 50 1
  Left zone>Branch 2 B = 283 214 110 10 1
  Left zone>Connected 2 = 24 0 369 520 1
  Connected 2>Draw A = 228 163 0 51 1
  Draw A>Draw A height#2 = 228 163 56 3 1
  Draw A height>Branch 2 A = 228 164 56 50 1
  Connected 2>Draw B span = 283 214 110 11 1
  Draw B span>Draw B#2 = 283 214 0 11 1
  Draw B>Branch 2 B = 283 214 0 10 1
  Left zone>Drop 2 = 228 164 1 1 1
  Drop 2>Leg 1 = 228 164 1 1 1
  Leg 1>Leg 2#2 = 228 164 1 1 1
  Leg 2>Leg 3#2 = 228 164 1 1 1
  Leg 3>Dot#2 = 225 161 7 7 0   rgb(63, 209, 188)
  Left zone>Drop 2 last leg = 284 224 109 1 1
  Drop 2 last leg>Grow = 284 224 1 1 1
  Grow>Dot#2 = 281 221 7 7 0   rgb(63, 209, 188)
  Left zone>Branch 3 A = 228 228 44 10 1
  Left zone>Branch 3 B = 271 238 122 10 1
  Left zone>Connected 3 = 24 0 369 520 1
  Connected 3>Draw A = 228 227 0 11 1
  Draw A>Draw A height#3 = 228 227 44 3 1
  Draw A height>Branch 3 A = 228 228 44 10 1
  Connected 3>Draw B span = 271 238 122 11 1
  Draw B span>Draw B#3 = 271 238 0 11 1
  Draw B>Branch 3 B = 271 238 0 10 1
  Left zone>Drop 3 = 228 228 1 1 1
  Drop 3>Leg 1 = 228 228 1 1 1
  Leg 1>Leg 2#3 = 228 228 1 1 1
  Leg 2>Leg 3#3 = 228 228 1 1 1
  Leg 3>Dot#3 = 225 225 7 7 0   rgb(63, 209, 188)
  Left zone>Drop 3 last leg = 272 248 121 1 1
  Drop 3 last leg>Grow = 272 248 1 1 1
  Grow>Dot#3 = 269 245 7 7 0   rgb(63, 209, 188)
  Left zone>Branch 4 A = 228 282 44 12 1
  Left zone>Branch 4 B = 271 272 122 10 1
  Left zone>Connected 4 = 24 0 369 520 1
  Connected 4>Draw A = 228 281 0 12 1
  Draw A>Draw A height#4 = 228 290 44 3 1
  Draw A height>Branch 4 A = 228 281 44 12 1
  Connected 4>Draw B span = 271 272 122 11 1
  Draw B span>Draw B#4 = 271 272 0 11 1
  Draw B>Branch 4 B = 271 272 0 10 1
  Left zone>Drop 4 = 228 292 1 1 1
  Drop 4>Leg 1 = 228 292 1 1 1
  Leg 1>Leg 2#4 = 228 292 1 1 1
  Leg 2>Leg 3#4 = 228 292 1 1 1
  Leg 3>Dot#4 = 225 289 7 7 0   rgb(63, 209, 188)
  Left zone>Drop 4 last leg = 272 272 121 1 1
  Drop 4 last leg>Grow = 272 272 1 1 1
  Grow>Dot#4 = 269 269 7 7 0   rgb(63, 209, 188)
  Left zone>Branch 5 A = 228 306 56 52 1
  Left zone>Branch 5 B = 283 296 110 10 1
  Left zone>Connected 5 = 24 0 369 520 1
  Connected 5>Draw A = 228 305 0 52 1
  Draw A>Draw A height#5 = 228 354 56 3 1
  Draw A height>Branch 5 A = 228 305 56 52 1
  Connected 5>Draw B span = 283 296 110 11 1
  Draw B span>Draw B#5 = 283 296 0 11 1
  Draw B>Branch 5 B = 283 296 0 10 1
  Left zone>Drop 5 = 228 356 1 1 1
  Drop 5>Leg 1 = 228 356 1 1 1
  Leg 1>Leg 2#5 = 228 356 1 1 1
  Leg 2>Leg 3#5 = 228 356 1 1 1
  Leg 3>Dot#5 = 225 353 7 7 0   rgb(63, 209, 188)
  Left zone>Drop 5 last leg = 284 296 109 1 1
  Drop 5 last leg>Grow = 284 296 1 1 1
  Grow>Dot#5 = 281 293 7 7 0   rgb(63, 209, 188)
  Left zone>Branch 6 A = 228 330 68 92 1
  Left zone>Branch 6 B = 295 320 98 10 1
  Left zone>Connected 6 = 24 0 369 520 1
  Connected 6>Draw A = 228 329 0 92 1
  Draw A>Draw A height#6 = 228 418 68 3 1
  Draw A height>Branch 6 A = 228 329 68 92 1
  Connected 6>Draw B span = 295 320 98 11 1
  Draw B span>Draw B#6 = 295 320 0 11 1
  Draw B>Branch 6 B = 295 320 0 10 1
  Left zone>Drop 6 = 228 420 1 1 1
  Drop 6>Leg 1 = 228 420 1 1 1
  Leg 1>Leg 2#6 = 228 420 1 1 1
  Leg 2>Leg 3#6 = 228 420 1 1 1
  Leg 3>Dot#6 = 225 417 7 7 0   rgb(63, 209, 188)
  Left zone>Drop 6 last leg = 296 320 97 1 1
  Drop 6 last leg>Grow = 296 320 1 1 1
  Grow>Dot#6 = 293 317 7 7 0   rgb(63, 209, 188)
  Row>Window zone = 393 0 342 520 1
  Window zone>Primefold window = 393 68 342 400 1
  Primefold window>Sweep fade = 393 68 342 400 0
  Sweep fade>Reading sweep = 81 -244 965 965 1 matrix(-0.847122, -0.531399, 0.531399, -0.847122, 0, 0)
  Primefold window>Window = 394 69 340 398 1   rgb(22, 21, 19)
  Window>Header = 410 85 308 16 1
  Window>Question row = 410 117 308 50 0
  Question row>Question = 468 117 250 50 1   rgba(255, 255, 255, 0.07)
  Window>Working = 410 183 308 162 0
  Working>Status = 410 183 308 16 1
  Working>Steps = 410 205 308 140 1   rgba(255, 255, 255, 0.03)
  Steps>Step row1 = 420 213 288 16 0
  Steps>Step row2 = 420 236 288 16 0
  Steps>Interim finding = 420 259 288 32 0
  Steps>Step row3 = 420 298 288 16 0
  Steps>Step row4 = 420 321 288 16 0
  Window>Composer = 410 361 308 90 1
  Composer>Input = 422 371 286 36 1
  Composer>Actions = 422 417 286 26 1
  Actions>Attach = 422 417 26 26 1   rgba(255, 255, 255, 0.07)
  Actions>Send = 682 417 26 26 1   rgba(255, 255, 255, 0.35)
  Row>Right zone = 735 0 517 520 1
  Right zone>Out span = 735 258 157 4 1
  Out span>Out branch = 735 259 157 2 0
  Out span>Draw out = 735 258 0 4 1
  Draw out>Out connected = 735 259 0 2 1
  Out span>Grow = 735 260 1 1 1
  Grow>Dot#7 = 732 257 7 7 0   rgb(249, 157, 114)
  Right zone>Answer = 895 111 333 364 0 matrix(0.98, 0, 0, 0.98, 0, 0)
  Answer>Sweep fade = 895 111 333 364 0
  Sweep fade>Reading sweep#2 = 454 -301 1216 1216 1 matrix(-0.847122, -0.531399, 0.531399, -0.847122, 0, 0)
  Answer>Answer body = 896 112 331 362 1   rgb(22, 21, 19)
  Answer body>Result card = 911 158 302 192 0   rgba(255, 255, 255, 0.03)
  Result card>Bar 1 = 925 200 274 16 1
  Bar 1>Track = 1072 204 127 8 1   rgba(255, 255, 255, 0.07)
  Track>Value = 1072 204 0 8 1   rgb(63, 209, 188)
  Result card>Bar 2 = 925 224 274 31 1
  Bar 2>Track = 1072 236 127 8 1   rgba(255, 255, 255, 0.07)
  Track>Value#2 = 1072 236 0 8 1   rgb(63, 209, 188)
  Result card>Bar 3 = 925 265 274 16 1
  Bar 3>Track = 1072 268 127 8 1   rgba(255, 255, 255, 0.07)
  Track>Value#3 = 1072 268 0 8 1   rgb(63, 209, 188)
  Result card>Comparison = 925 289 274 47 1
  Comparison>Value = 1078 299 121 37 1
  Result card>Clause preview = 919 281 286 76 0   rgb(30, 29, 27)
  Clause preview>Highlight = 931 313 263 35 1   rgba(202, 123, 87, 0)
  Answer body>Sources = 911 366 302 46 0
  Sources>Source 1#2 = 911 366 86 22 1   rgba(255, 255, 255, 0.05)
  Source 1>Icon#2 = 914 369 16 16 1   rgba(255, 255, 255, 0.07)
  Sources>Source 2#2 = 1000 366 161 22 1   rgba(255, 255, 255, 0.05)
  Source 2>Icon#2 = 1003 369 16 16 1   rgba(255, 255, 255, 0.07)
  Sources>Source 3#2 = 911 390 82 22 1   rgba(255, 255, 255, 0.05)
  Source 3>Icon#2 = 914 393 16 16 1   rgba(255, 255, 255, 0.07)
  Answer body>Next step = 911 427 184 31 0   rgba(255, 255, 255, 0.05)
  Answer body>Thinking = 896 112 331 362 1  blur(0px)
  Thinking>Bloom = 1046 277 31 31 0 matrix(0.5, 0, 0, 0.5, 0, 0) blur(10px)
  Bloom>Orb = 1045 276 33 33 1 matrix(1.05971, 0, 0, 1.05971, 0, 0)  rgb(11, 11, 12)
  Orb>Silk = 1036 267 52 52 1
  Orb>Rim = 1045 276 33 33 1
  Orb>Gloss = 1052 279 14 7 1  blur(5px) rgba(255, 255, 255, 0.28)
STATE 02 Ask
   Primefold window>Sweep fade : 393 68 342 400 0    => 393 68 342 400 0.742061
   Sweep fade>Reading sweep : 81 -244 965 965 1 matrix(-0.847122, -0.531399, 0.531399, -0.847122, 0, 0)   => 155 -170 816 816 1 matrix(-0.983255, -0.182236, 0.182236, -0.983255, 0, 0)
   Window>Question row : 410 117 308 50 0    => 410 117 308 50 0.905638
   Window>Working : 410 183 308 162 0    => 410 183 308 162 0.5963
   Sweep fade>Reading sweep#2 : 454 -301 1216 1216 1 matrix(-0.847122, -0.531399, 0.531399, -0.847122, 0, 0)   => 549 -206 1026 1026 1 matrix(-0.983729, -0.179661, 0.179661, -0.983729, 0, 0)
   Answer body>Thinking : 896 112 331 362 1  blur(0px)  => 896 112 331 362 1
STATE 03 Sent
   Primefold window>Sweep fade : 393 68 342 400 0.742061    => 393 68 342 400 0.706669
   Sweep fade>Reading sweep : 155 -170 816 816 1 matrix(-0.983255, -0.182236, 0.182236, -0.983255, 0, 0)   => 144 -181 839 839 1 matrix(-0.974761, 0.22325, -0.22325, -0.974761, 0, 0)
   Window>Question row : 410 117 308 50 0.905638    => 410 117 308 50 0.889633
   Window>Working : 410 183 308 162 0.5963    => 410 183 308 162 0.543973
   Sweep fade>Reading sweep#2 : 549 -206 1026 1026 1 matrix(-0.983729, -0.179661, 0.179661, -0.983729, 0, 0)   => 534 -222 1057 1057 1 matrix(-0.974761, 0.22325, -0.22325, -0.974761, 0, 0)
   Answer body>Thinking : 896 112 331 362 1    => 896 112 331 362 1  blur(0px)
   Bloom>Orb : 1045 276 33 33 1 matrix(1.05971, 0, 0, 1.05971, 0, 0)  rgb(11, 11, 12) => 1045 276 33 33 1 matrix(1.05567, 0, 0, 1.05567, 0, 0)  rgb(11, 11, 12)
   Orb>Gloss : 1052 279 14 7 1  blur(5px) rgba(255, 255, 255, 0.28) => 1052 279 13 7 1  blur(5px) rgba(255, 255, 255, 0.28)
STATE 04 Understand
   Source 1>Icon : 55 85 30 30 1   rgba(255, 255, 255, 0.07) => 55 85 30 30 1   rgba(242, 251, 249, 0.08)
   Source 1>Read : 198 92 16 16 0   rgb(63, 209, 188) => 198 92 16 16 0.0096554   rgb(63, 209, 188)
   Connected 1>Draw A : 228 99 0 91 1    => 228 99 68 91 1
   Draw A>Draw A height : 228 99 68 3 1    => 228 99 68 91 1
   Draw B span>Draw B : 295 190 0 11 1    => 295 190 98 11 1
   Draw B>Branch 1 B : 295 190 0 10 1    => 295 190 98 10 1
   Drop 1>Leg 1 : 228 100 1 1 1    => 296 100 1 1 1
   Leg 1>Leg 2 : 228 100 1 1 1    => 296 200 1 1 1
   Leg 2>Leg 3 : 228 100 1 1 1    => 296 200 1 1 0
   Leg 3>Dot : 225 97 7 7 0   rgb(63, 209, 188) => 293 197 7 7 1   rgb(63, 209, 188)
   Drop 1 last leg>Grow : 296 200 1 1 1    => 393 200 1 1 1
   Grow>Dot : 293 197 7 7 0   rgb(63, 209, 188) => 390 197 7 7 1   rgb(63, 209, 188)
   Connected 2>Draw A : 228 163 0 51 1    => 228 163 31 51 1 matrix(0.55794, 0, 0, 1, -12.3777, 0)
   Draw A>Draw A height#2 : 228 163 56 3 1    => 228 163 56 3 1 matrix(1.79231, 0, 0, 0.0588235, 22.1846, -24)
   Draw A height>Branch 2 A : 228 164 56 50 1    => 228 163 56 3 1
   Draw B span>Draw B#2 : 283 214 0 11 1    => 283 214 0 11 1 matrix(0, 0, 0, 1, -55.0859, 0)
   Drop 2>Leg 1 : 228 164 1 1 1    => 259 164 1 1 1 matrix(1, 0, 0, 1, -24.7554, 0)
   Leg 1>Leg 2#2 : 228 164 1 1 1    => 259 164 1 1 1 matrix(1, 0, 0, 1, 0, -60)
   Leg 2>Leg 3#2 : 228 164 1 1 1    => 259 164 1 1 1
   Leg 3>Dot#2 : 225 161 7 7 0   rgb(63, 209, 188) => 256 161 7 7 1   rgb(63, 209, 188)
   Drop 2 last leg>Grow : 284 224 1 1 1    => 284 224 1 1 1 matrix(1, 0, 0, 1, -109.172, 0)
   Connected 3>Draw A : 228 227 0 11 1    => 228 227 0 11 1 matrix(0, 0, 0, 1, -22, 0)
   Draw A>Draw A height#3 : 228 227 44 3 1    => 228 227 0 11 1
   Draw A height>Branch 3 A : 228 228 44 10 1    => 228 228 0 10 1
   Draw B span>Draw B#3 : 271 238 0 11 1    => 271 238 0 11 1 matrix(0, 0, 0, 1, -61.0859, 0)
   Drop 3>Leg 1 : 228 228 1 1 1    => 228 228 1 1 1 matrix(1, 0, 0, 1, -44, 0)
   Leg 1>Leg 2#3 : 228 228 1 1 1    => 228 228 1 1 1 matrix(1, 0, 0, 1, 0, -20)
   Drop 3 last leg>Grow : 272 248 1 1 1    => 272 248 1 1 1 matrix(1, 0, 0, 1, -121.172, 0)
   Connected 4>Draw A : 228 281 0 12 1    => 228 281 0 12 1 matrix(0, 0, 0, 1, -22, 0)
   Draw A>Draw A height#4 : 228 290 44 3 1    => 228 281 0 12 1
   Draw A height>Branch 4 A : 228 281 44 12 1    => 228 281 0 12 1
   Draw B span>Draw B#4 : 271 272 0 11 1    => 271 272 0 11 1 matrix(0, 0, 0, 1, -61.0859, 0)
   Drop 4>Leg 1 : 228 292 1 1 1    => 228 292 1 1 1 matrix(1, 0, 0, 1, -44, 0)
   Leg 1>Leg 2#4 : 228 292 1 1 1    => 228 292 1 1 1 matrix(1, 0, 0, 1, 0, 20)
   Drop 4 last leg>Grow : 272 272 1 1 1    => 272 272 1 1 1 matrix(1, 0, 0, 1, -121.172, 0)
   Connected 5>Draw A : 228 305 0 52 1    => 228 305 56 52 1
   Draw A>Draw A height#5 : 228 354 56 3 1    => 228 305 56 52 1
   Draw B span>Draw B#5 : 283 296 0 11 1    => 283 296 51 11 1 matrix(0.464286, 0, 0, 1, -29.5103, 0)
   Draw B>Branch 5 B : 283 296 0 10 1    => 283 296 51 10 1 matrix(1, 0, 0, 1, 0, 0)
   Drop 5>Leg 1 : 228 356 1 1 1    => 284 356 1 1 1
   Leg 1>Leg 2#5 : 228 356 1 1 1    => 284 296 1 1 1
   Leg 2>Leg 3#5 : 228 356 1 1 1    => 284 296 1 1 0
   Leg 3>Dot#5 : 225 353 7 7 0   rgb(63, 209, 188) => 281 293 7 7 1   rgb(63, 209, 188)
   Drop 5 last leg>Grow : 284 296 1 1 1    => 319 296 1 1 1 matrix(1, 0, 0, 1, -73.925, 0)
   Grow>Dot#5 : 281 293 7 7 0   rgb(63, 209, 188) => 316 293 7 7 1   rgb(63, 209, 188)
   Connected 6>Draw A : 228 329 0 92 1    => 228 329 0 92 1 matrix(0, 0, 0, 1, -34, 0)
   Draw A>Draw A height#6 : 228 418 68 3 1    => 228 329 0 92 1
   Draw A height>Branch 6 A : 228 329 68 92 1    => 228 329 0 92 1
   Draw B span>Draw B#6 : 295 320 0 11 1    => 295 320 0 11 1 matrix(0, 0, 0, 1, -49.0859, 0)
   Drop 6>Leg 1 : 228 420 1 1 1    => 228 420 1 1 1 matrix(1, 0, 0, 1, -68, 0)
   Leg 1>Leg 2#6 : 228 420 1 1 1    => 228 420 1 1 1 matrix(1, 0, 0, 1, 0, 100)
   Drop 6 last leg>Grow : 296 320 1 1 1    => 296 320 1 1 1 matrix(1, 0, 0, 1, -97.1719, 0)
   Primefold window>Sweep fade : 393 68 342 400 0.706669    => 393 68 342 400 1
   Sweep fade>Reading sweep : 144 -181 839 839 1 matrix(-0.974761, 0.22325, -0.22325, -0.974761, 0, 0)   => 81 -244 964 964 1 matrix(0.84851, 0.529179, -0.529179, 0.84851, 0, 0)
   Window>Question row : 410 117 308 50 0.889633    => 410 117 308 50 1
   Window>Working : 410 183 308 162 0.543973    => 410 183 308 162 1
   Steps>Step row1 : 420 213 288 16 0    => 420 213 288 16 1
   Sweep fade>Reading sweep#2 : 534 -222 1057 1057 1 matrix(-0.974761, 0.22325, -0.22325, -0.974761, 0, 0)   => 454 -301 1215 1215 1 matrix(0.84851, 0.529179, -0.529179, 0.84851, 0, 0)
   Answer body>Thinking : 896 112 331 362 1  blur(0px)  => 896 112 331 362 1
   Bloom>Orb : 1045 276 33 33 1 matrix(1.05567, 0, 0, 1.05567, 0, 0)  rgb(11, 11, 12) => 1046 277 31 31 1 matrix(1.00297, 0, 0, 1.00297, 0, 0)  rgb(11, 11, 12)
   Orb>Silk : 1036 267 52 52 1    => 1037 268 49 49 1
   Orb>Rim : 1045 276 33 33 1    => 1046 277 31 31 1
   Orb>Gloss : 1052 279 13 7 1  blur(5px) rgba(255, 255, 255, 0.28) => 1052 280 13 6 1  blur(5px) rgba(255, 255, 255, 0.28)
STATE 05 Act
   Source 1>Icon : 55 85 30 30 1   rgba(242, 251, 249, 0.08) => 55 85 30 30 1   rgba(63, 209, 188, 0.16)
   Source 1>Read : 198 92 16 16 0.0096554   rgb(63, 209, 188) => 198 92 16 16 1   rgb(63, 209, 188)
   Source 2>Icon : 55 149 30 30 1   rgba(255, 255, 255, 0.07) => 55 149 30 30 1   rgba(63, 209, 188, 0.16)
   Source 2>Read : 198 156 16 16 0   rgb(63, 209, 188) => 198 156 16 16 1   rgb(63, 209, 188)
   Source 3>Icon : 55 213 30 30 1   rgba(255, 255, 255, 0.07) => 55 213 30 30 1   rgba(63, 209, 188, 0.16)
   Source 3>Read : 198 220 16 16 0   rgb(63, 209, 188) => 198 220 16 16 1   rgb(63, 209, 188)
   Source 4>Icon : 55 277 30 30 1   rgba(255, 255, 255, 0.07) => 55 277 30 30 1   rgba(63, 209, 188, 0.16)
   Source 4>Read : 198 284 16 16 0   rgb(63, 209, 188) => 198 284 16 16 1   rgb(63, 209, 188)
   Source 5>Icon : 55 341 30 30 1   rgba(255, 255, 255, 0.07) => 55 341 30 30 1   rgba(63, 209, 188, 0.16)
   Source 5>Read : 198 348 16 16 0   rgb(63, 209, 188) => 198 348 16 16 1   rgb(63, 209, 188)
   Source 6>Icon : 55 405 30 30 1   rgba(255, 255, 255, 0.07) => 55 405 30 30 1   rgba(63, 209, 188, 0.16)
   Source 6>Read : 198 412 16 16 0   rgb(63, 209, 188) => 198 412 16 16 1   rgb(63, 209, 188)
   Grow>Dot : 390 197 7 7 1   rgb(63, 209, 188) => 390 197 7 7 0   rgb(63, 209, 188)
   Connected 2>Draw A : 228 163 31 51 1 matrix(0.55794, 0, 0, 1, -12.3777, 0)   => 228 163 56 51 1
   Draw A>Draw A height#2 : 228 163 56 3 1 matrix(1.79231, 0, 0, 0.0588235, 22.1846, -24)   => 228 163 56 51 1
   Draw A height>Branch 2 A : 228 163 56 3 1    => 228 164 56 50 1
   Draw B span>Draw B#2 : 283 214 0 11 1 matrix(0, 0, 0, 1, -55.0859, 0)   => 283 214 110 11 1
   Draw B>Branch 2 B : 283 214 0 10 1    => 283 214 110 10 1
   Drop 2>Leg 1 : 259 164 1 1 1 matrix(1, 0, 0, 1, -24.7554, 0)   => 284 164 1 1 1
   Leg 1>Leg 2#2 : 259 164 1 1 1 matrix(1, 0, 0, 1, 0, -60)   => 284 224 1 1 1
   Leg 2>Leg 3#2 : 259 164 1 1 1    => 284 224 1 1 0
   Leg 3>Dot#2 : 256 161 7 7 1   rgb(63, 209, 188) => 281 221 7 7 1   rgb(63, 209, 188)
   Drop 2 last leg>Grow : 284 224 1 1 1 matrix(1, 0, 0, 1, -109.172, 0)   => 393 224 1 1 1
   Grow>Dot#2 : 281 221 7 7 0   rgb(63, 209, 188) => 390 221 7 7 0   rgb(63, 209, 188)
   Connected 3>Draw A : 228 227 0 11 1 matrix(0, 0, 0, 1, -22, 0)   => 228 227 44 11 1
   Draw A>Draw A height#3 : 228 227 0 11 1    => 228 227 44 11 1
   Draw A height>Branch 3 A : 228 228 0 10 1    => 228 228 44 10 1
   Draw B span>Draw B#3 : 271 238 0 11 1 matrix(0, 0, 0, 1, -61.0859, 0)   => 271 238 122 11 1
   Draw B>Branch 3 B : 271 238 0 10 1    => 271 238 122 10 1
   Drop 3>Leg 1 : 228 228 1 1 1 matrix(1, 0, 0, 1, -44, 0)   => 272 228 1 1 1
   Leg 1>Leg 2#3 : 228 228 1 1 1 matrix(1, 0, 0, 1, 0, -20)   => 272 248 1 1 1
   Leg 2>Leg 3#3 : 228 228 1 1 1    => 272 248 1 1 0
   Leg 3>Dot#3 : 225 225 7 7 0   rgb(63, 209, 188) => 269 245 7 7 1   rgb(63, 209, 188)
   Drop 3 last leg>Grow : 272 248 1 1 1 matrix(1, 0, 0, 1, -121.172, 0)   => 393 248 1 1 1
   Grow>Dot#3 : 269 245 7 7 0   rgb(63, 209, 188) => 390 245 7 7 0   rgb(63, 209, 188)
   Connected 4>Draw A : 228 281 0 12 1 matrix(0, 0, 0, 1, -22, 0)   => 228 281 44 12 1
   Draw A>Draw A height#4 : 228 281 0 12 1    => 228 281 44 12 1
   Draw A height>Branch 4 A : 228 281 0 12 1    => 228 281 44 12 1
   Draw B span>Draw B#4 : 271 272 0 11 1 matrix(0, 0, 0, 1, -61.0859, 0)   => 271 272 122 11 1
   Draw B>Branch 4 B : 271 272 0 10 1    => 271 272 122 10 1
   Drop 4>Leg 1 : 228 292 1 1 1 matrix(1, 0, 0, 1, -44, 0)   => 272 292 1 1 1
   Leg 1>Leg 2#4 : 228 292 1 1 1 matrix(1, 0, 0, 1, 0, 20)   => 272 272 1 1 1
   Leg 2>Leg 3#4 : 228 292 1 1 1    => 272 272 1 1 0
   Leg 3>Dot#4 : 225 289 7 7 0   rgb(63, 209, 188) => 269 269 7 7 1   rgb(63, 209, 188)
   Drop 4 last leg>Grow : 272 272 1 1 1 matrix(1, 0, 0, 1, -121.172, 0)   => 393 272 1 1 1
   Grow>Dot#4 : 269 269 7 7 0   rgb(63, 209, 188) => 390 269 7 7 0   rgb(63, 209, 188)
   Draw B span>Draw B#5 : 283 296 51 11 1 matrix(0.464286, 0, 0, 1, -29.5103, 0)   => 283 296 110 11 1
   Draw B>Branch 5 B : 283 296 51 10 1 matrix(1, 0, 0, 1, 0, 0)   => 283 296 110 10 1
   Drop 5 last leg>Grow : 319 296 1 1 1 matrix(1, 0, 0, 1, -73.925, 0)   => 393 296 1 1 1
   Grow>Dot#5 : 316 293 7 7 1   rgb(63, 209, 188) => 390 293 7 7 0   rgb(63, 209, 188)
   Connected 6>Draw A : 228 329 0 92 1 matrix(0, 0, 0, 1, -34, 0)   => 228 329 68 92 1
   Draw A>Draw A height#6 : 228 329 0 92 1    => 228 329 68 92 1
   Draw A height>Branch 6 A : 228 329 0 92 1    => 228 329 68 92 1
   Draw B span>Draw B#6 : 295 320 0 11 1 matrix(0, 0, 0, 1, -49.0859, 0)   => 295 320 98 11 1
   Draw B>Branch 6 B : 295 320 0 10 1    => 295 320 98 10 1
   Drop 6>Leg 1 : 228 420 1 1 1 matrix(1, 0, 0, 1, -68, 0)   => 296 420 1 1 1
   Leg 1>Leg 2#6 : 228 420 1 1 1 matrix(1, 0, 0, 1, 0, 100)   => 296 320 1 1 1
   Leg 2>Leg 3#6 : 228 420 1 1 1    => 296 320 1 1 0
   Leg 3>Dot#6 : 225 417 7 7 0   rgb(63, 209, 188) => 293 317 7 7 1   rgb(63, 209, 188)
   Drop 6 last leg>Grow : 296 320 1 1 1 matrix(1, 0, 0, 1, -97.1719, 0)   => 393 320 1 1 1
   Grow>Dot#6 : 293 317 7 7 0   rgb(63, 209, 188) => 390 317 7 7 0   rgb(63, 209, 188)
   Primefold window>Sweep fade : 393 68 342 400 1    => 393 68 342 400 0.0629618
   Sweep fade>Reading sweep : 81 -244 964 964 1 matrix(0.84851, 0.529179, -0.529179, 0.84851, 0, 0)   => 84 -241 958 958 1 matrix(-0.506786, -0.862072, 0.862072, -0.506786, 0, 0)
   Steps>Step row2 : 420 236 288 16 0    => 420 236 288 16 1
   Steps>Interim finding : 420 259 288 32 0    => 420 259 288 32 1
   Steps>Step row3 : 420 298 288 16 0    => 420 298 288 16 1
   Steps>Step row4 : 420 321 288 16 0    => 420 321 288 16 1
   Out span>Out branch : 735 259 157 2 0    => 735 259 157 2 1
   Out span>Draw out : 735 258 0 4 1    => 735 258 157 4 1
   Draw out>Out connected : 735 259 0 2 1    => 735 259 157 2 1
   Out span>Grow : 735 260 1 1 1    => 891 260 1 1 1
   Grow>Dot#7 : 732 257 7 7 0   rgb(249, 157, 114) => 888 257 7 7 1   rgb(249, 157, 114)
   Right zone>Answer : 895 111 333 364 0 matrix(0.98, 0, 0, 0.98, 0, 0)   => 892 107 340 371 1
   Answer>Sweep fade : 895 111 333 364 0    => 892 107 340 371 1
   Sweep fade>Reading sweep#2 : 454 -301 1215 1215 1 matrix(0.84851, 0.529179, -0.529179, 0.84851, 0, 0)   => 446 -309 1232 1232 1 matrix(-0.506786, -0.862072, 0.862072, -0.506786, 0, 0)
   Answer>Answer body : 896 112 331 362 1   rgb(22, 21, 19) => 893 108 338 369 1   rgb(22, 21, 19)
   Answer body>Result card : 911 158 302 192 0   rgba(255, 255, 255, 0.03) => 908 155 308 196 0   rgba(255, 255, 255, 0.03)
   Result card>Bar 1 : 925 200 274 16 1    => 922 198 280 16 1
   Bar 1>Track : 1072 204 127 8 1   rgba(255, 255, 255, 0.07) => 1072 202 130 8 1   rgba(255, 255, 255, 0.07)
   Track>Value : 1072 204 0 8 1   rgb(63, 209, 188) => 1072 202 0 8 1 matrix(0, 0, 0, 1, -53.2968, 0)  rgb(63, 209, 188)
   Result card>Bar 2 : 925 224 274 31 1    => 922 223 280 32 1
   Bar 2>Track : 1072 236 127 8 1   rgba(255, 255, 255, 0.07) => 1072 235 130 8 1   rgba(255, 255, 255, 0.07)
   Track>Value#2 : 1072 236 0 8 1   rgb(63, 209, 188) => 1072 235 0 8 1 matrix(0, 0, 0, 1, -28.5937, 0)  rgb(63, 209, 188)
   Result card>Bar 3 : 925 265 274 16 1    => 922 264 280 16 1
   Bar 3>Track : 1072 268 127 8 1   rgba(255, 255, 255, 0.07) => 1072 268 130 8 1   rgba(255, 255, 255, 0.07)
   Track>Value#3 : 1072 268 0 8 1   rgb(63, 209, 188) => 1072 268 0 8 1 matrix(0, 0, 0, 1, -18.1953, 0)  rgb(63, 209, 188)
   Result card>Comparison : 925 289 274 47 1    => 922 289 280 48 1
   Comparison>Value : 1078 299 121 37 1    => 1078 299 124 38 1
   Result card>Clause preview : 919 281 286 76 0   rgb(30, 29, 27) => 916 281 292 78 0   rgb(30, 29, 27)
   Clause preview>Highlight : 931 313 263 35 1   rgba(202, 123, 87, 0) => 928 313 268 36 1   rgba(202, 123, 87, 0)
   Answer body>Sources : 911 366 302 46 0    => 908 367 308 47 0
   Sources>Source 1#2 : 911 366 86 22 1   rgba(255, 255, 255, 0.05) => 908 367 88 22 1   rgba(255, 255, 255, 0.05)
   Source 1>Icon#2 : 914 369 16 16 1   rgba(255, 255, 255, 0.07) => 911 370 16 16 1   rgba(255, 255, 255, 0.07)
   Sources>Source 2#2 : 1000 366 161 22 1   rgba(255, 255, 255, 0.05) => 999 367 164 22 1   rgba(255, 255, 255, 0.05)
   Source 2>Icon#2 : 1003 369 16 16 1   rgba(255, 255, 255, 0.07) => 1002 370 16 16 1   rgba(255, 255, 255, 0.07)
   Sources>Source 3#2 : 911 390 82 22 1   rgba(255, 255, 255, 0.05) => 908 392 84 22 1   rgba(255, 255, 255, 0.05)
   Source 3>Icon#2 : 914 393 16 16 1   rgba(255, 255, 255, 0.07) => 911 395 16 16 1   rgba(255, 255, 255, 0.07)
   Answer body>Next step : 911 427 184 31 0   rgba(255, 255, 255, 0.05) => 908 430 188 32 0   rgba(255, 255, 255, 0.05)
   Answer body>Thinking : 896 112 331 362 1    => 893 108 338 369 1  blur(0px)
   Thinking>Bloom : 1046 277 31 31 0 matrix(0.5, 0, 0, 0.5, 0, 0) blur(10px)  => 1031 261 63 63 0.967518 matrix(0.983951, 0, 0, 0.983951, 0, 0) blur(0.324818px)
   Bloom>Orb : 1046 277 31 31 1 matrix(1.00297, 0, 0, 1.00297, 0, 0)  rgb(11, 11, 12) => 1029 260 66 66 1 matrix(1.05087, 0, 0, 1.05087, 0, 0)  rgb(11, 11, 12)
   Orb>Silk : 1037 268 49 49 1    => 1010 241 103 103 1
   Orb>Rim : 1046 277 31 31 1    => 1029 260 66 66 1
   Orb>Gloss : 1052 280 13 6 1  blur(5px) rgba(255, 255, 255, 0.28) => 1041 266 27 13 1  blur(5px) rgba(255, 255, 255, 0.28)
STATE 06 Press
   Primefold window>Sweep fade : 393 68 342 400 0.0629618    => 393 68 342 400 0
   Sweep fade>Reading sweep : 84 -241 958 958 1 matrix(-0.506786, -0.862072, 0.862072, -0.506786, 0, 0)   => 75 -250 976 976 1 matrix(0.577145, 0.816642, -0.816642, 0.577145, 0, 0)
   Answer>Sweep fade : 892 107 340 371 1    => 892 107 340 371 0.693451
   Sweep fade>Reading sweep#2 : 446 -309 1232 1232 1 matrix(-0.506786, -0.862072, 0.862072, -0.506786, 0, 0)   => 435 -320 1255 1255 1 matrix(0.579281, 0.815128, -0.815128, 0.579281, 0, 0)
   Answer body>Result card : 908 155 308 196 0   rgba(255, 255, 255, 0.03) => 908 155 308 196 1   rgba(255, 255, 255, 0.03)
   Track>Value : 1072 202 0 8 1 matrix(0, 0, 0, 1, -53.2968, 0)  rgb(63, 209, 188) => 1072 202 107 8 1   rgb(63, 209, 188)
   Track>Value#2 : 1072 235 0 8 1 matrix(0, 0, 0, 1, -28.5937, 0)  rgb(63, 209, 188) => 1072 235 57 8 1   rgb(63, 209, 188)
   Track>Value#3 : 1072 268 0 8 1 matrix(0, 0, 0, 1, -18.1953, 0)  rgb(63, 209, 188) => 1072 268 36 8 1   rgb(63, 209, 188)
   Answer body>Sources : 908 367 308 47 0    => 908 367 308 47 1
   Sources>Source 2#2 : 999 367 164 22 1   rgba(255, 255, 255, 0.05) => 1002 368 158 21 1 matrix(0.962805, 0, 0, 0.962805, 0, 0)  rgba(255, 255, 255, 0.05)
   Source 2>Icon#2 : 1002 370 16 16 1   rgba(255, 255, 255, 0.07) => 1004 371 15 15 1   rgba(255, 255, 255, 0.07)
   Answer body>Next step : 908 430 188 32 0   rgba(255, 255, 255, 0.05) => 908 430 188 32 1   rgba(255, 255, 255, 0.05)
   Answer body>Thinking : 893 108 338 369 1  blur(0px)  => 907 123 311 340 0 matrix(0.92, 0, 0, 0.92, 0, 0) blur(6px)
   Thinking>Bloom : 1031 261 63 63 0.967518 matrix(0.983951, 0, 0, 0.983951, 0, 0) blur(0.324818px)  => 1033 263 59 59 1  blur(0px)
   Bloom>Orb : 1029 260 66 66 1 matrix(1.05087, 0, 0, 1.05087, 0, 0)  rgb(11, 11, 12) => 1032 263 59 59 1 matrix(1.00627, 0, 0, 1.00627, 0, 0)  rgb(11, 11, 12)
   Orb>Silk : 1010 241 103 103 1    => 1016 246 93 93 1
   Orb>Rim : 1029 260 66 66 1    => 1032 263 59 59 1
   Orb>Gloss : 1041 266 27 13 1  blur(5px) rgba(255, 255, 255, 0.28) => 1043 269 24 12 1  blur(5px) rgba(255, 255, 255, 0.28)
STATE 07 Trace
   Drop 5>Leg 1 : 284 356 1 1 1    => 228 356 1 1 1
   Leg 1>Leg 2#5 : 284 296 1 1 1    => 228 356 1 1 1
   Leg 2>Leg 3#5 : 284 296 1 1 0    => 228 356 1 1 1
   Leg 3>Dot#5 : 281 293 7 7 1   rgb(63, 209, 188) => 225 353 7 7 1   rgb(249, 157, 114)
   Left zone>Drop 5 last leg : 284 296 109 1 1    => 284 296 109 1 0
   Drop 5 last leg>Grow : 393 296 1 1 1    => 284 296 1 1 1
   Grow>Dot#5 : 390 293 7 7 0   rgb(63, 209, 188) => 281 293 7 7 1   rgb(249, 157, 114)
   Sweep fade>Reading sweep : 75 -250 976 976 1 matrix(0.577145, 0.816642, -0.816642, 0.577145, 0, 0)   => 210 -115 705 705 1 matrix(-0.0078539, -0.999969, 0.999969, -0.0078539, 0, 0)
   Answer>Sweep fade : 892 107 340 371 0.693451    => 892 107 340 371 0
   Sweep fade>Reading sweep#2 : 435 -320 1255 1255 1 matrix(0.579281, 0.815128, -0.815128, 0.579281, 0, 0)   => 607 -148 909 909 1 matrix(-0.0104718, -0.999945, 0.999945, -0.0104718, 0, 0)
   Result card>Clause preview : 916 281 292 78 0   rgb(30, 29, 27) => 916 265 292 78 1   rgb(30, 29, 27)
   Clause preview>Highlight : 928 313 268 36 1   rgba(202, 123, 87, 0) => 928 297 268 36 1   rgba(249, 157, 114, 0.2)
   Sources>Source 2#2 : 1002 368 158 21 1 matrix(0.962805, 0, 0, 0.962805, 0, 0)  rgba(255, 255, 255, 0.05) => 999 367 164 22 1   rgba(255, 255, 255, 0.05)
   Source 2>Icon#2 : 1004 371 15 15 1   rgba(255, 255, 255, 0.07) => 1002 370 16 16 1   rgba(255, 255, 255, 0.07)
   Bloom>Orb : 1032 263 59 59 1 matrix(1.00627, 0, 0, 1.00627, 0, 0)  rgb(11, 11, 12) => 1031 262 61 61 1 matrix(1.03933, 0, 0, 1.03933, 0, 0)  rgb(11, 11, 12)
   Orb>Silk : 1016 246 93 93 1    => 1014 245 96 96 1
   Orb>Rim : 1032 263 59 59 1    => 1031 262 61 61 1
   Orb>Gloss : 1043 269 24 12 1  blur(5px) rgba(255, 255, 255, 0.28) => 1043 268 25 12 1  blur(5px) rgba(255, 255, 255, 0.28)
STATE 08 Fade
   Stage>Row : 24 0 1228 520 1    => 24 0 1228 520 0.994095
   Source 1>Icon : 55 85 30 30 1   rgba(63, 209, 188, 0.16) => 55 85 30 30 1   rgba(255, 255, 255, 0.07)
   Source 1>Read : 198 92 16 16 1   rgb(63, 209, 188) => 198 92 16 16 0   rgb(63, 209, 188)
   Source 2>Icon : 55 149 30 30 1   rgba(63, 209, 188, 0.16) => 55 149 30 30 1   rgba(255, 255, 255, 0.07)
   Source 2>Read : 198 156 16 16 1   rgb(63, 209, 188) => 198 156 16 16 0   rgb(63, 209, 188)
   Source 3>Icon : 55 213 30 30 1   rgba(63, 209, 188, 0.16) => 55 213 30 30 1   rgba(255, 255, 255, 0.07)
   Source 3>Read : 198 220 16 16 1   rgb(63, 209, 188) => 198 220 16 16 0   rgb(63, 209, 188)
   Source 4>Icon : 55 277 30 30 1   rgba(63, 209, 188, 0.16) => 55 277 30 30 1   rgba(255, 255, 255, 0.07)
   Source 4>Read : 198 284 16 16 1   rgb(63, 209, 188) => 198 284 16 16 0   rgb(63, 209, 188)
   Source 5>Icon : 55 341 30 30 1   rgba(63, 209, 188, 0.16) => 55 341 30 30 1   rgba(255, 255, 255, 0.07)
   Source 5>Read : 198 348 16 16 1   rgb(63, 209, 188) => 198 348 16 16 0   rgb(63, 209, 188)
   Source 6>Icon : 55 405 30 30 1   rgba(63, 209, 188, 0.16) => 55 405 30 30 1   rgba(255, 255, 255, 0.07)
   Source 6>Read : 198 412 16 16 1   rgb(63, 209, 188) => 198 412 16 16 0   rgb(63, 209, 188)
   Connected 1>Draw A : 228 99 68 91 1    => 228 99 0 91 1
   Draw A>Draw A height : 228 99 68 91 1    => 228 99 68 3 1
   Draw B span>Draw B : 295 190 98 11 1    => 295 190 0 11 1
   Draw B>Branch 1 B : 295 190 98 10 1    => 295 190 0 10 1
   Drop 1>Leg 1 : 296 100 1 1 1    => 228 100 1 1 1
   Leg 1>Leg 2 : 296 200 1 1 1    => 228 100 1 1 1
   Leg 2>Leg 3 : 296 200 1 1 0    => 228 100 1 1 0.997719
   Leg 3>Dot : 293 197 7 7 1   rgb(63, 209, 188) => 225 97 7 7 0   rgb(63, 209, 188)
   Drop 1 last leg>Grow : 393 200 1 1 1    => 296 200 1 1 1
   Grow>Dot : 390 197 7 7 0   rgb(63, 209, 188) => 293 197 7 7 0   rgb(63, 209, 188)
   Connected 2>Draw A : 228 163 56 51 1    => 228 163 0 51 1
   Draw A>Draw A height#2 : 228 163 56 51 1    => 228 163 56 3 1
   Draw B span>Draw B#2 : 283 214 110 11 1    => 283 214 0 11 1
   Draw B>Branch 2 B : 283 214 110 10 1    => 283 214 0 10 1
   Drop 2>Leg 1 : 284 164 1 1 1    => 228 164 1 1 1
   Leg 1>Leg 2#2 : 284 224 1 1 1    => 228 164 1 1 1
   Leg 2>Leg 3#2 : 284 224 1 1 0    => 228 164 1 1 0.997719
   Leg 3>Dot#2 : 281 221 7 7 1   rgb(63, 209, 188) => 225 161 7 7 0   rgb(63, 209, 188)
   Drop 2 last leg>Grow : 393 224 1 1 1    => 284 224 1 1 1
   Grow>Dot#2 : 390 221 7 7 0   rgb(63, 209, 188) => 281 221 7 7 0   rgb(63, 209, 188)
   Connected 3>Draw A : 228 227 44 11 1    => 228 227 0 11 1
   Draw A>Draw A height#3 : 228 227 44 11 1    => 228 227 44 3 1
   Draw B span>Draw B#3 : 271 238 122 11 1    => 271 238 0 11 1
   Draw B>Branch 3 B : 271 238 122 10 1    => 271 238 0 10 1
   Drop 3>Leg 1 : 272 228 1 1 1    => 228 228 1 1 1
   Leg 1>Leg 2#3 : 272 248 1 1 1    => 228 228 1 1 1
   Leg 2>Leg 3#3 : 272 248 1 1 0    => 228 228 1 1 0.997719
   Leg 3>Dot#3 : 269 245 7 7 1   rgb(63, 209, 188) => 225 225 7 7 0   rgb(63, 209, 188)
   Drop 3 last leg>Grow : 393 248 1 1 1    => 272 248 1 1 1
   Grow>Dot#3 : 390 245 7 7 0   rgb(63, 209, 188) => 269 245 7 7 0   rgb(63, 209, 188)
   Connected 4>Draw A : 228 281 44 12 1    => 228 281 0 12 1
   Draw A>Draw A height#4 : 228 281 44 12 1    => 228 290 44 3 1
   Draw B span>Draw B#4 : 271 272 122 11 1    => 271 272 0 11 1
   Draw B>Branch 4 B : 271 272 122 10 1    => 271 272 0 10 1
   Drop 4>Leg 1 : 272 292 1 1 1    => 228 292 1 1 1
   Leg 1>Leg 2#4 : 272 272 1 1 1    => 228 292 1 1 1
   Leg 2>Leg 3#4 : 272 272 1 1 0    => 228 292 1 1 0.997719
   Leg 3>Dot#4 : 269 269 7 7 1   rgb(63, 209, 188) => 225 289 7 7 0   rgb(63, 209, 188)
   Drop 4 last leg>Grow : 393 272 1 1 1    => 272 272 1 1 1
   Grow>Dot#4 : 390 269 7 7 0   rgb(63, 209, 188) => 269 269 7 7 0   rgb(63, 209, 188)
   Connected 5>Draw A : 228 305 56 52 1    => 228 305 0 52 1
   Draw A>Draw A height#5 : 228 305 56 52 1    => 228 354 56 3 1
   Draw B span>Draw B#5 : 283 296 110 11 1    => 283 296 0 11 1
   Draw B>Branch 5 B : 283 296 110 10 1    => 283 296 0 10 1
   Leg 3>Dot#5 : 225 353 7 7 1   rgb(249, 157, 114) => 225 353 7 7 0   rgb(63, 209, 188)
   Left zone>Drop 5 last leg : 284 296 109 1 0    => 284 296 109 1 0.997719
   Grow>Dot#5 : 281 293 7 7 1   rgb(249, 157, 114) => 281 293 7 7 0   rgb(63, 209, 188)
   Connected 6>Draw A : 228 329 68 92 1    => 228 329 0 92 1
   Draw A>Draw A height#6 : 228 329 68 92 1    => 228 418 68 3 1
   Draw B span>Draw B#6 : 295 320 98 11 1    => 295 320 0 11 1
   Draw B>Branch 6 B : 295 320 98 10 1    => 295 320 0 10 1
   Drop 6>Leg 1 : 296 420 1 1 1    => 228 420 1 1 1
   Leg 1>Leg 2#6 : 296 320 1 1 1    => 228 420 1 1 1
   Leg 2>Leg 3#6 : 296 320 1 1 0    => 228 420 1 1 0.997719
   Leg 3>Dot#6 : 293 317 7 7 1   rgb(63, 209, 188) => 225 417 7 7 0   rgb(63, 209, 188)
   Drop 6 last leg>Grow : 393 320 1 1 1    => 296 320 1 1 1
   Grow>Dot#6 : 390 317 7 7 0   rgb(63, 209, 188) => 293 317 7 7 0   rgb(63, 209, 188)
   Sweep fade>Reading sweep : 210 -115 705 705 1 matrix(-0.0078539, -0.999969, 0.999969, -0.0078539, 0, 0)   => 147 -178 832 832 1 matrix(0.9776, 0.210472, -0.210472, 0.9776, 0, 0)
   Window>Question row : 410 117 308 50 1    => 410 117 308 50 0
   Window>Working : 410 183 308 162 1    => 410 183 308 162 0
   Steps>Step row1 : 420 213 288 16 1    => 420 213 288 16 0
   Steps>Step row2 : 420 236 288 16 1    => 420 236 288 16 0
   Steps>Interim finding : 420 259 288 32 1    => 420 259 288 32 0
   Steps>Step row3 : 420 298 288 16 1    => 420 298 288 16 0
   Steps>Step row4 : 420 321 288 16 1    => 420 321 288 16 0
   Out span>Out branch : 735 259 157 2 1    => 735 259 157 2 0
   Out span>Draw out : 735 258 157 4 1    => 735 258 0 4 1
   Draw out>Out connected : 735 259 157 2 1    => 735 259 0 2 1
   Out span>Grow : 891 260 1 1 1    => 735 260 1 1 1
   Grow>Dot#7 : 888 257 7 7 1   rgb(249, 157, 114) => 732 257 7 7 0   rgb(249, 157, 114)
   Right zone>Answer : 892 107 340 371 1    => 895 111 333 364 0 matrix(0.98, 0, 0, 0.98, 0, 0)
   Answer>Sweep fade : 892 107 340 371 0    => 895 111 333 364 0
   Sweep fade>Reading sweep#2 : 607 -148 909 909 1 matrix(-0.0104718, -0.999945, 0.999945, -0.0104718, 0, 0)   => 539 -216 1046 1046 1 matrix(0.978148, 0.207912, -0.207912, 0.978148, 0, 0)
   Answer>Answer body : 893 108 338 369 1   rgb(22, 21, 19) => 896 112 331 362 1   rgb(22, 21, 19)
   Answer body>Result card : 908 155 308 196 1   rgba(255, 255, 255, 0.03) => 911 158 302 192 0   rgba(255, 255, 255, 0.03)
   Result card>Bar 1 : 922 198 280 16 1    => 925 200 274 16 1
   Bar 1>Track : 1072 202 130 8 1   rgba(255, 255, 255, 0.07) => 1072 204 127 8 1   rgba(255, 255, 255, 0.07)
   Track>Value : 1072 202 107 8 1   rgb(63, 209, 188) => 1072 204 0 8 1   rgb(63, 209, 188)
   Result card>Bar 2 : 922 223 280 32 1    => 925 224 274 31 1
   Bar 2>Track : 1072 235 130 8 1   rgba(255, 255, 255, 0.07) => 1072 236 127 8 1   rgba(255, 255, 255, 0.07)
   Track>Value#2 : 1072 235 57 8 1   rgb(63, 209, 188) => 1072 236 0 8 1   rgb(63, 209, 188)
   Result card>Bar 3 : 922 264 280 16 1    => 925 265 274 16 1
   Bar 3>Track : 1072 268 130 8 1   rgba(255, 255, 255, 0.07) => 1072 268 127 8 1   rgba(255, 255, 255, 0.07)
   Track>Value#3 : 1072 268 36 8 1   rgb(63, 209, 188) => 1072 268 0 8 1   rgb(63, 209, 188)
   Result card>Comparison : 922 289 280 48 1    => 925 289 274 47 1
   Comparison>Value : 1078 299 124 38 1    => 1078 299 121 37 1
   Result card>Clause preview : 916 265 292 78 1   rgb(30, 29, 27) => 919 281 286 76 0   rgb(30, 29, 27)
   Clause preview>Highlight : 928 297 268 36 1   rgba(249, 157, 114, 0.2) => 931 313 263 35 1   rgba(202, 123, 87, 0)
   Answer body>Sources : 908 367 308 47 1    => 911 366 302 46 0
   Sources>Source 1#2 : 908 367 88 22 1   rgba(255, 255, 255, 0.05) => 911 366 86 22 1   rgba(255, 255, 255, 0.05)
   Source 1>Icon#2 : 911 370 16 16 1   rgba(255, 255, 255, 0.07) => 914 369 16 16 1   rgba(255, 255, 255, 0.07)
   Sources>Source 2#2 : 999 367 164 22 1   rgba(255, 255, 255, 0.05) => 1000 366 161 22 1   rgba(255, 255, 255, 0.05)
   Source 2>Icon#2 : 1002 370 16 16 1   rgba(255, 255, 255, 0.07) => 1003 369 16 16 1   rgba(255, 255, 255, 0.07)
   Sources>Source 3#2 : 908 392 84 22 1   rgba(255, 255, 255, 0.05) => 911 390 82 22 1   rgba(255, 255, 255, 0.05)
   Source 3>Icon#2 : 911 395 16 16 1   rgba(255, 255, 255, 0.07) => 914 393 16 16 1   rgba(255, 255, 255, 0.07)
   Answer body>Next step : 908 430 188 32 1   rgba(255, 255, 255, 0.05) => 911 427 184 31 0   rgba(255, 255, 255, 0.05)
   Answer body>Thinking : 907 123 311 340 0 matrix(0.92, 0, 0, 0.92, 0, 0) blur(6px)  => 896 112 331 362 0.997719 matrix(0.999821, 0, 0, 0.999821, 0, 0) blur(0.0136861px)
   Thinking>Bloom : 1033 263 59 59 1  blur(0px)  => 1046 277 31 31 0 matrix(0.5, 0, 0, 0.5, 0, 0) blur(10px)
   Bloom>Orb : 1031 262 61 61 1 matrix(1.03933, 0, 0, 1.03933, 0, 0)  rgb(11, 11, 12) => 1046 277 31 31 1 matrix(1.00009, 0, 0, 1.00009, 0, 0)  rgb(11, 11, 12)
   Orb>Silk : 1014 245 96 96 1    => 1038 268 49 49 1
   Orb>Rim : 1031 262 61 61 1    => 1046 277 31 31 1
   Orb>Gloss : 1043 268 25 12 1  blur(5px) rgba(255, 255, 255, 0.28) => 1052 280 13 6 1  blur(5px) rgba(255, 255, 255, 0.28)
```
