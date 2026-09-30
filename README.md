# Ruth Ramos — Portfolio

Portfolio for Ruth Ramos, Design Engineer and Full Stack Developer in Madrid: a home page
(project index, Shopify storefront orbit, Python services, figures, experience, contact) and a
case study per project.

## Develop

    mise install          # Node 24
    pnpm install
    pnpm dev --port 6220  # http://localhost:6220

Gates: `pnpm lint`, `pnpm typecheck`, `pnpm build`.

## Edit content

All copy lives in `src/data/content.ts`. Facts come from Ruth's résumé; the Shopify storefronts
were supplied separately and are marked as such. Don't add claims neither source makes.

- **Projects** — `PROJECTS` drives the index, the hero rotation and `/work/[slug]` pages.
- **Storefronts** — `STOREFRONTS`; screenshots live in `public/stores/` (1440×900 WebP of each
  public homepage).
- **Python** — `PYTHON_WORK`, each entry linked to the case study it comes from.
- **Covers** — `public/covers/airrange.webp` is a screenshot of airrange.io; the other covers are
  drawn in CSS (`src/components/covers/project-cover.tsx`).

There is intentionally no résumé download (the PDF carries a phone number).

## Brand

The mirrored-RR monogram is generated from Bodoni Moda (opsz 96): `pnpm monogram` rewrites
`src/components/brand/monogram-paths.ts`. The favicon (`/icon.png`) and share image (`/og.png`) are
rendered from code in `src/app/icon.png/` and `src/app/og.png/`.

## Deploy

Built for GitHub Pages at `https://hrramosruth-rgb.github.io/ruth-portfolio/`:
`deploy/publish-pages.sh` builds a static export (`STATIC_EXPORT=1`, base path `/ruth-portfolio`)
and pushes it to the `gh-pages` branch. A normal `pnpm build` still works for Vercel or `next start`.
