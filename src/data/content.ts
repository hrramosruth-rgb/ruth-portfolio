// Single source of copy. Every fact comes from Ruth's résumé; do not add claims it does not make.

export type Link = { label: string; href: string };
export type Highlight = { lead: string; text: string };
export type Figure = { value: number; prefix?: string; suffix?: string; label: string };
export type Segment = { text: string; em?: boolean };
export type CoverKind = "airrange" | "albertsons" | "components" | "touch";

export type Project = {
  slug: string;
  index: string;
  title: string;
  titleItalic?: string;
  context: string;
  company: string;
  role: string;
  period: string;
  years: string;
  location: string;
  summary: string;
  description: string;
  link?: Link;
  stack: string[];
  highlights: Highlight[];
  figures: Figure[];
  cover: CoverKind;
};

export type Discipline = { index: string; title: string; items: string[] };
export type Role = { period: string; org: string; role: string; location: string };

export const PROFILE = {
  name: "Ruth Ramos",
  firstName: "Ruth",
  lastName: "Ramos",
  role: "Design Engineer",
  stackLine: "Full stack — React, Node.js, Python",
  title: "Ruth Ramos — Design Engineer & Full Stack Developer",
  description:
    "Ruth Ramos is a design engineer and full stack developer in Madrid, crafting customer-facing products end to end — from React interfaces to the services that keep them fast.",
  location: "Madrid, Spain",
  city: "Madrid",
  timeZone: "Europe/Madrid",
  availability: "Open to new roles",
  email: "hrramosruth@gmail.com",
  statement: [
    { text: "I craft customer-facing products end to end — the " },
    { text: "interfaces", em: true },
    { text: " people touch, the " },
    { text: "component systems", em: true },
    { text: " teams build on, and the services that keep them fast. From a no-code SaaS platform to one of America's largest retailers" },
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
    title: "Interface engineering",
    items: ["React, Next.js, Tailwind CSS", "Responsive & touch interfaces", "User flows & UI consistency"],
  },
  {
    index: "00 — 2",
    title: "Component systems",
    items: ["Reusable React libraries", "Storybook & TypeScript patterns", "Adopted across the team"],
  },
  {
    index: "00 — 3",
    title: "Data visualization",
    items: ["Three.js & D3.js", "Interactive dashboards", "A/B-tested experiences"],
  },
  {
    index: "00 — 4",
    title: "Full stack & cloud",
    items: ["Node.js, FastAPI, GraphQL", "AWS, Docker, Kubernetes", "OpenAI API features"],
  },
];

export const FIGURES: Figure[] = [
  { value: 66, suffix: "%", label: "Lower query latency — 1,500 ms to under 500 ms" },
  { value: 5000, suffix: "+", label: "Requests per second, scaled on AWS ECS and Kubernetes" },
  { value: 8, prefix: "+", suffix: "%", label: "Conversion lift from A/B-tested React features" },
  { value: 40, suffix: "%", label: "Faster production issue resolution" },
];

export const EXPERIENCE: Role[] = [
  { period: "2024 — 2026", org: "The React Hub", role: "Full Stack Developer", location: "UK · Remote" },
  { period: "2023 — 2024", org: "Scalater Dev", role: "Full Stack Developer", location: "US · Remote" },
  { period: "2022 — 2023", org: "EXPIEY", role: "Web Developer", location: "Madrid · On-site" },
  { period: "2020 — 2022", org: "UNED", role: "Bachelor of Computer Science", location: "Madrid" },
];

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
  },
  {
    slug: "albertsons",
    index: "02",
    title: "Albertsons",
    context: "Retail e-commerce",
    company: "Scalater Dev",
    role: "Full Stack Developer",
    period: "Sep 2023 — Jul 2024",
    years: "2023 — 24",
    location: "US · Remote",
    summary:
      "Catalog, search, checkout and personalised offers for one of the largest food and drug retailers in the United States — with query latency cut by two thirds.",
    description:
      "Enterprise digital retail and e-commerce initiative for one of the largest food and drug retailers in the United States, spanning online grocery, loyalty, pharmacy, and in-store customer experiences.",
    link: { label: "albertsonscompanies.com", href: "https://www.albertsonscompanies.com" },
    stack: ["React", "Next.js", "Node.js", "Django", "FastAPI", "Kafka", "Elasticsearch", "Redis", "PostgreSQL", "AWS"],
    highlights: [
      {
        lead: "Catalog & search",
        text: "Built product catalog, search, and category browsing in React and Next.js backed by Node.js (Express) APIs, with Python services indexing product, price, and inventory changes from Kafka into Elasticsearch for real-time search and autocomplete.",
      },
      {
        lead: "Cart & checkout",
        text: "Developed cart, pricing, promotions, and digital-coupon (“clip to card”) flows as React storefront features on Node.js services, with Redis caching for cart state and store-level stock availability.",
      },
      {
        lead: "Personalization",
        text: "Delivered personalized offers and product recommendations with Python (Django, FastAPI) services built on purchase and loyalty history, served to React pages through REST and GraphQL APIs.",
      },
      {
        lead: "Performance",
        text: "Reduced query latency by more than 66% (1,500 ms to under 500 ms) and improved MySQL and PostgreSQL performance by 30% through query optimization, indexing, and caching strategies.",
      },
      {
        lead: "Experimentation & impact",
        text: "Increased conversion by 8%, user engagement by 12%, and overall revenue by 9% by shipping A/B test variants in React and analyzing results with Python ETL pipelines, and reduced production issues by 20% through stronger ETL validation, UAT, and release-readiness practices.",
      },
      {
        lead: "AI & operations",
        text: "Automated product-description and category-content generation with Python services on the OpenAI API, and maintained deployments on AWS (EC2, S3, RDS, Lambda, EKS) with Docker and automated pipelines.",
      },
    ],
    figures: [
      { value: 66, suffix: "%", label: "Lower query latency" },
      { value: 8, prefix: "+", suffix: "%", label: "Conversion" },
      { value: 12, prefix: "+", suffix: "%", label: "User engagement" },
      { value: 9, prefix: "+", suffix: "%", label: "Revenue" },
    ],
    cover: "albertsons",
  },
  {
    slug: "component-systems",
    index: "03",
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
  },
  {
    slug: "touch-interfaces",
    index: "04",
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
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** The project after `slug`, wrapping to the first. */
export function nextProject(slug: string): Project {
  const i = PROJECTS.findIndex((project) => project.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length] as Project;
}
