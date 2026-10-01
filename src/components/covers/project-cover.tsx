import type { CoverKind } from "@/data/content";
import { STOREFRONTS } from "@/data/content";
import { asset } from "@/lib/asset";

type ProjectCoverProps = { kind: CoverKind; number: string; eager?: boolean };

/**
 * Project pictures. Airrange and Manhattan are screenshots of the public product sites; the Shopify
 * cover is a collage of the storefronts. The rest are illustrations of the system Ruth built (no
 * client branding), rendered from design/illustrations/index.html with `pnpm illustrations`.
 */
const IMAGES: Record<Exclude<CoverKind, "shopify">, string> = {
  airrange: "/covers/airrange.webp",
  manhattan: "/covers/manhattan.webp",
  albertsons: "/covers/albertsons.webp",
  search: "/covers/search.webp",
  personalization: "/covers/personalization.webp",
  components: "/covers/components.webp",
  touch: "/covers/touch.webp",
};

const ILLUSTRATIONS: CoverKind[] = ["albertsons", "search", "personalization", "components", "touch"];

export function ProjectCover({ kind, number, eager = false }: ProjectCoverProps) {
  const loading = eager ? "eager" : "lazy";

  if (kind === "shopify") {
    return (
      <div className="cover cover--shopify" aria-hidden="true">
        <span className="cover-collage">
          {STOREFRONTS.slice(0, 4).map((store) => (
            // eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer
            <img key={store.slug} src={asset(store.image)} alt="" width={1440} height={900} loading={loading} draggable={false} />
          ))}
        </span>
        <span className="cover-number">{number}</span>
      </div>
    );
  }

  const illustration = ILLUSTRATIONS.includes(kind);
  return (
    <div className={`cover cover--shot cover--${kind}${illustration ? " cover--illustration" : ""}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
      <img src={asset(IMAGES[kind])} alt="" width={1440} height={900} loading={loading} draggable={false} />
      <span className="cover-number">{number}</span>
    </div>
  );
}
