// Legal page content (specs/company-careers-legal.md §C3).
//
// Headings are verbatim from the spec. Body copy is PLACEHOLDER only, sized to the recorded
// paragraph/list counts and approximate word counts — replace with the real legal text.
//
// Block shapes (rendered in order, styled by .legal-prose in ./legal.css):
//   { t: 'p', html }                 paragraph; `html` may contain <strong>, <em>, <a href>, <br>
//   { t: 'empty' }                   empty paragraph (a lone <br>, one 24px line)
//   { t: 'h2' | 'h3' | 'h4' | 'h6', html, extraLines? }
//                                    heading; extraLines = trailing empty lines from a <br> in the original
//                                    (DP h4s). Wrap DP h4 text in <strong> for the 900 (faux-bold) preset.
//   { t: 'ul' | 'ol', items: [html] } list (ol renders a. b. c.)
//   { t: 'spacer' }                  DP's empty 64/72 h1 → 72px blank block
//
// Paste real text by replacing the lorem()/fill helpers with literal strings, e.g.
//   { t: 'p', html: 'We welcome you to our website…' }

const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore ' +
  'magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
  'consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur ' +
  'excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'
).split(' ')

let cursor = 0
// Deterministic lorem-style filler of about `n` words, split into sentences.
export function lorem(n) {
  const out = []
  let sentence = []
  const target = () => 9 + ((cursor * 7) % 8) // 9..16 words per sentence
  let len = target()
  for (let i = 0; i < Math.max(1, n); i++) {
    sentence.push(WORDS[cursor++ % WORDS.length])
    if (sentence.length >= len || i === n - 1) {
      const s = sentence.join(' ')
      out.push(s[0].toUpperCase() + s.slice(1) + '.')
      sentence = []
      len = target()
    }
  }
  return out.join(' ')
}

const P = (words) => ({ t: 'p', html: lorem(words) })
const LABEL = { t: 'p', html: '<strong>Placeholder label</strong>' }
const LINE = { t: 'p', html: 'Placeholder line' }
const SPACER = { t: 'spacer' }
const split = (count, total) => Array.from({ length: count }, () => Math.max(1, Math.round(total / count)))
const paras = (count, total) => split(count, total).map(P)
const list = (t, count, total) => ({ t, items: split(count, total).map((w) => lorem(w)) })

// One DP/ToS section. `p` = [count, words]; `labels` interleave before paragraphs (short label p);
// `lines` = trailing one-line p; `lists` go after the first paragraph.
function section(heading, { p, labels = 0, lines = 0, lists = [], spacer = false } = {}) {
  const ps = p ? paras(p[0], p[1]) : []
  const body = []
  let l = labels
  ps.forEach((para, i) => {
    if (l > 0) { body.push(LABEL); l-- }
    body.push(para)
    if (i === 0) lists.forEach((li) => body.push(li))
  })
  if (!ps.length) lists.forEach((li) => body.push(li))
  while (l-- > 0) body.push(LABEL)
  for (let i = 0; i < lines; i++) body.push(LINE)
  return [heading, ...body, ...(spacer ? [SPACER] : [])]
}

const h2 = (html) => ({ t: 'h2', html })
const h3 = (html) => ({ t: 'h3', html })
const h4 = (html, extraLines = 0) => ({ t: 'h4', html, extraLines })

// ------------------------------------------------------------------ /imprint
const imprint = {
  title: 'Imprint',
  docTitle: 'Imprint — Primefold',
  description: 'Legal notice (Impressum) for saypien GmbH, the company behind Primefold. Registered in Berlin, Germany.',
  bodyGap: 16,
  blocks: [
    { t: 'p', html: '<strong>Legal Notice (Impressum)</strong>' },
    { t: 'p', html: '<strong>Information pursuant to § 5 DDG:</strong>' },
    { t: 'p', html: '[Company name]<br>[Street and number]<br>[Postal code and city]<br>[Country]' },
    {
      t: 'p',
      html: 'Email: <a href="mailto:support@primefold.ai">support@primefold.ai</a><br><strong>Website:</strong> <a href="http://www.saypien.io/">www.primefold.ai</a>',
    },
    { t: 'p', html: '<strong>Commercial Register:</strong> [Register court]<br><strong>Registration Number:</strong> [Registration number]' },
    { t: 'p', html: '<strong>Managing Directors authorized to represent the company:</strong><br>[Managing director names]' },
    { t: 'p', html: '<strong>VAT Identification Number pursuant to § 27 UStG:</strong><br>[VAT ID]' },
  ],
}

// ------------------------------------------------------------------ /data-privacy
const dataPrivacy = {
  title: 'Data Privacy',
  docTitle: 'Data Privacy — Primefold',
  description: 'How Primefold collects, processes and protects personal data — GDPR-compliant processing, EU hosting and your rights as a data subject.',
  bodyGap: 32,
  blocks: [
    { t: 'p', html: 'DSE primefold | [date] | v2' },
    { t: 'empty' },
    ...section(h3('Privacy Policy'), { p: [1, 60] }),
    ...section(h4('Controller for processing according to GDPR'), { p: [1, 35], lines: 5, spacer: true }),
    ...section(h4('Data protection officer'), { lines: 7, spacer: true }),
    ...section(h4('What are personal data?'), { p: [1, 63], spacer: true }),
    ...section(h4('Scope of anonymous data collection and data processing'), { p: [1, 66], spacer: true }),
    ...section(h4('Legal basis for the processing of personal data'), { lists: [list('ol', 5, 190)], spacer: true }),
    ...section(h4('Use of cookies'), { p: [2, 271], spacer: true }),
    ...section(h4('Creation of log files'), { p: [1, 104], spacer: true }),
    ...section(h4('Duration of storage of personal data'), { p: [1, 35], spacer: true }),
    ...section(h4('Contact opportunities'), { p: [1, 240], spacer: true }),
    ...section(h4('Newsletter'), { p: [1, 255], spacer: true }),
    ...section(h4('Routine deletion and blocking of personal data'), { p: [1, 85], spacer: true }),
    ...section(h4('Rights of the data subject'), { p: [1, 31], spacer: true }),
    ...section(h4('Right of access by the data subject acc. to Art. 15 GDPR'), { p: [2, 80], lists: [list('ol', 8, 155)], spacer: true }),
    ...section(h4('Right to rectification acc. to Art. 16 GDPR'), { p: [1, 36], spacer: true }),
    ...section(h4('Right to erasure acc. to Art. 17 GDPR'), { p: [3, 116], lists: [list('ol', 6, 147), list('ol', 5, 134)], spacer: true }),
    ...section(h4('Right to restriction of processing acc. to Art. 18 GDPR'), { p: [2, 102], lists: [list('ol', 4, 108)], spacer: true }),
    ...section(h4('Notification obligation regarding rectification or erasure of personal data or restriction of processing acc. to Art. 19 GDPR'), { p: [1, 61], spacer: true }),
    ...section(h4('Right to data portability acc. to Art. 20 GDPR'), { p: [1, 54], lists: [list('ol', 2, 119)], spacer: true }),
    ...section(h4('Right of objection acc. to Art. 21 GDPR'), { p: [1, 178], spacer: true }),
    ...section(h4('Right to revoke the declaration of consent under data protection law pursuant to Art. 7 (3) GDPR'), { p: [1, 40], spacer: true }),
    ...section(h4('Right to lodge a complaint with a supervisory authority acc. to Art. 77 GDPR'), { p: [1, 85], spacer: true }),
    ...section(h4('Automated decision in individual cases including profiling'), { p: [3, 143], lists: [list('ol', 3, 57)], spacer: true }),
    ...section(h4('Integration of other third-party services and content'), { p: [3, 269], lines: 3, spacer: true }),
    ...section(h4('Data transmission to third countries'), { p: [4, 328], spacer: true }),
    ...section(h4('Applications'), { p: [1, 399], spacer: true }),
    ...section(h4('Analytics, marketing and customer communications'), { p: [1, 104], spacer: true }),
    ...section(h4('Calendly'), { p: [7, 398], labels: 12 }),
    ...section(h4('Google Analytics 4', 2), { p: [8, 487], labels: 9 }),
    ...section(h4('Hubspot', 1), { p: [10, 510], labels: 9 }),
    ...section(h4('Meta Pixel', 2), { p: [8, 461], labels: 11, lists: [list('ul', 3, 403)] }),
    ...section(h4('Safety', 1), { p: [1, 54] }),
    ...section(h4('Conclusion', 1), { p: [1, 29], spacer: true }),
  ],
}

// ------------------------------------------------------------------ /terms-of-service
const terms = {
  title: 'Terms of Service',
  docTitle: 'Terms of Service — Primefold',
  description: "The legal terms governing your use of Primefold's products and services, including subscriptions, billing and acceptable use.",
  bodyGap: 32,
  blocks: [
    { t: 'h6', html: 'Last updated 2 April 2026' },
    ...section(h2('AGREEMENT TO OUR LEGAL TERMS'), { p: [8, 346] }),
    ...section(h2('1. OUR SERVICES'), { p: [1, 87] }),
    h2('2. INTELLECTUAL PROPERTY RIGHTS'),
    ...section(h3('Our intellectual property'), { p: [3, 103] }),
    ...section(h3('Your use of our Services'), { p: [5, 206], lists: [list('ul', 3, 30)] }),
    ...section(h3('Your submissions and contributions'), { p: [9, 501], lists: [list('ul', 4, 128)] }),
    ...section(h3('Copyright infringement'), { p: [1, 37] }),
    ...section(h2('3. USER REPRESENTATIONS'), { p: [2, 153] }),
    ...section(h2('4. USER REGISTRATION'), { p: [1, 57] }),
    ...section(h2('5. PURCHASES AND PAYMENT'), { p: [4, 287], lines: 1, lists: [list('ul', 3, 3)] }),
    h2('6. SUBSCRIPTIONS'),
    ...section(h3('Billing and Renewal'), { p: [1, 61] }),
    ...section(h3('Free Trial'), { p: [1, 32] }),
    ...section(h3('Cancellation'), { p: [1, 44] }),
    ...section(h3('Fee Changes'), { p: [1, 25] }),
    ...section(h2('7. PROHIBITED ACTIVITIES'), { p: [1, 43], lines: 1, lists: [list('ul', 23, 540)] }),
    ...section(h2('8. USER GENERATED CONTRIBUTIONS'), { p: [2, 140], lists: [list('ul', 13, 314)] }),
    ...section(h2('9. CONTRIBUTION LICENSE'), { p: [4, 334] }),
    ...section(h2('10. THIRD-PARTY WEBSITES AND CONTENT'), { p: [1, 322] }),
    ...section(h2('11. SERVICES MANAGEMENT'), { p: [1, 141] }),
    ...section(h2('12. PRIVACY POLICY'), { p: [1, 102] }),
    ...section(h2('13. COPYRIGHT INFRINGEMENTS'), { p: [1, 110] }),
    ...section(h2('14. TERM AND TERMINATION'), { p: [2, 188] }),
    ...section(h2('15. MODIFICATIONS AND INTERRUPTIONS'), { p: [2, 181] }),
    ...section(h2('16. GOVERNING LAW'), { p: [1, 112] }),
    h2('17. DISPUTE RESOLUTION'),
    ...section(h3('Informal Negotiations'), { p: [1, 78] }),
    ...section(h3('Binding Arbitration'), { p: [1, 100] }),
    ...section(h3('Restrictions'), { p: [1, 85] }),
    ...section(h3('Exceptions to Informal Negotiations and Arbitration'), { p: [1, 130] }),
    ...section(h2('18. CORRECTIONS'), { p: [1, 49] }),
    ...section(h2('19. DISCLAIMER'), { p: [1, 319] }),
    ...section(h2('20. LIMITATIONS OF LIABILITY'), { p: [1, 165] }),
    ...section(h2('21. INDEMNIFICATION'), { p: [1, 184] }),
    ...section(h2('22. USER DATA'), { p: [1, 101] }),
    ...section(h2('23. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES'), { p: [1, 131] }),
    ...section(h2('24. MISCELLANEOUS'), { p: [1, 231] }),
    ...section(h2('25. CONTACT US'), { p: [1, 23] }),
    { t: 'p', html: '[Company name]<br>[Street and number]<br>[Postal code and city]<br>[Country]<br>[Email address]' },
  ],
}

export default { imprint, 'data-privacy': dataPrivacy, 'terms-of-service': terms }
