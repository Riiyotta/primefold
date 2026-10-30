// Per-page content for the shared ProductPage template (specs/product-pages.md).
// Long prose the spec records only as structure uses neutral lorem-ipsum placeholders of matching length
// (marked PLACEHOLDER) — the live prose was intentionally not transcribed.

export const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'
const XI_DIR = '/assets/pages/experience-intelligence'
const RI_DIR = '/assets/pages/realestate-intelligence'

const LOOP_ICONS = ['vocabulary', 'definitions', 'judgment', 'workspace'].map((n) => `${XI_DIR}/icon-loop-${n}.svg`)

const SOURCE_ITEMS = (traceable) => [
  { mask: `${XI_DIR}/mask-sources-connects.svg`, title: 'Connects in minutes', desc: 'Plug in the channels you already use. No setup project, no IT ticket.' },
  { mask: `${XI_DIR}/mask-sources-traceable.svg`, title: 'Every answer is traceable', desc: traceable },
  {
    mask: `${XI_DIR}/mask-sources-hosted.svg`,
    title: 'Hosted in Germany',
    desc: 'Your data is stored on servers in Germany, built to GDPR requirements. We do not use your data to train AI models.',
  },
]

// §1.2 chat data (verbatim from source `Ze` / `Qe`)
const XI_CHAT = {
  title: 'Experience Intelligence',
  code: 'XI',
  accent: '#208374',
  prompts: [
    {
      q: 'Why did NPS drop in DACH last quarter?',
      ask: 'Why did NPS drop in DACH last quarter?',
      answer: 'Not the product - delivery communication. Missing dispatch notice on Hamburg-fulfilled orders drives it. Fix the notification, not the roadmap.',
      tiles: [
        { v: '-11 pts', l: 'NPS, DACH, Q2' },
        { v: '63%', l: 'of detractors cite delivery comms' },
        { v: '4.6', l: 'product quality, same cohort', star: true },
      ],
      chips: [
        { label: 'Pulse_Q2.csv', icon: 'sheets' },
        { label: 'Zendesk', icon: 'zendesk' },
        { label: 'Trustpilot', icon: 'trustpilot' },
      ],
    },
    {
      q: 'What should we fix first?',
      ask: 'Of everything customers complained about this quarter, what should we fix first?',
      answer: 'Dispatch notifications – widest reach, one owner, no roadmap slot needed. Checkout address validation is second.',
      tiles: [
        { v: '#1', l: 'Dispatch notifications' },
        { v: '38%', l: 'of negative feedback touched' },
        { v: '1 team', l: 'owns the fix' },
      ],
      chips: [
        { label: 'Priority model', icon: 'chart' },
        { label: 'Pulse_Q2.csv', icon: 'sheets' },
        { label: 'Zendesk', icon: 'zendesk' },
      ],
    },
    {
      q: 'Which accounts are about to churn?',
      ask: 'Which enterprise accounts are showing churn signals right now?',
      answer: 'One pattern across all nine: unresolved escalation, then silence. Seven are still reachable - close the loop this week.',
      tiles: [
        { v: '9 accounts', l: 'at elevated risk' },
        { v: '€1.4M', l: 'ARR exposed' },
        { v: '7', l: 'reachable this week' },
      ],
      chips: [
        { label: 'CRM', icon: 'cloud' },
        { label: 'Pulse_Q2.csv', icon: 'sheets' },
        { label: 'Call notes', icon: 'phone' },
      ],
    },
  ],
}

const RI_CHAT = {
  title: 'Real Estate Intelligence',
  code: 'RI',
  accent: '#EA7500',
  prompts: [
    {
      q: 'What is the WALT across the Frankfurt portfolio?',
      ask: 'What is the WALT across the Frankfurt portfolio, and where is it weakest?',
      answer: 'The average hides it: one tenant with a 2027 break carries two of the three weakest assets. Re-letting risk sits in Frankfurt-Ost.',
      tiles: [
        { v: '4.2 yrs', l: 'portfolio WALT' },
        { v: '3 assets', l: 'below 2.1 yrs' },
        { v: '€2.9M', l: 'rent exposed to one tenant' },
      ],
      chips: [
        { label: 'Lease_4.02.docx', icon: 'word' },
        { label: 'Rent roll Q2', icon: 'excel' },
        { label: 'Lease schedule', icon: 'doc' },
      ],
    },
    {
      q: 'Which leases have break options in 2027?',
      ask: 'Which leases have break options in 2027, and what rent is at stake?',
      answer: 'Four of the eleven need notice before 31 Dec 2026 — two of those sit below market rent, so renegotiation favours you.',
      tiles: [
        { v: '11 leases', l: 'with 2027 breaks' },
        { v: '€6.4M', l: 'passing rent at stake' },
        { v: '4', l: 'notice deadlines in 2026' },
      ],
      chips: [
        { label: 'Lease_4.02.docx', icon: 'word' },
        { label: '38 lease PDFs', icon: 'pdf' },
        { label: 'Market rent', icon: 'chart' },
      ],
    },
    {
      q: 'Does asset 4.02 justify the capex request?',
      ask: 'Does the €1.8M capex request on asset 4.02 justify itself?',
      answer: 'Not as submitted — most of the spend is envelope work that does not lift rent, and the 2027 break gates the re-let. Phase it.',
      tiles: [
        { v: '€0.7M', l: 'defensible now' },
        { v: '62%', l: 'of spend not rent-accretive' },
        { v: '2027', l: 'break gates the rest' },
      ],
      chips: [
        { label: 'Capex_4.02.pdf', icon: 'pdf' },
        { label: 'Lease_4.02.docx', icon: 'word' },
        { label: 'Valuation 2025', icon: 'doc' },
      ],
    },
  ],
}

// PLACEHOLDER prose (spec §2d: one paragraph, 1–3 sentences, ~20–30 words, 1 line @1440 in 800px)
const WHAT_BACK = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Nisi ut aliquip ex ea commodo consequat duis aute.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse. Cillum dolore eu fugiat nulla pariatur excepteur sint.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa. Qui officia deserunt mollit anim id est laborum et.',
]

export const XI = {
  key: 'xi',
  title: 'Experience Intelligence — Primefold',
  description:
    'Every survey, review, ticket and call read together — and answered as one prioritised decision your team can act on. Ask in plain language, act the same day.',
  hero: {
    badge: `${XI_DIR}/icon-xi-badge-20.svg`,
    label: 'Experience Intelligence',
    h1: 'Built to find the value in every voice.',
    p: 'XI brings every signal into one place. Ask, and get the analysis, the report, the strategy.',
    second: { label: 'Start free trial', href: 'https://xi.primefold.ai/auth/sign-in?next=/home' },
    gap: 48,
    left: 672,
    chat: 560,
    rays: 'teal',
    chatData: XI_CHAT,
  },
  steps: {
    h2end: 'in a conversation.',
    cards: [
      { label: '01 - Ask', h3: 'Ask in plain language', p: 'Ask the question you need answered, or build the survey to get it. XI handles the rest.' },
      // hard line break after "read" is in the live copy (visible at 390 and 1440)
      { label: '02 - Understand', h3: 'Reads every signal', p: ['Surveys, tickets, reviews and comments, read', 'together, in full context.'] },
      { label: '03 - Act', h3: 'Know what to do next', p: 'The answer, what to do first, and the evidence behind it. Prioritized by impact.' },
    ],
  },
  usedBy: ['Marketing', 'Customer Experience', 'Product', 'HR / People'],
  useCases: ['Survey creation & analysis', 'Churn detection', 'Campaign & concept testing', 'Brand tracking', 'Employee pulse', 'NPS scoring'],
  sources: {
    h2: 'XI reads the channels you already use.',
    // PLACEHOLDER (2–3 sentences, ~25 words, 2 lines @1440)
    p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore. Ut enim ad minim veniam quis.',
    spacer: 140,
    items: SOURCE_ITEMS('Click any citation to see the response it came from.'),
    lottie: `${XI_DIR}/0wnxkqSd8yM0mNqNViIMBD53E.json`,
  },
  solutions: {
    tabs: [
      {
        label: 'CX manager',
        p: "See what's driving churn, who it affects, and what to do next.",
        quotes: ['“What changed since the last survey?”', '“Which issues should we fix first?”', '“Which detractors need follow-up, and why?”'],
        img: `${XI_DIR}/T4r3OA3ib810aHqjuLi9sIekZKM.png`,
        tagline: 'Answers in minutes, not hours.',
        back: WHAT_BACK[0],
      },
      {
        label: 'Marketing manager',
        p: "Know what resonates, what doesn't, and what to say next.",
        quotes: ['“Which messages resonate most with new customers?”', '“What nearly stopped them from buying?”', '“What are customers saying we should talk about next?”'],
        img: `${XI_DIR}/oDu9rBQj2pjQjM50wLlU1MCgB8.png`,
        tagline: 'Answers in minutes, not hours.',
        back: WHAT_BACK[1],
      },
      {
        label: 'HR / People manager',
        p: "See what's happening across your teams, and know what to act on.",
        quotes: ['“What is driving attrition in engineering?”', '“Did the onboarding change work?”', '“Where is manager effectiveness slipping?”'],
        img: `${XI_DIR}/s1XiWILmhO3B0XHJDGmhFUf3sAU.png`,
        tagline: 'Answers in minutes, not hours.',
        back: WHAT_BACK[2],
      },
      {
        label: 'Product Manager',
        p: 'Talk to your users. Know what to build next, ranked by impact.',
        quotes: ['"Where do new users get stuck?"', '"Did the last release fix it?"', '"What should we build next, and why?"'],
        img: `${XI_DIR}/slBwYVOaDkn5GnPvuz0O86xwSY.png`,
        tagline: 'Answers in minutes, not hours.',
        back: WHAT_BACK[3],
      },
    ],
  },
  loop: {
    h2: 'XI intelligence learns your language with every answer.',
    // PLACEHOLDER (~35 words, 3 lines in 428px)
    p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
    cards: [
      { h3: 'Your vocabulary', p: 'Product names, segment labels and internal shorthand. Learned from your questions and answers, never guessed.' },
      { h3: 'Your definitions', p: '“Churn risk” means what your team means by it. Define it once and XI uses it consistently.' },
      { h3: 'Your judgment', p: 'Keep, dismiss or reword an answer. Your feedback shapes what XI prioritizes next.' },
      { h3: 'Your workspace', p: 'What XI learns about your business stays in your workspace. We do not use your data to train AI models.' },
    ].map((c, i) => ({ ...c, icon: LOOP_ICONS[i] })),
  },
  cta: 'xi',
}

export const RI = {
  key: 'ri',
  title: 'Real Estate Intelligence — Primefold',
  description:
    'Underwriting, rent rolls, leases and capex answered in one conversation — with the clause and line item behind every number. Built for asset managers.',
  hero: {
    badge: `${RI_DIR}/icon-ri-badge-20.svg`,
    label: 'Real Estate Intelligence',
    h1: 'Built to grow asset value.',
    // PLACEHOLDER (one paragraph, 2 sentences, ~25 words, 2 lines @1440)
    p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore. Dolore magna aliqua ut enim ad minim veniam nostrud.',
    second: { label: 'See how it works', href: '/realestate-intelligence#how-it-works' },
    gap: 56,
    left: 612,
    chat: 612,
    rays: 'orange',
    chatData: RI_CHAT,
  },
  steps: {
    // live (re-measured 2026-10-30): the RI heading now ends with a period, like XI
    h2end: 'in a conversation.',
    cards: [
      { label: '01 - Ask', h3: 'Ask in plain language', p: 'RI finds the relevant leases, amendments and rent rolls for you.' },
      // live (re-measured 2026-10-30): h3 reads "Read every document" and the p has a hard break after "agreement"
      { label: '02 - Understand', h3: 'Read every document', p: ['Every lease, rent roll and facility agreement', 'read in full context.'] },
      { label: '03 - Act', h3: 'Know what to do next', p: 'The recommendation, with every figure and clause traceable to its source. Clear next steps.' },
    ],
  },
  usedBy: ['Asset managers', 'Investment teams', 'Property managers'],
  useCases: ['Underwriting', 'Lease abstraction', 'Lease break & notice tracking', 'Covenant monitoring', 'Capex planning', 'Investor reporting'],
  sources: {
    h2: 'RI reads the channels you already have.',
    // PLACEHOLDER (2–3 sentences, ~25 words, 2 lines @1440)
    p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore. Ut enim ad minim veniam.',
    spacer: 75,
    items: SOURCE_ITEMS('Click any citation to see the clause or line item it came from.'),
  },
  solutions: {
    tabs: [
      {
        label: 'Asset manager',
        p: 'Know where risk sits before it reaches the board pack.',
        quotes: ['“Where is re-letting risk concentrated?”', '“Which notice deadlines fall in the next 12 months?”', '“Which tenants carry the most lease risk?”'],
        img: `${RI_DIR}/fPL5khSQQDMO551QMFXPouhArqM.png`,
        tagline: 'Answers in minutes, not hours.',
        back: WHAT_BACK[0],
      },
      {
        label: 'Investment manager',
        p: 'Underwrite a new asset from the data room, not from a summary someone typed.',
        quotes: ['“Does the rent roll match the leases?”', '“How exposed is the asset if its two largest tenants leave?”', "“Where does the seller's model overstate income?”"],
        img: `${RI_DIR}/94wMcHYvQKN0EvsPTHwC63Mey4.webp`,
        tagline: 'First-pass underwriting in minutes, not hours.',
        back: WHAT_BACK[1],
      },
      {
        label: 'Property manager',
        p: 'Answer tenant questions without digging through leases.',
        quotes: ['“Who pays for the roof repair under this lease?”', '“When is the next rent indexation?”', '“What was agreed in the latest amendment?”'],
        img: `${RI_DIR}/nWq4TnjSO2IQxV8JX3SqO9paY.webp`,
        tagline: 'Answers in minutes, not hours.',
        back: WHAT_BACK[2],
      },
    ],
  },
  loop: {
    h2: 'RI learns your vocabulary with every answer.',
    // PLACEHOLDER (~35 words, 3 lines in 428px)
    p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
    cards: [
      { h3: 'Your document types', p: 'Product names, segment labels and internal shorthand. Learned from your questions and answers, never guessed.' },
      { h3: 'Your definitions', p: 'WALT, passing rent, NOI: computed your way, with the method visible and editable.' },
      { h3: 'Your thresholds', p: 'What counts as concentration risk in your book, not a generic benchmark.' },
      { h3: 'Your workspace', p: 'Documents stay in your workspace. We do not use your data to train AI models.' },
    ].map((c, i) => ({ ...c, icon: LOOP_ICONS[i] })),
  },
  cta: 'main',
}
