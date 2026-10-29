# Primefold (primefold.ai) — information architecture

Source: https://primefold.ai/ (sitemap.xml + clone at src/)
Status: **draft — all 13 templates mapped to section contracts from design-repo/ (legal, blog-post and case-study bodies decomposed into semantic units in design-repo 0.2.0) (home measured; product pages spec-only, source in progress)** · production approved: **false**
29 routes · 13 templates · 39 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Blog post, Legal document, Case study) account for 18 of 29 routes (62%). The remaining 11 routes span 10 templates.

| template | routes | share |
|---|---:|---:|
| Blog post | 12 | 41% |
| Legal document | 3 | 10% |
| Case study | 3 | 10% |
| Product (Intelligence) | 2 | 7% |
| Home | 1 | 3% |
| Plans | 1 | 3% |
| Security | 1 | 3% |
| Contact | 1 | 3% |
| Company | 1 | 3% |
| Careers | 1 | 3% |
| Blog index | 1 | 3% |
| Case studies index | 1 | 3% |
| 404 | 1 | 3% |

## Page chrome

**29 routes carry chrome = `full`** — Home, Product (Intelligence), Plans, Security, Contact, Company, Careers, Legal document, Blog index, Blog post, Case studies index, Case study, 404.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.navbar` | SHELL | 13 | 29 | `src/components/Navbar.jsx` | Present on all 29 routes. |
| `conversion.cta-band` | CONVERSION | 13 | 29 | `src/components/CTA.jsx` | Present on all 29 routes. |
| `shell.footer` | SHELL | 13 | 29 | `src/components/Footer.jsx` | Present on all 29 routes. |
| `content.article-header` | CONTENT | 1 | 12 | `src/pages/BlogPost.jsx + src/pages/cms/shared.jsx + src/pages/cms/cms.css` | 12 routes. |
| `content.article-body` | CONTENT | 1 | 12 | `src/pages/cms/RichText.jsx + src/pages/cms/cms.css` | 12 routes. |
| `features.info-card-grid` | FEATURES | 3 | 3 | `src/pages/shared-info/InfoCard.jsx + src/pages/shared-info/SectionTitle.jsx + src/pages/shared-info/MaskIcon.jsx + src/pages/plans/PlansTrust.jsx + src/pages/security/FourFacts.jsx + src/pages/company/Commitments.jsx` | 3 routes. |
| `content.legal-header` | CONTENT | 1 | 3 | `src/pages/Legal.jsx + src/pages/legal/content.js + src/pages/legal/legal.css` | 3 routes. |
| `content.legal-part` | CONTENT | 1 | 3 | `src/pages/Legal.jsx + src/pages/legal/content.js + src/pages/legal/legal.css` | 3 routes. |
| `content.case-study-header` | CONTENT | 1 | 3 | `src/pages/CaseStudy.jsx + src/pages/cms/shared.jsx + src/pages/cms/cms.css` | 3 routes. |
| `proof.case-study-stats` | PROOF | 1 | 3 | `src/pages/CaseStudy.jsx` | 3 routes. |
| `content.case-study-body` | CONTENT | 1 | 3 | `src/pages/cms/RichText.jsx + src/pages/cms/cms.css` | 3 routes. |
| `content.case-study-about` | CONTENT | 1 | 3 | `src/pages/CaseStudy.jsx + src/pages/cms/shared.jsx` | 3 routes. |
| `hero.index-intro` | HERO | 2 | 2 | `src/pages/cms/shared.jsx + src/pages/Blog.jsx + src/pages/CaseStudies.jsx` | 2 routes. |
| `content.card-grid` | CONTENT | 2 | 2 | `src/pages/Blog.jsx + src/pages/CaseStudies.jsx + src/pages/cms/shared.jsx + src/pages/cms/cms.css` | 2 routes. |
| `hero.product-live-chat` | HERO | 1 | 2 | _not yet built_ | 2 routes. |
| `features.step-cards` | FEATURES | 1 | 2 | _not yet built_ | 2 routes. |
| `features.use-cases` | FEATURES | 1 | 2 | _not yet built_ | 2 routes. |
| `features.sources` | FEATURES | 1 | 2 | _not yet built_ | 2 routes. |
| `features.solutions-tabs` | FEATURES | 1 | 2 | _not yet built_ | 2 routes. |
| `features.loop-cards` | FEATURES | 1 | 2 | _not yet built_ | 2 routes. |
| `hero.home-carousel` | HERO | 1 | 1 | `src/components/Hero.jsx` | 1 route. |
| `proof.logo-ticker` | PROOF | 1 | 1 | `src/components/HowItWorks.jsx > LogoTicker` | 1 route. |
| `features.how-it-works` | FEATURES | 1 | 1 | `src/components/HowItWorks.jsx + how/A1Loop.jsx` | 1 route. |
| `features.intelligence-cards` | FEATURES | 1 | 1 | `src/components/Intelligence.jsx` | 1 route. |
| `proof.testimonials` | PROOF | 1 | 1 | `src/components/Testimonials.jsx` | 1 route. |
| `features.solutions-carousel` | FEATURES | 1 | 1 | `src/components/Solutions.jsx` | 1 route. |
| `proof.trust` | PROOF | 1 | 1 | `src/components/Trust.jsx` | 1 route. |
| `proof.outcomes` | PROOF | 1 | 1 | `src/components/Outcomes.jsx` | 1 route. |
| `hero.pricing` | HERO | 1 | 1 | `src/pages/plans/PlansHero.jsx + src/pages/plans/Segmented.jsx + src/pages/plans/ProductBadge.jsx + src/pages/plans/Tick.jsx + src/pages/plans/data.js` | 1 route. |
| `features.comparison-table` | FEATURES | 1 | 1 | `src/pages/plans/ComparisonTable.jsx + src/pages/plans/data.js` | 1 route. |
| `features.faq-accordion` | FEATURES | 1 | 1 | `src/pages/plans/PlansFaq.jsx + src/pages/plans/data.js` | 1 route. |
| `hero.security-comet` | HERO | 1 | 1 | `src/pages/security/SecurityHero.jsx + src/pages/security/CometRing.jsx` | 1 route. |
| `proof.trust-image-cards` | PROOF | 1 | 1 | `src/pages/security/TrustCards.jsx` | 1 route. |
| `conversion.contact-form` | CONVERSION | 1 | 1 | `src/pages/contact/ContactIntro.jsx + src/pages/contact/ContactForm.jsx + src/pages/contact/PhoneField.jsx + src/pages/contact/countries.js` | 1 route. |
| `hero.company-stats` | HERO | 1 | 1 | `src/pages/company/CompanyHero.jsx` | 1 route. |
| `features.team-ticker` | FEATURES | 1 | 1 | `src/pages/company/Team.jsx + src/pages/company/team.css` | 1 route. |
| `hero.careers` | HERO | 1 | 1 | `src/pages/careers/CareersHero.jsx` | 1 route. |
| `content.open-roles` | CONTENT | 1 | 1 | `src/pages/careers/OpenRoles.jsx` | 1 route. |
| `content.not-found` | CONTENT | 1 | 1 | `src/pages/NotFound.jsx` | 1 route. |

**6 shared sections** appear in more than one template and belong in a component library.

**33 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

**6 sections have no `implementedBy` yet** — not necessarily missing, just not linked to a component in this pass: `hero.product-live-chat`, `features.step-cards`, `features.use-cases`, `features.sources`, `features.solutions-tabs`, `features.loop-cards`.

## Templates

### Home — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.home-carousel` | page-local |
| 3 | PROOF | `proof.logo-ticker` | page-local |
| 4 | FEATURES | `features.how-it-works` | page-local |
| 5 | FEATURES | `features.intelligence-cards` | page-local |
| 6 | PROOF | `proof.testimonials` | page-local |
| 7 | FEATURES | `features.solutions-carousel` | page-local |
| 8 | PROOF | `proof.trust` | page-local |
| 9 | PROOF | `proof.outcomes` | page-local |
| 10 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 11 | SHELL | `shell.footer` | shared ×13 |

### Product (Intelligence) — `template.product`

2 routes · `/experience-intelligence`, `/realestate-intelligence` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.product-live-chat` | page-local |
| 3 | FEATURES | `features.step-cards` | page-local |
| 4 | FEATURES | `features.use-cases` | page-local |
| 5 | FEATURES | `features.sources` | page-local |
| 6 | FEATURES | `features.solutions-tabs` | page-local |
| 7 | FEATURES | `features.loop-cards` | page-local |
| 8 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 9 | SHELL | `shell.footer` | shared ×13 |

### Plans — `template.plans`

1 route · `/plans` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.pricing` | page-local |
| 3 | FEATURES | `features.comparison-table` | page-local |
| 4 | FEATURES | `features.info-card-grid` | shared ×3 |
| 5 | FEATURES | `features.faq-accordion` | page-local |
| 6 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 7 | SHELL | `shell.footer` | shared ×13 |

### Security — `template.security`

1 route · `/security` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.security-comet` | page-local |
| 3 | FEATURES | `features.info-card-grid` | shared ×3 |
| 4 | PROOF | `proof.trust-image-cards` | page-local |
| 5 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 6 | SHELL | `shell.footer` | shared ×13 |

### Contact — `template.contact`

1 route · `/contact` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONVERSION | `conversion.contact-form` | page-local |
| 3 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 4 | SHELL | `shell.footer` | shared ×13 |

### Company — `template.company`

1 route · `/company` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.company-stats` | page-local |
| 3 | FEATURES | `features.info-card-grid` | shared ×3 |
| 4 | FEATURES | `features.team-ticker` | page-local |
| 5 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 6 | SHELL | `shell.footer` | shared ×13 |

### Careers — `template.careers`

1 route · `/careers` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.careers` | page-local |
| 3 | CONTENT | `content.open-roles` | page-local |
| 4 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 5 | SHELL | `shell.footer` | shared ×13 |

### Legal document — `template.legal`

3 routes · `/imprint`, `/data-privacy`, `/terms-of-service` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.legal-header` | page-local |
| 3 | CONTENT | `content.legal-part` | page-local |
| 4 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 5 | SHELL | `shell.footer` | shared ×13 |

### Blog index — `template.blog-index`

1 route · `/blog` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.index-intro` | shared ×2 |
| 3 | CONTENT | `content.card-grid` | shared ×2 |
| 4 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 5 | SHELL | `shell.footer` | shared ×13 |

### Blog post — `template.blog-post`

12 routes · `/blog/we-re-taking-real-estate-intelligence-to-expo-real-2026.-come-and-talk-to-your-portfolio`, `/blog/primefold-xi-speaks-german-now`, `/blog/we-rebuilt-our-website-primefold-ai`, `/blog/primefold-ri-is-here-real-estate-intelligence`, `/blog/nobody-asks-their-customers-anything-right-after-they-buy.-now-you-can-right-on-shopify.`, `/blog/how-we-built-sunday-s-survey-design-agent`, `/blog/meet-sunday-the-intelligence-layer-built-into-primefold-xi`, `/blog/design-and-reports-get-their-moment`, `/blog/the-insight-hub-is-about-to-get-sharper`, `/blog/primefold-xi-is-here`, `/blog/introducing-primefold---saypien-is-becoming-primefold`, `/blog/nas-invest-turned-tenant-insight-into-tenant-strength` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.article-header` | page-local |
| 3 | CONTENT | `content.article-body` | page-local |
| 4 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 5 | SHELL | `shell.footer` | shared ×13 |

### Case studies index — `template.case-studies-index`

1 route · `/case-studies` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.index-intro` | shared ×2 |
| 3 | CONTENT | `content.card-grid` | shared ×2 |
| 4 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 5 | SHELL | `shell.footer` | shared ×13 |

### Case study — `template.case-study`

3 routes · `/case-studies/gainback-primefold-xi`, `/case-studies/nas-primefold-xi-ri`, `/case-studies/dirts-primefold-xi` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.case-study-header` | page-local |
| 3 | PROOF | `proof.case-study-stats` | page-local |
| 4 | CONTENT | `content.case-study-body` | page-local |
| 5 | CONTENT | `content.case-study-about` | page-local |
| 6 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 7 | SHELL | `shell.footer` | shared ×13 |

### 404 — `template.not-found`

1 route · `/404` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.not-found` | page-local |
| 3 | CONVERSION | `conversion.cta-band` | shared ×13 |
| 4 | SHELL | `shell.footer` | shared ×13 |

## Section reference

### SHELL

_Site chrome on every route: navigation and footer._

**`shell.navbar`** — Fixed top navigation: logo, Products/Resources/Company dropdowns, Plans and Security links, Sign in + Book a call pill buttons; switches from transparent to a blurred white bar after ~100px scroll; hamburger menu below 1200px.

· Present on all 29 routes. · appears on 29 routes · implemented by `src/components/Navbar.jsx`

**`shell.footer`** — Footer card: brand blurb + newsletter form, four link columns (Products, Explore, Resources, Company), legal/social row, hosted-in-Germany row, and the sticky ghost 'Primefold' wordmark revealed beneath it.

· Present on all 29 routes. · appears on 29 routes · implemented by `src/components/Footer.jsx`

### HERO

_Page-opening, above-the-fold block._

**`hero.home-carousel`** — Full-viewport 3-slide autoplay carousel (Platform / Experience Intelligence / Real Estate Intelligence) with 6s progress tabs, staggered text entrance and 0.6x scroll parallax.

· 1 route. · appears on 1 routes · implemented by `src/components/Hero.jsx`

**`hero.product-live-chat`** — Dark product hero: eyebrow badge, h1, lead, two CTAs and a typing 'Live Conversation' chat demo over a WebGL rays background; one hero template serves both intelligences via the product enum.

· 2 routes. · appears on 2 routes

**`hero.pricing`** — Plans hero: eyebrow, h1, lead, two CTAs, product and billing toggles and the three pricing cards (XI state) or one 'Explore Primefold RI' card (RI state).

· 1 route. · appears on 1 routes · implemented by `src/pages/plans/PlansHero.jsx + src/pages/plans/Segmented.jsx + src/pages/plans/ProductBadge.jsx + src/pages/plans/Tick.jsx + src/pages/plans/data.js`

**`hero.security-comet`** — Dark security hero with warm glow, eyebrow, h1, lead, Book a call and an animated three-ring comet graphic around a GDPR/fingerprint pill.

· 1 route. · appears on 1 routes · implemented by `src/pages/security/SecurityHero.jsx + src/pages/security/CometRing.jsx`

**`hero.company-stats`** — Company hero over a full-bleed photo: eyebrow, h1, lead with a bold clause, two CTAs and four glass stat cards.

· 1 route. · appears on 1 routes · implemented by `src/pages/company/CompanyHero.jsx`

**`hero.careers`** — Light careers hero: eyebrow, h1, lead, black 'See open roles' anchor button, and two shader-backed cards ('How you work', 'How we hire').

· 1 route. · appears on 1 routes · implemented by `src/pages/careers/CareersHero.jsx`

**`hero.index-intro`** — Index-page hero for the CMS lists: eyebrow, h1, lead and either a newsletter form (blog) or a black Book a call button (case studies).

· 2 routes. · appears on 2 routes · implemented by `src/pages/cms/shared.jsx + src/pages/Blog.jsx + src/pages/CaseStudies.jsx`

### FEATURES

_Product explanation and capability modules._

**`features.how-it-works`** — 'How a question becomes a next move' title stack plus the dark A1 Loop product demo: a 9-state animated loop (ask, read sources, understand, answer, act, trace).

· 1 route. · appears on 1 routes · implemented by `src/components/HowItWorks.jsx + how/A1Loop.jsx`

**`features.intelligence-cards`** — 'One engine' row of three intelligence product cards (XI live, RI beta, next planned) that widen on hover on desktop and become sticky stacked cards on tablet/phone.

· 1 route. · appears on 1 routes · implemented by `src/components/Intelligence.jsx`

**`features.solutions-carousel`** — 'Built for every team' horizontally scrolling team/use-case image cards with scroll-linked sideways drift and Explore arrow buttons.

· 1 route. · appears on 1 routes · implemented by `src/components/Solutions.jsx`

**`features.step-cards`** — 'Ask. Understand. Act.' three illustrated step cards; XI uses light animated illustrations, RI uses dark A1-style demo panels.

· 2 routes. · appears on 2 routes

**`features.use-cases`** — Sticky 'Used by' label beside a scroll-highlighted list of use cases (only one item at opacity 1 at a time).

· 2 routes. · appears on 2 routes

**`features.sources`** — 'Sources' block: left list of three trust points (connects in minutes, traceable, hosted in Germany) beside a Lottie (XI) or dark 'A3 Sources' loop (RI).

· 2 routes. · appears on 2 routes

**`features.solutions-tabs`** — 'Built for every team' tabbed panel (persona tabs) with an image card and a dark card showing marquee quote pills plus 'What you get'. Not the home carousel.

· 2 routes. · appears on 2 routes

**`features.loop-cards`** — 'The loop' four small cards explaining how the product learns a customer's vocabulary, definitions, judgment and workspace.

· 2 routes. · appears on 2 routes

**`features.comparison-table`** — Plan comparison table with sticky plan header and sticky category rows; shown only in the XI state of /plans.

· 1 route. · appears on 1 routes · implemented by `src/pages/plans/ComparisonTable.jsx + src/pages/plans/data.js`

**`features.info-card-grid`** — Section title row (eyebrow, H2, optional lead) over a grid of small icon+title+description info cards; used for plan trust ('In every plan'), security facts and company commitments. Variant selects the column count.

· 3 routes. · appears on 3 routes · implemented by `src/pages/shared-info/InfoCard.jsx + src/pages/shared-info/SectionTitle.jsx + src/pages/shared-info/MaskIcon.jsx + src/pages/plans/PlansTrust.jsx + src/pages/security/FourFacts.jsx + src/pages/company/Commitments.jsx`

**`features.faq-accordion`** — FAQ accordion: independent expandable cards (first open by default) under a title row with a lead.

· 1 route. · appears on 1 routes · implemented by `src/pages/plans/PlansFaq.jsx + src/pages/plans/data.js`

**`features.team-ticker`** — Team section: title row over an edge-to-edge auto-scrolling ticker of team cards (square photo, name, role).

· 1 route. · appears on 1 routes · implemented by `src/pages/company/Team.jsx + src/pages/company/team.css`

### PROOF

_Social proof and trust: logos, testimonials, outcomes, security._

**`proof.logo-ticker`** — Infinite horizontal customer-logo marquee at 50px/s with staggered logo fade-in.

· 1 route. · appears on 1 routes · implemented by `src/components/HowItWorks.jsx > LogoTicker`

**`proof.testimonials`** — Full-width dark testimonial carousel: large quote, person name/role, client logo, arrow + dot controls, 0.5s slide.

· 1 route. · appears on 1 routes · implemented by `src/components/Testimonials.jsx`

**`proof.trust`** — Trust block: list of security/compliance points with a 10s teal progress line next to an animated Lottie panel (hosting, GDPR, source tracing).

· 1 route. · appears on 1 routes · implemented by `src/components/Trust.jsx`

**`proof.outcomes`** — 'Real impact. Real outcomes.' dark customer outcome cards with rolling 80px numbers, outcome headline, person and client logo.

· 1 route. · appears on 1 routes · implemented by `src/components/Outcomes.jsx`

**`proof.trust-image-cards`** — Two shader-backed image cards with a dark bottom overlay and white headline + body (security trust statements).

· 1 route. · appears on 1 routes · implemented by `src/pages/security/TrustCards.jsx`

**`proof.case-study-stats`** — Three outcome stat cards (value + label) directly under the case-study banner. Values are customer-attributed claims.

· 3 routes. · appears on 3 routes · implemented by `src/pages/CaseStudy.jsx`

### CONVERSION

_Call-to-action blocks driving to Book a call._

**`conversion.cta-band`** — Dark rounded CTA card 'Ask your data. Get the answer.' with animated wave background and a white Book a call pill.

· Present on all 29 routes. · appears on 29 routes · implemented by `src/components/CTA.jsx`

**`conversion.contact-form`** — Two-column contact section: intro with three link cards (email, booking, LinkedIn) and a 'Send us a message' form card (name, work mail, company, optional phone with country picker, message, consent, submit).

· 1 route. · appears on 1 routes · implemented by `src/pages/contact/ContactIntro.jsx + src/pages/contact/ContactForm.jsx + src/pages/contact/PhoneField.jsx + src/pages/contact/countries.js`

### CONTENT

_Page body content: article, prose, cards, forms and other page-specific blocks._

**`content.open-roles`** — Open roles list (#roles): title block and static job rows with meta line, h5, description and a black Apply button.

· 1 route. · appears on 1 routes · implemented by `src/pages/careers/OpenRoles.jsx`

**`content.legal-header`** — Legal document opening: h1 title plus any preamble blocks before the first heading-bounded part (the whole imprint, which has no headings; the version line of data privacy).

· 3 routes. · appears on 3 routes · implemented by `src/pages/Legal.jsx + src/pages/legal/content.js + src/pages/legal/legal.css`

**`content.legal-part`** — One heading-bounded part of a legal document: a heading of the document's dominant level (h2 in terms of service, h4 in data privacy) and the blocks until the next heading of that level. Repeatable; imprint has none.

· 3 routes. · appears on 3 routes · implemented by `src/pages/Legal.jsx + src/pages/legal/content.js + src/pages/legal/legal.css`

**`content.card-grid`** — Responsive grid of linked cards (16:9 image, then title and meta); blog variant shows date + author, case-study variant shows a 'Read story' row.

· 2 routes. · appears on 2 routes · implemented by `src/pages/Blog.jsx + src/pages/CaseStudies.jsx + src/pages/cms/shared.jsx + src/pages/cms/cms.css`

**`content.article-header`** — Blog post opening: h1, divider, author + 'Last updated' meta row, 16:9 banner, and any intro blocks before the first chapter heading.

· 12 routes. · appears on 12 routes · implemented by `src/pages/BlogPost.jsx + src/pages/cms/shared.jsx + src/pages/cms/cms.css`

**`content.article-body`** — One chapter of a blog post body: a chapter heading (h2, or h3 where a post has no h2) and the rich-text blocks until the next chapter heading (paragraphs, lists, quote, images, video facade, in-body buttons). Repeatable.

· 12 routes. · appears on 12 routes · implemented by `src/pages/cms/RichText.jsx + src/pages/cms/cms.css`

**`content.case-study-header`** — Case-study opening: breadcrumb, h1, subtitle, divider, product/industry pills and the full-width banner.

· 3 routes. · appears on 3 routes · implemented by `src/pages/CaseStudy.jsx + src/pages/cms/shared.jsx + src/pages/cms/cms.css`

**`content.case-study-body`** — One chapter of a case-study story: an h6 eyebrow / h3 heading and the blocks until the next one (paragraphs, quote cards, numbered cards, video). Repeatable.

· 3 routes. · appears on 3 routes · implemented by `src/pages/cms/RichText.jsx + src/pages/cms/cms.css`

**`content.case-study-about`** — About-the-client block closing a case study: heading, image card (client imagery, client logo, description, website button) and an information card (employees / clients / industry / products in use).

· 3 routes. · appears on 3 routes · implemented by `src/pages/CaseStudy.jsx + src/pages/cms/shared.jsx`

**`content.not-found`** — 404 block: eyebrow, 404 h1, 'Nothing to see here.' h2, one line of copy and a black Back to homepage button.

· 1 route. · appears on 1 routes · implemented by `src/pages/NotFound.jsx`
