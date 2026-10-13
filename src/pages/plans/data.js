// Verbatim copy from specs/plans-security-contact-404.md §1
export const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'
export const XI_APP = 'https://xi.primefold.ai/'

export const PLANS = [
  {
    name: 'Free Trial',
    tag: '30 days',
    tagBg: 'rgb(250,250,249)',
    bg: 'rgb(250,249,248)',
    desc: 'Full product, unrestricted, for a month.',
    price: '€0',
    suffix: '/ for 30 days',
    button: { variant: 'white', label: 'Start free for 30 days', href: XI_APP },
    features: [
      ['Unlimited users'],
      ['Unlimited live surveys'],
      ['Everything in Business'],
      ['Upgrade or export your data'],
      ['Onboarding call'],
      ['Priority support'],
    ],
    table: { monthly: '€0 for 30 days, no card required', annual: '€0 for 30 days, no card required' },
  },
  {
    name: 'Business',
    tag: 'Popular for SMEs',
    tagBg: '#fff',
    bg: 'transparent',
    desc: 'For a team running live research continuously.',
    price: 'On request',
    suffix: '',
    button: { variant: 'black', label: 'Book a call', href: CALENDLY, external: true },
    features: [
      ['Up to 3 users in a workspace'],
      ['Up to 5 live surveys'],
      ['Survey creation with AI'],
      ['Distribution via QR code, link, embed or Shopify'],
      ['Survey data analysis with AI'],
      ['Workspace organization & user management'],
      ['Survey templates'],
      ['Multilingual surveys', 'Q2'],
      ['Onboarding call'],
      ['Priority support'],
    ],
    table: { monthly: 'Upon request, billed monthly', annual: '€408 per month, billed annually' },
    gradient: true,
  },
  {
    name: 'Enterprise',
    tag: null,
    bg: 'rgb(250,249,248)',
    desc: 'For organizations requiring a dedicated security environment.',
    price: 'Custom',
    suffix: '',
    button: { variant: 'white', label: 'Book a call', href: CALENDLY, external: true },
    features: [
      ['Unlimited users & workspaces'],
      ['Unlimited live surveys'],
      ['Everything in Business'],
      ['Private hosting'],
      ['Individual tools & custom API integrations'],
      ['Workflow automations', 'Q3/Q4'],
      ['RBAC, audit-ready controls, data isolation & SLAs', 'Q3/Q4'],
      ['APIs & SDK', 'Q3/Q4'],
      ['Priority support'],
      ['Onboarding call'],
      ['Dedicated support'],
    ],
    table: { monthly: 'Get a custom quote, billed monthly', annual: 'Get a custom quote, billed annually' },
  },
]

// Comparison table (§1.3). true = tick, false = cross, string = text value.
const Y = true
const N = false
export const GROUPS = [
  { title: 'Usage', rows: [
    ['Users', 'Unlimited', 'Up to 3', 'Unlimited'],
    ['Live surveys', 'Unlimited', 'Up to 5', 'Unlimited'],
    ['Historical data retention', '30 days', 'Unlimited', 'Unlimited'],
  ] },
  { title: 'Build & ask', rows: [
    ['Survey creation with AI', Y, Y, Y],
    ['Survey templates', Y, Y, Y],
    ['Distribution: QR, link, embed, Shopify', Y, Y, Y],
    ['Multilingual surveys', 'Q2', 'Q2', 'Q2'],
    ['Import external survey data', Y, Y, Y],
  ] },
  { title: 'Understand & act', rows: [
    ['AI analysis with traceable evidence', Y, Y, Y],
    ['One-click stakeholder reports', Y, Y, Y],
    ['Shared workspaces & role-based access', Y, Y, Y],
    ['Workflow automations', N, N, 'Q3/Q4'],
    ['APIs & SDK', N, N, 'Q3/Q4'],
  ] },
  { title: 'Security & control', rows: [
    ['EU hosting, Frankfurt', Y, Y, Y],
    ['GDPR-compliant processing', Y, Y, Y],
    ['Never trained on your data', Y, Y, Y],
    ['Private hosting', N, N, Y],
    ['RBAC, audit controls, data isolation, SLAs', N, N, 'Q3/Q4'],
  ] },
  { title: 'Support', rows: [
    ['Onboarding call', Y, Y, Y],
    ['Priority support', Y, Y, Y],
    ['Dedicated support contact', N, N, Y],
  ] },
]

export const FAQ = [
  {
    q: 'What happens when the trial ends?',
    a: ['Nothing disappears. Move to a paid plan and carry on, or export your data and close the workspace. Your responses, analyses, reports and documents come with you.'],
  },
  {
    q: 'Is the trial a reduced version of the product?',
    // Placeholder prose of matching length (spec records structure only: 2 paragraphs, ~55 words).
    a: [
      'Placeholder answer. This paragraph stands in for the live copy and describes, in neutral terms, what the trial includes and how it compares with the paid plans.',
      'Placeholder answer. This second paragraph stands in for the live copy that compares the trial length for each product and how the trial period is scoped.',
    ],
  },
  {
    q: 'Can we start with one product and add the other later?',
    a: ['Yes. Experience Intelligence and Real Estate Intelligence run on the same engine, so adding the second is a licensing change, not a migration. Your workspace, users and permissions carry over.'],
  },
  {
    q: 'Where does our data live, and is it used for training?',
    a: ['Your data is hosted within the EU. Names, IPs and responses are stored separately. Data is not used to train shared models, on any plan.'],
  },
  {
    q: 'How is a quarter marker (Q2, Q3/Q4) different from a shipped feature?',
    a: ['A quarter marker is a commitment on the roadmap, not something you can use today. We label it so you can plan around it rather than discover it later. Everything without a marker works now.'],
  },
  {
    q: 'Do you offer discounts for nonprofits or research?',
    a: ["Yes, on a case-by-case basis. Tell us a little about your work and we'll come back with an offer."],
  },
]
