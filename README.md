# Ruth Ramos — Portfolio

Portfolio for Ruth Ramos, Full Stack Developer in Madrid: a home page whose hero is a "world" of
her projects orbiting the monogram (click one for its detail panel), followed by about, the project
index, figures, experience and contact — plus a case study per project.

## Develop

    mise install          # Node 24
    pnpm install
    pnpm dev --port 6220  # http://localhost:6220

Gates: `pnpm lint`, `pnpm typecheck`, `pnpm build`.

## Edit content

All copy lives in `src/data/content.ts`. Facts come from Ruth's résumé; projects marked
`supplied: true` (Manhattan Associates, Shopify storefronts) were added separately and state only
public facts about the product. Don't add claims neither source makes.

- **Projects** — `PROJECTS` drives the orbit, the index and the `/work/[slug]` pages. The two Python
  projects (real-time search, personalization & AI) come from the Albertsons work on the résumé.
- **Storefronts** — `STOREFRONTS`, shown on the Shopify case study; screenshots live in
  `public/stores/` (1440×900 WebP of each public homepage).
- **Covers** — `public/covers/` holds screenshots of airrange.io and manh.com; the Shopify cover is a
  collage of the stores; the rest are drawn in CSS (`src/components/covers/project-cover.tsx`).

There is intentionally no résumé download (the PDF carries a phone number).

## Brand

The mirrored-RR monogram is generated from Bodoni Moda (opsz 96): `pnpm monogram` rewrites
`src/components/brand/monogram-paths.ts`. The favicon (`/icon.png`) and share image (`/og.png`) are
rendered from code in `src/app/icon.png/` and `src/app/og.png/`.

## Deploy

Built for GitHub Pages at `https://hrramosruth-rgb.github.io/ruth-portfolio/`:
`deploy/publish-pages.sh` builds a static export (`STATIC_EXPORT=1`, base path `/ruth-portfolio`)
and pushes it to the `gh-pages` branch. A normal `pnpm build` still works for Vercel or `next start`.
