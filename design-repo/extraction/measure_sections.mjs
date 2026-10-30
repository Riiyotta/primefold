// measure_sections.mjs - re-measures every section's rendered height at 1440px for every route.
//
// Optional re-measure tool for the wrapper gate (extraction/wrapper_gate.py). It never runs inside verify_all:
// verify_all reads the recorded numbers from extraction/measured-values.json -> sectionHeights.
//
// Requirements (nothing machine-specific is stored in this repo):
//   * a built + served clone, e.g.  npx vite build --outDir <dir> && npx vite preview --outDir <dir> --port <port>
//   * Playwright: PLAYWRIGHT_MODULE=<path to playwright/index.mjs>  (or a resolvable "playwright" package)
//   * BASE_URL=http://localhost:<port>
//
// Usage:  BASE_URL=... PLAYWRIGHT_MODULE=... node extraction/measure_sections.mjs > measured.json
//
// Method: the fixed navbar (shell) takes no page height. In-flow units are the children of #root, with <main> and any
// wrapper <div> that directly contains a <section> expanded. Units are then mapped to the template's node list in
// order; decomposed long-form sections (legal / article / case study) are split at their real heading boundaries,
// i.e. each heading of the split level starts a new part and the part ends where the next one starts.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const BASE = process.env.BASE_URL;
if (!BASE) throw new Error('set BASE_URL (the served clone)');
const VIEWPORT = { width: 1440, height: 900 };
const routes = JSON.parse(readFileSync(join(ROOT, 'templates/routes.json'))).routes;
const templates = Object.fromEntries(JSON.parse(readFileSync(join(ROOT, 'templates/templates.json'))).templates.map((t) => [t.id, t]));

function measurePage(templateId) {
  const R = (el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), h: Math.round(r.height) }; };
  const root = document.getElementById('root');
  const header = root.querySelector(':scope > header');
  const footer = root.querySelector(':scope > footer');
  const units = [];
  const expand = (el) => {
    for (const c of el.children) {
      if (c === header || c === footer) continue;
      const cs = getComputedStyle(c);
      if (cs.position === 'fixed' || c.getBoundingClientRect().height < 1) continue;
      const hasSection = [...c.children].some((k) => k.tagName === 'SECTION');
      if (c.tagName === 'MAIN' || (c.tagName === 'DIV' && hasSection)) expand(c);
      else units.push(c);
    }
  };
  expand(root);
  const box = (el) => ({ ...R(el) });
  const span = (top, bottom) => ({ top, h: bottom - top });
  // split a container at its own direct-child headings of the dominant level (the most frequent of h2..h6)
  const splitAt = (container, levels, start, end) => {
    const kids = [...container.children];
    const count = {};
    kids.forEach((k) => { if (levels.includes(k.tagName)) count[k.tagName] = (count[k.tagName] || 0) + 1; });
    const lvl = Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0];
    const heads = kids.filter((k) => k.tagName === lvl).map((k) => R(k).top);
    const parts = heads.map((t, i) => span(t, i + 1 < heads.length ? heads[i + 1] : end));
    return { level: lvl, preambleEnd: heads[0] ?? end, parts, start };
  };
  const out = { pageHeight: document.documentElement.scrollHeight, nodes: [] };
  const push = (section, b, extra = {}) => out.nodes.push({ section, top: b.top, heightPx: b.h, ...extra });
  push('shell.navbar', box(header), { inFlow: false, note: 'position:fixed - takes no page height' });
  const tail = units[units.length - 1]; // the CTA band is always the last in-flow unit
  const T = templateId;
  if (T === 'template.home') {
    const [hero, how, intel, testi, sol, trust, outc] = units;
    const ticker = how.querySelector('.pf-ticker');
    const tk = R(ticker), hw = R(how);
    push('hero.home-carousel', box(hero));
    push('proof.logo-ticker', span(hw.top, tk.top + tk.h), { note: 'rendered inside the how-it-works <section>; measured as its own band' });
    push('features.how-it-works', span(tk.top + tk.h, hw.top + hw.h));
    push('features.intelligence-cards', box(intel));
    push('proof.testimonials', box(testi));
    push('features.solutions-carousel', box(sol));
    push('proof.trust', box(trust));
    push('proof.outcomes', box(outc));
  } else if (T === 'template.legal') {
    const sec = units[0];
    const prose = sec.querySelector('.legal-prose');
    const s = R(sec);
    const sp = splitAt(prose, ['H2', 'H3', 'H4'], s.top, s.top + s.h);
    push('content.legal-header', span(s.top, sp.preambleEnd), { note: `title + preamble before the first ${sp.level}` });
    sp.parts.forEach((p, i) => push('content.legal-part', p, { part: i + 1, splitLevel: sp.level }));
  } else if (T === 'template.blog-post') {
    const sec = units[0];
    const rt = sec.querySelector('.cms-rt');
    const s = R(sec);
    const sp = splitAt(rt, ['H2', 'H3'], s.top, s.top + s.h);
    push('content.article-header', span(s.top, sp.preambleEnd), { note: 'h1, author/meta row, banner and any preamble before the first chapter heading' });
    sp.parts.forEach((p, i) => push('content.article-body', p, { part: i + 1, splitLevel: sp.level }));
  } else if (T === 'template.case-study') {
    const sec = units[0];
    const s = R(sec);
    const kids = [...sec.children];
    const stats = kids[2], body = kids[3];
    const rt = body.querySelector('.cms-rt');
    const about = body.lastElementChild;
    push('content.case-study-header', span(s.top, R(stats).top));
    push('proof.case-study-stats', span(R(stats).top, R(body).top));
    const sp = splitAt(rt, ['H6', 'H3'], R(body).top, R(about).top);
    if (sp.preambleEnd > R(body).top) sp.parts.unshift(span(R(body).top, sp.preambleEnd));
    sp.parts.forEach((p, i) => push('content.case-study-body', p, { part: i + 1, splitLevel: sp.level }));
    push('content.case-study-about', span(R(about).top, s.top + s.h));
  } else if (T === 'template.product') {
    // hero <section>, then the content sheet's single #how-it-works <section> holding the five feature sections as
    // direct children. Its scroll-linked translate(80px,80px) is cleared while measuring so tops are un-offset.
    const [hero, how] = units;
    const prev = how.style.transform;
    how.style.transform = 'none';
    push('hero.product-live-chat', box(hero));
    const kids = [...how.children].filter((c) => c.getBoundingClientRect().height >= 1);
    const order = window.__NODES.filter((n) => n.startsWith('features.'));
    if (kids.length !== order.length) return { error: `feature unit count ${kids.length} != template nodes ${order.length}` };
    order.forEach((n, i) => push(n, box(kids[i])));
    how.style.transform = prev;
  } else {
    const order = window.__NODES.filter((n) => !n.startsWith('shell.') && n !== 'conversion.cta-band');
    const inflow = units.slice(0, -1);
    if (inflow.length !== order.length) return { error: `unit count ${inflow.length} != template nodes ${order.length}`, units: inflow.map((u) => u.tagName + ':' + R(u).h) };
    order.forEach((n, i) => push(n, box(inflow[i])));
  }
  push('conversion.cta-band', box(tail));
  push('shell.footer', box(footer), { note: 'footer (shell): excluded from the share gate' });
  return out;
}

const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT });
const result = { viewport: VIEWPORT.width, measuredWith: 'headless Chromium via Playwright, extraction/measure_sections.mjs', routes: {} };
for (const r of routes) {
  await page.goto(BASE + r.path, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((f) => setTimeout(f, 40)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(600);
  const nodes = templates[r.template].nodes.map((n) => n.section);
  await page.evaluate((n) => { window.__NODES = n; }, nodes);
  result.routes[r.path] = { template: r.template, ...(await page.evaluate(measurePage, r.template)) };
}
await browser.close();
console.log(JSON.stringify(result, null, 1));
