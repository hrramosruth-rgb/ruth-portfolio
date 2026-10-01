# Ruth Ramos — Portfolio

Portfolio for Ruth Ramos, Full Stack Developer in Madrid. The home page opens on "Ruth's World"
(`src/components/world/`): her projects orbit a pearl globe; click a project for its panel, or the
globe to see where she's based. Below it, in the "Twilight" palette (`src/styles/tokens.css`): a bento
About, the project gallery, career path and contact — plus a case study per project.

## Develop

    mise install          # Node 24
    pnpm install
    pnpm dev --port 6220  # http://localhost:6220

Gates: `pnpm lint`, `pnpm typecheck`, `pnpm build`.

## Edit content

All copy lives in `src/data/content.ts`. Facts come from Ruth's résumé; projects marked
`supplied: true` (Manhattan Associates, Shopify storefronts) were added separately and state only
public facts about the product. Don't add claims neither source makes.

- **Projects** — `PROJECTS` drives the orbit, the gallery and the `/work/[slug]` pages. The two Python
  projects (real-time search, personalization & AI) come from the Albertsons work on the résumé.
- **Storefronts** — `STOREFRONTS`, shown on the Shopify case study; screenshots live in
  `public/stores/` (1440×900 WebP of each public homepage).
- **Pictures** — `public/covers/` holds screenshots of airrange.io and manh.com, and illustrations
  of the other systems (storefront, search indexing, personalization & AI content, component
  library, touch kiosk). Illustrations are brand-neutral and labelled "Illustration" on the site.
  Edit them in `design/illustrations/index.html`, then run `pnpm illustrations` to re-render.

Contact shows the phone, email and LinkedIn exactly as the résumé lists them (`PROFILE`, `CONTACTS`). There is no GitHub link and no résumé download.

## Globe

The globe's dotted continents come from Natural Earth (via `world-atlas`); `pnpm globe-points`
regenerates `src/components/world/land-points.ts`.

## Brand

The mirrored-RR monogram is generated from Bodoni Moda (opsz 96): `pnpm monogram` rewrites
`src/components/brand/monogram-paths.ts`. The favicon (`/icon.png`) and share image (`/og.png`) are
rendered from code in `src/app/icon.png/` and `src/app/og.png/`.

## Deploy

Built for GitHub Pages at `https://hrramosruth-rgb.github.io/ruth-portfolio/`:
`deploy/publish-pages.sh` builds a static export (`STATIC_EXPORT=1`, base path `/ruth-portfolio`)
and pushes it to the `gh-pages` branch. A normal `pnpm build` still works for Vercel or `next start`.
