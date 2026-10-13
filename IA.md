# Primefold (primefold.ai) — information architecture

Source: https://primefold.ai/ (sitemap.xml + clone at src/)
Status: **draft — home measured, other templates pending recon** · production approved: **false**
29 routes · 13 templates · 23 unique sections

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
| `shell.footer` | SHELL | 13 | 29 | `src/components/Footer.jsx` | Present on all 29 routes. |
| `content.blog-post-body` | CONTENT | 1 | 12 | _not yet built_ | Blog post template only (12 routes). |
| `content.legal-body` | CONTENT | 1 | 3 | _not yet built_ | Legal document template only (3 routes). |
| `content.case-study-body` | CONTENT | 1 | 3 | _not yet built_ | Case study template only (3 routes). |
| `content.product-body` | CONTENT | 1 | 2 | _not yet built_ | Product (Intelligence) template only (2 routes). |
| `hero.home-carousel` | HERO | 1 | 1 | `src/components/Hero.jsx` | Home only (1 route). |
| `proof.logo-ticker` | PROOF | 1 | 1 | `src/components/HowItWorks.jsx > LogoTicker` | Home only (1 route), at the top of the How It Works block. |
| `features.how-it-works` | FEATURES | 1 | 1 | `src/components/HowItWorks.jsx + how/A1Loop.jsx` | Home only (1 route). |
| `features.intelligence-cards` | FEATURES | 1 | 1 | `src/components/Intelligence.jsx` | Home only (1 route). |
| `proof.testimonials` | PROOF | 1 | 1 | `src/components/Testimonials.jsx` | Home only (1 route). |
| `features.solutions-carousel` | FEATURES | 1 | 1 | `src/components/Solutions.jsx` | Home only (1 route). |
| `proof.trust` | PROOF | 1 | 1 | `src/components/Trust.jsx` | Home only (1 route). |
| `proof.outcomes` | PROOF | 1 | 1 | `src/components/Outcomes.jsx` | Home only (1 route). |
| `conversion.cta-band` | CONVERSION | 1 | 1 | `src/components/CTA.jsx` | Home only (1 route) confirmed; reuse on other templates pending recon. |
| `content.plans-body` | CONTENT | 1 | 1 | _not yet built_ | Plans template only (1 route). |
| `content.security-body` | CONTENT | 1 | 1 | _not yet built_ | Security template only (1 route). |
| `content.contact-body` | CONTENT | 1 | 1 | _not yet built_ | Contact template only (1 route). |
| `content.company-body` | CONTENT | 1 | 1 | _not yet built_ | Company template only (1 route). |
| `content.careers-body` | CONTENT | 1 | 1 | _not yet built_ | Careers template only (1 route). |
| `content.blog-index-body` | CONTENT | 1 | 1 | _not yet built_ | Blog index template only (1 route). |
| `content.case-studies-index-body` | CONTENT | 1 | 1 | _not yet built_ | Case studies index template only (1 route). |
| `content.not-found-body` | CONTENT | 1 | 1 | _not yet built_ | Not-found template only (1 route). |

**2 shared sections** appear in more than one template and belong in a component library.

**21 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

**12 sections have no `implementedBy` yet** — not necessarily missing, just not linked to a component in this pass: `content.blog-post-body`, `content.legal-body`, `content.case-study-body`, `content.product-body`, `content.plans-body`, `content.security-body`, `content.contact-body`, `content.company-body`, `content.careers-body`, `content.blog-index-body`, `content.case-studies-index-body`, `content.not-found-body`.

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
| 10 | CONVERSION | `conversion.cta-band` | page-local |
| 11 | SHELL | `shell.footer` | shared ×13 |

### Product (Intelligence) — `template.product`

2 routes · `/experience-intelligence`, `/realestate-intelligence` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.product-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Plans — `template.plans`

1 route · `/plans` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.plans-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Security — `template.security`

1 route · `/security` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.security-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Contact — `template.contact`

1 route · `/contact` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.contact-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Company — `template.company`

1 route · `/company` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.company-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Careers — `template.careers`

1 route · `/careers` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.careers-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Legal document — `template.legal`

3 routes · `/imprint`, `/data-privacy`, `/terms-of-service` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.legal-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Blog index — `template.blog-index`

1 route · `/blog` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.blog-index-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Blog post — `template.blog-post`

12 routes · `/blog/we-re-taking-real-estate-intelligence-to-expo-real-2026.-come-and-talk-to-your-portfolio`, `/blog/primefold-xi-speaks-german-now`, `/blog/we-rebuilt-our-website-primefold-ai`, `/blog/primefold-ri-is-here-real-estate-intelligence`, `/blog/nobody-asks-their-customers-anything-right-after-they-buy.-now-you-can-right-on-shopify.`, `/blog/how-we-built-sunday-s-survey-design-agent`, `/blog/meet-sunday-the-intelligence-layer-built-into-primefold-xi`, `/blog/design-and-reports-get-their-moment`, `/blog/the-insight-hub-is-about-to-get-sharper`, `/blog/primefold-xi-is-here`, `/blog/introducing-primefold---saypien-is-becoming-primefold`, `/blog/nas-invest-turned-tenant-insight-into-tenant-strength` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.blog-post-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Case studies index — `template.case-studies-index`

1 route · `/case-studies` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.case-studies-index-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Case study — `template.case-study`

3 routes · `/case-studies/gainback-primefold-xi`, `/case-studies/nas-primefold-xi-ri`, `/case-studies/dirts-primefold-xi` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.case-study-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### 404 — `template.not-found`

1 route · `/404` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.not-found-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

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

· Home only (1 route). · appears on 1 routes · implemented by `src/components/Hero.jsx`

### FEATURES

_Product explanation and capability modules._

**`features.how-it-works`** — 'How a question becomes a next move' title stack plus the dark A1 Loop product demo: a 9-state animated loop (ask, read sources, understand, answer, act, trace).

· Home only (1 route). · appears on 1 routes · implemented by `src/components/HowItWorks.jsx + how/A1Loop.jsx`

**`features.intelligence-cards`** — 'One engine' row of three intelligence product cards (XI live, RI beta, next planned) that widen on hover on desktop and become sticky stacked cards on tablet/phone.

· Home only (1 route). · appears on 1 routes · implemented by `src/components/Intelligence.jsx`

**`features.solutions-carousel`** — 'Built for every team' horizontally scrolling team/use-case image cards with scroll-linked sideways drift and Explore arrow buttons.

· Home only (1 route). · appears on 1 routes · implemented by `src/components/Solutions.jsx`

### PROOF

_Social proof and trust: logos, testimonials, outcomes, security._

**`proof.logo-ticker`** — Infinite horizontal customer-logo marquee at 50px/s with staggered logo fade-in.

· Home only (1 route), at the top of the How It Works block. · appears on 1 routes · implemented by `src/components/HowItWorks.jsx > LogoTicker`

**`proof.testimonials`** — Full-width dark testimonial carousel: large quote, person name/role, client logo, arrow + dot controls, 0.5s slide.

· Home only (1 route). · appears on 1 routes · implemented by `src/components/Testimonials.jsx`

**`proof.trust`** — Trust block: list of security/compliance points with a 10s teal progress line next to an animated Lottie panel (hosting, GDPR, source tracing).

· Home only (1 route). · appears on 1 routes · implemented by `src/components/Trust.jsx`

**`proof.outcomes`** — 'Real impact. Real outcomes.' dark customer outcome cards with rolling 80px numbers, outcome headline, person and client logo.

· Home only (1 route). · appears on 1 routes · implemented by `src/components/Outcomes.jsx`

### CONVERSION

_Call-to-action blocks driving to Book a call._

**`conversion.cta-band`** — Dark rounded CTA card 'Ask your data. Get the answer.' with animated wave background and a white Book a call pill.

· Home only (1 route) confirmed; reuse on other templates pending recon. · appears on 1 routes · implemented by `src/components/CTA.jsx`

### CONTENT

_Page body content; used here as a placeholder until a template's sections are measured._

**`content.product-body`** — Product (Intelligence) page body — section-level breakdown pending recon; spec will land in specs/product-pages.md.

· Product (Intelligence) template only (2 routes). · appears on 2 routes

**`content.plans-body`** — Plans page body — section-level breakdown pending recon; spec will land in specs/plans-security-contact-404.md.

· Plans template only (1 route). · appears on 1 routes

**`content.security-body`** — Security page body — section-level breakdown pending recon; spec will land in specs/plans-security-contact-404.md.

· Security template only (1 route). · appears on 1 routes

**`content.contact-body`** — Contact page body — section-level breakdown pending recon; spec will land in specs/plans-security-contact-404.md.

· Contact template only (1 route). · appears on 1 routes

**`content.company-body`** — Company page body — section-level breakdown pending recon; spec will land in specs/company-careers-legal.md.

· Company template only (1 route). · appears on 1 routes

**`content.careers-body`** — Careers page body — section-level breakdown pending recon; spec will land in specs/company-careers-legal.md.

· Careers template only (1 route). · appears on 1 routes

**`content.legal-body`** — Legal document page body — section-level breakdown pending recon; spec will land in specs/company-careers-legal.md.

· Legal document template only (3 routes). · appears on 3 routes

**`content.blog-index-body`** — Blog index page body — section-level breakdown pending recon; spec will land in specs/blog-case-studies.md.

· Blog index template only (1 route). · appears on 1 routes

**`content.blog-post-body`** — Blog post page body — section-level breakdown pending recon; spec will land in specs/blog-case-studies.md.

· Blog post template only (12 routes). · appears on 12 routes

**`content.case-studies-index-body`** — Case studies index page body — section-level breakdown pending recon; spec will land in specs/blog-case-studies.md.

· Case studies index template only (1 route). · appears on 1 routes

**`content.case-study-body`** — Case study page body — section-level breakdown pending recon; spec will land in specs/blog-case-studies.md.

· Case study template only (3 routes). · appears on 3 routes

**`content.not-found-body`** — 404 page body — section-level breakdown pending recon; spec will land in specs/plans-security-contact-404.md.

· Not-found template only (1 route). · appears on 1 routes
