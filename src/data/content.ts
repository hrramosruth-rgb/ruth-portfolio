// Single source of copy. Facts come from Ruth's résumé, except where a project is marked
// `supplied` (the requester's addition, not on the résumé): for those, only public facts about the
// product are stated — no role, dates or results. Do not add claims neither source makes.

export type Link = { label: string; href: string };
export type Highlight = { lead: string; text: string };
export type Figure = { value: number; prefix?: string; suffix?: string; label: string };
export type Segment = { text: string; em?: boolean };
export type CoverKind =
  | "airrange"
  | "manhattan"
  | "albertsons"
  | "search"
  | "personalization"
  | "components"
  | "touch"
  | "shopify";

export const WORK_TAGS = ["Commerce", "Python", "SaaS", "Interfaces"] as const;
export type WorkTag = (typeof WORK_TAGS)[number];

export type Project = {
  slug: string;
  index: string;
  title: string;
  titleItalic?: string;
  context: string;
  company?: string;
  role?: string;
  period?: string;
  years?: string;
  location?: string;
  summary: string;
  description: string;
  link?: Link;
  stack: string[];
  highlights: Highlight[];
  figures: Figure[];
  cover: CoverKind;
  /** Filter tags for the work gallery. */
  tags: WorkTag[];
  /** Added by the requester; not on the résumé. */
  supplied?: boolean;
  /** Renders the storefront grid on the case study. */
  stores?: boolean;
};

export type Storefront = {
  slug: string;
  name: string;
  category: string;
  platform: string;
  url: string;
  domain: string;
  summary: string;
  image: string;
};

export type Discipline = { index: string; title: string; items: string[] };
export type Role = {
  period: string;
  org: string;
  role: string;
  location: string;
  description: string;
  /** Slugs of the projects that came out of this role. */
  projects: string[];
  /** The résumé's "Key project" for this role, if it names one. */
  keyProject?: string;
};

export const PROFILE = {
  name: "Ruth Ramos",
  firstName: "Ruth",
  lastName: "Ramos",
  role: "Full Stack Developer",
  stackLine: "React · Node.js · Python",
  title: "Ruth Ramos — Full Stack Developer",
  description:
    "Ruth Ramos is a full stack developer in Madrid building customer-facing products end to end — React and Next.js interfaces, Node.js and Python services, and the cloud that keeps them fast.",
  location: "Madrid, Spain",
  city: "Madrid",
  timeZone: "Europe/Madrid",
  availability: "Open to new roles",
  email: "hrramosruth@gmail.com",
  statement: [
    { text: "I build customer-facing products end to end — the " },
    { text: "interfaces", em: true },
    { text: " people touch, the " },
    { text: "services", em: true },
    { text: " and data behind them, and the cloud that keeps them fast. From a no-code SaaS platform to one of America's largest retailers" },
  ] satisfies Segment[],
} as const;

export const LINKS = {
  email: { label: PROFILE.email, href: `mailto:${PROFILE.email}` },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/ruth-ramos-0771153b8" },
  github: { label: "GitHub", href: "https://github.com/hrramosruth-rgb" },
} satisfies Record<string, Link>;

export const DISCIPLINES: Discipline[] = [
  {
    index: "00 — 1",
    title: "Frontend",
    items: ["React, Next.js, Redux", "Tailwind CSS, Material UI", "Reusable component libraries", "Shopify & Hydrogen storefronts"],
  },
  {
    index: "00 — 2",
    title: "Backend & Python",
    items: ["Python — FastAPI, Django", "Node.js — Express, Nest.js", "REST & GraphQL APIs", "JWT & OAuth 2.0"],
  },
  {
    index: "00 — 3",
    title: "Data & search",
    items: ["PostgreSQL, MongoDB, Redis", "Kafka & Elasticsearch", "Three.js & D3.js visualization"],
  },
  {
    index: "00 — 4",
    title: "Cloud & AI",
    items: ["AWS, Docker, Kubernetes", "CI/CD, Datadog, Sentry", "OpenAI API features"],
  },
];

export const FIGURES: Figure[] = [
  { value: 66, suffix: "%", label: "Lower query latency — 1,500 ms to under 500 ms" },
  { value: 5000, suffix: "+", label: "Requests per second, scaled on AWS ECS and Kubernetes" },
  { value: 8, prefix: "+", suffix: "%", label: "Conversion lift from A/B-tested React features" },
  { value: 40, suffix: "%", label: "Faster production issue resolution" },
];

export const CAREER: Role[] = [
  {
    period: "2024 — 2026",
    org: "The React Hub",
    role: "Full Stack Developer",
    location: "UK · Remote",
    description: "Software development company building cloud-native web applications and backend services.",
    projects: ["airrange", "component-systems"],
    keyProject: "airrange",
  },
  {
    period: "2023 — 2024",
    org: "Scalater Dev",
    role: "Full Stack Developer",
    location: "US · Remote",
    description: "Software company delivering e-commerce and data-intensive platforms for enterprise retail clients.",
    projects: ["albertsons", "realtime-search", "personalization-ai"],
    keyProject: "albertsons",
  },
  {
    period: "2022 — 2023",
    org: "EXPIEY",
    role: "Web Developer",
    location: "Madrid · On-site",
    description: "Digital company building customer-facing and internal web applications.",
    projects: ["touch-interfaces"],
  },
  {
    period: "2020 — 2022",
    org: "UNED",
    role: "Bachelor of Computer Science",
    location: "Madrid",
    description: "National University of Distance Education.",
    projects: [],
  },
];

/** The marquee: her stack, as the résumé lists it. */
export const STACK_MARQUEE = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "FastAPI",
  "Django",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "Elasticsearch",
  "AWS",
  "Docker",
  "Kubernetes",
  "Shopify",
  "OpenAI API",
];

export const CRAFT_MARQUEE = ["Interfaces", "Services", "Data", "Search", "Cloud", "Commerce", "AI"];

const ALBERTSONS_DESCRIPTION =
  "Enterprise digital retail and e-commerce initiative for one of the largest food and drug retailers in the United States, spanning online grocery, loyalty, pharmacy, and in-store customer experiences.";
const ALBERTSONS_LINK = { label: "albertsonscompanies.com", href: "https://www.albertsonscompanies.com" };
const SCALATER = {
  company: "Scalater Dev",
  role: "Full Stack Developer",
  period: "Sep 2023 — Jul 2024",
  years: "2023 — 24",
  location: "US · Remote",
};

export const PROJECTS: Project[] = [
  {
    slug: "airrange",
    index: "01",
    title: "Airrange",
    context: "No-code SaaS",
    company: "The React Hub",
    role: "Full Stack Developer",
    period: "Aug 2024 — Jun 2026",
    years: "2024 — 26",
    location: "UK · Remote",
    summary:
      "Spreadsheet models turned into web apps, calculators and secure APIs — built as reusable full-stack modules and scaled to thousands of requests per second.",
    description:
      "No-code SaaS platform that turns Excel and Google Sheets models into responsive web apps, calculators, dashboards, and secure APIs while preserving spreadsheet logic.",
    link: { label: "airrange.io", href: "https://airrange.io" },
    stack: ["React", "Next.js", "Redux", "Nest.js", "FastAPI", "GraphQL", "MongoDB", "Redis", "AWS ECS", "Kubernetes"],
    highlights: [
      {
        lead: "Full-stack delivery",
        text: "Designed and delivered reusable full-stack modules with React, Next.js, Redux, Node.js (Nest.js), Python (FastAPI), GraphQL, and MongoDB, accelerating development of spreadsheet-driven applications and web workflows.",
      },
      {
        lead: "Performance & scale",
        text: "Scaled containerized services on AWS ECS and Kubernetes to 5,000+ requests per second through load balancing and horizontal scaling, and cut API latency by redesigning MongoDB access patterns and adding Redis caching.",
      },
      {
        lead: "APIs & security",
        text: "Built and maintained REST and GraphQL APIs, database integrations, and distributed components, and secured applications and APIs with JWT and OAuth 2.0 authentication and authorization.",
      },
      {
        lead: "Cloud & observability",
        text: "Reduced production issue resolution time by 40% by establishing CI/CD pipelines and observability with CloudWatch, Datadog, and Sentry across EC2, ECS, EKS, Lambda, S3, and RDS.",
      },
    ],
    figures: [
      { value: 5000, suffix: "+", label: "Requests per second" },
      { value: 40, suffix: "%", label: "Faster issue resolution" },
    ],
    cover: "airrange",
    tags: ["SaaS", "Python"],
  },
  {
    // Supplied by the requester. Only public facts about the product are stated.
    slug: "manhattan-associates",
    index: "02",
    title: "Manhattan",
    titleItalic: "Associates",
    context: "Warehouse management",
    summary: "Work on the warehouse-management platform that runs distribution for global retailers and logistics providers.",
    description:
      "Manhattan Associates builds supply chain and commerce software. Manhattan Active® is its unified cloud platform, with warehouse management at its core for retailers, wholesalers and logistics providers.",
    link: { label: "manh.com", href: "https://www.manh.com" },
    stack: [],
    highlights: [],
    figures: [],
    cover: "manhattan",
    tags: ["SaaS"],
    supplied: true,
  },
  {
    slug: "albertsons",
    index: "03",
    title: "Albertsons",
    context: "Retail e-commerce",
    ...SCALATER,
    summary:
      "Cart, checkout and digital coupons for one of the largest food and drug retailers in the United States — with query latency cut by two thirds.",
    description: ALBERTSONS_DESCRIPTION,
    link: ALBERTSONS_LINK,
    stack: ["React", "Next.js", "Node.js", "Redis", "PostgreSQL", "MySQL", "AWS"],
    highlights: [
      {
        lead: "Cart & checkout",
        text: "Developed cart, pricing, promotions, and digital-coupon (“clip to card”) flows as React storefront features on Node.js services, with Redis caching for cart state and store-level stock availability.",
      },
      {
        lead: "Performance",
        text: "Reduced query latency by more than 66% (1,500 ms to under 500 ms) and improved MySQL and PostgreSQL performance by 30% through query optimization, indexing, and caching strategies.",
      },
      {
        lead: "Experimentation & impact",
        text: "Increased conversion by 8%, user engagement by 12%, and overall revenue by 9% by shipping A/B test variants in React and analyzing results with Python ETL pipelines, and reduced production issues by 20% through stronger ETL validation, UAT, and release-readiness practices.",
      },
    ],
    figures: [
      { value: 66, suffix: "%", label: "Lower query latency" },
      { value: 8, prefix: "+", suffix: "%", label: "Conversion" },
      { value: 12, prefix: "+", suffix: "%", label: "User engagement" },
      { value: 9, prefix: "+", suffix: "%", label: "Revenue" },
    ],
    cover: "albertsons",
    tags: ["Commerce"],
  },
  {
    slug: "realtime-search",
    index: "04",
    title: "Real-time",
    titleItalic: "search",
    context: "Python · Albertsons",
    ...SCALATER,
    summary:
      "Python services streaming product, price and inventory changes from Kafka into Elasticsearch, so search and autocomplete stay current across the catalog.",
    description: ALBERTSONS_DESCRIPTION,
    link: ALBERTSONS_LINK,
    stack: ["Python", "Kafka", "Elasticsearch", "Node.js", "Express", "React", "Next.js"],
    highlights: [
      {
        lead: "Catalog & search",
        text: "Built product catalog, search, and category browsing in React and Next.js backed by Node.js (Express) APIs, with Python services indexing product, price, and inventory changes from Kafka into Elasticsearch for real-time search and autocomplete.",
      },
    ],
    figures: [],
    cover: "search",
    tags: ["Commerce", "Python"],
  },
  {
    slug: "personalization-ai",
    index: "05",
    title: "Personalization",
    titleItalic: "& AI",
    context: "Python · Albertsons",
    ...SCALATER,
    summary:
      "Django and FastAPI services turning purchase and loyalty history into personalized offers — and AI-generated product content on the OpenAI API.",
    description: ALBERTSONS_DESCRIPTION,
    link: ALBERTSONS_LINK,
    stack: ["Python", "Django", "FastAPI", "REST", "GraphQL", "OpenAI API", "AWS"],
    highlights: [
      {
        lead: "Personalization",
        text: "Delivered personalized offers and product recommendations with Python (Django, FastAPI) services built on purchase and loyalty history, served to React pages through REST and GraphQL APIs.",
      },
      {
        lead: "AI & operations",
        text: "Automated product-description and category-content generation with Python services on the OpenAI API, and maintained deployments on AWS (EC2, S3, RDS, Lambda, EKS) with Docker and automated pipelines.",
      },
    ],
    figures: [],
    cover: "personalization",
    tags: ["Commerce", "Python"],
  },
  {
    slug: "component-systems",
    index: "06",
    title: "Component",
    titleItalic: "systems",
    context: "Platform craft",
    company: "The React Hub",
    role: "Full Stack Developer",
    period: "Aug 2024 — Jun 2026",
    years: "2024 — 26",
    location: "UK · Remote",
    summary:
      "The shared foundations behind the product — reusable React component libraries, TypeScript data-fetching patterns and interactive Three.js visualizations.",
    description: "Software development company building cloud-native web applications and backend services.",
    stack: ["React", "TypeScript", "Next.js", "GraphQL", "Headless CMS", "Three.js", "React Native"],
    highlights: [
      {
        lead: "Technical leadership",
        text: "Led architecture discussions and code reviews, and delivered reusable React component libraries and TypeScript data-fetching patterns adopted across the team.",
      },
      {
        lead: "Product features",
        text: "Integrated a GraphQL-based headless CMS with React and Next.js interfaces to accelerate content delivery and SEO, built interactive Three.js data visualizations, and extended backend APIs to early-stage React Native mobile features.",
      },
    ],
    figures: [],
    cover: "components",
    tags: ["Interfaces"],
  },
  {
    slug: "touch-interfaces",
    index: "07",
    title: "Touch",
    titleItalic: "interfaces",
    context: "Web & touch",
    company: "EXPIEY",
    role: "Web Developer",
    period: "Jun 2022 — Jul 2023",
    years: "2022 — 23",
    location: "Madrid · On-site",
    summary:
      "Responsive customer-facing and internal web applications, including touchscreen interfaces — clearer flows, consistent UI and faster screens.",
    description: "Digital company building customer-facing and internal web applications.",
    stack: ["React", "Redux", "JavaScript", "Tailwind CSS", "SCSS", "Material UI", "Serverless"],
    highlights: [
      {
        lead: "Web development",
        text: "Shipped responsive customer-facing and internal web applications with React, Redux, JavaScript, Tailwind CSS, SCSS, and Material UI.",
      },
      {
        lead: "UX & performance",
        text: "Improved visitor retention and product outcomes by strengthening UI consistency, user flows, and frontend performance.",
      },
      {
        lead: "Serverless migration",
        text: "Reduced request latency and improved scalability by supporting the migration of application workloads to highly available serverless resources.",
      },
      {
        lead: "Quality",
        text: "Raised usability and release quality by delivering touchscreen UI features, integrating APIs, resolving production defects, and performing QA and release validation.",
      },
    ],
    figures: [],
    cover: "touch",
    tags: ["Interfaces"],
  },
  {
    // Supplied by the requester. Only public facts about each store are stated.
    slug: "shopify-storefronts",
    index: "08",
    title: "Shopify",
    titleItalic: "storefronts",
    context: "Commerce",
    summary: "Storefronts on Shopify and Hydrogen for jewelry, fashion, haircare and tech-accessory brands.",
    description:
      "Five commerce brands on Shopify — including Varley's headless storefront on Shopify Hydrogen and React, and Shoplift, the conversion-optimization platform built for Shopify merchants.",
    stack: ["Shopify", "Shopify Hydrogen", "React"],
    highlights: [],
    figures: [],
    cover: "shopify",
    tags: ["Commerce"],
    supplied: true,
    stores: true,
  },
];

// Supplied by the requester. Summaries describe each brand as its own site does; the platform line
// is the requester's (all five serve from cdn.shopify.com, checked 2026-10-01).
export const STOREFRONTS: Storefront[] = [
  {
    slug: "mejuri",
    name: "Mejuri",
    category: "Fine jewelry",
    platform: "Shopify",
    url: "https://mejuri.com",
    domain: "mejuri.com",
    summary: "Modern fine-jewelry e-commerce built around storytelling and everyday luxury — jewelry you can live in.",
    image: "/stores/mejuri.webp",
  },
  {
    slug: "varley",
    name: "Varley",
    category: "Fashion",
    platform: "Shopify Hydrogen · React",
    url: "https://www.varley.com",
    domain: "varley.com",
    summary: "An elevated everyday wardrobe rooted in movement, sold through a headless storefront.",
    image: "/stores/varley.webp",
  },
  {
    slug: "curlsmith",
    name: "Curlsmith",
    category: "Haircare",
    platform: "Shopify",
    url: "https://curlsmith.com",
    domain: "curlsmith.com",
    summary: "The first gourmet haircare brand created specifically for curls.",
    image: "/stores/curlsmith.webp",
  },
  {
    slug: "mous",
    name: "Mous",
    category: "Tech accessories",
    platform: "Shopify",
    url: "https://www.mous.co",
    domain: "mous.co",
    summary: "Protective phone cases, bags and device accessories — made to match, built to last.",
    image: "/stores/mous.webp",
  },
  {
    slug: "shoplift",
    name: "Shoplift",
    category: "Shopify app",
    platform: "Shopify",
    url: "https://shoplift.ai",
    domain: "shoplift.ai",
    summary: "The CRO platform purpose-built for Shopify — A/B testing merchants can launch without a developer.",
    image: "/stores/shoplift.webp",
  },
];

export function projectTitle(project: Project) {
  return [project.title, project.titleItalic].filter(Boolean).join(" ");
}

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** The project after `slug`, wrapping to the first. */
export function nextProject(slug: string): Project {
  const i = PROJECTS.findIndex((project) => project.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length] as Project;
}
