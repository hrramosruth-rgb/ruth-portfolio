import type { CoverKind } from "@/data/content";
import { STOREFRONTS } from "@/data/content";
import { asset } from "@/lib/asset";

type ProjectCoverProps = { kind: CoverKind; number: string; eager?: boolean };

const SCREENSHOTS: Partial<Record<CoverKind, string>> = {
  airrange: "/covers/airrange.webp",
  manhattan: "/covers/manhattan.webp",
};

/**
 * Art-directed project covers. Airrange and Manhattan are screenshots of the public product sites and
 * the Shopify cover is a collage of the storefronts; the rest are compositions (Albertsons' sites block
 * automated capture, and the others are bodies of work rather than public products). Compositions are
 * 3:4 posters sized with container query units, centred in any frame.
 */
export function ProjectCover({ kind, number, eager = false }: ProjectCoverProps) {
  const loading = eager ? "eager" : "lazy";
  const screenshot = SCREENSHOTS[kind];

  if (screenshot) {
    return (
      <div className={`cover cover--shot cover--${kind}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
        <img src={asset(screenshot)} alt="" width={1440} height={900} loading={loading} draggable={false} />
        <span className="cover-number">{number}</span>
      </div>
    );
  }

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

  return (
    <div className={`cover cover--${kind}`} aria-hidden="true">
      <span className="cover-art">
        {kind === "albertsons" ? (
          <>
            <span className="cover-kicker">
              Clip<i>to card</i>
            </span>
            <span className="cover-coupon">
              <span>Digital coupons</span>
              <b>+8%</b>
            </span>
          </>
        ) : null}
        {kind === "search" ? (
          <span className="cover-search">
            <span className="search-field">
              straw<i />
            </span>
            <span className="search-list">
              <span>
                <b>straw</b>berries
              </span>
              <span>
                <b>straw</b>berry jam
              </span>
              <span>
                <b>straw</b>s, paper
              </span>
            </span>
            <span className="search-flow">Kafka → Elasticsearch</span>
          </span>
        ) : null}
        {kind === "personalization" ? (
          <span className="cover-foryou">
            <b>
              For <i>you</i>
            </b>
            <span className="foryou-card">
              <i />
              <span />
              <span />
            </span>
            <span className="foryou-card">
              <i />
              <span />
              <span />
            </span>
            <span className="foryou-ai">✦ Generated description</span>
          </span>
        ) : null}
        {kind === "components" ? (
          <>
            <span className="cover-aa">
              A<i>a</i>
            </span>
            <span className="cover-kit">
              <span className="kit-primary">Continue</span>
              <span className="kit-secondary">Preview</span>
              <span className="kit-toggle" />
              <span className="kit-swatches">
                <i />
                <i />
                <i />
              </span>
            </span>
          </>
        ) : null}
        {kind === "touch" ? (
          <span className="cover-screen">
            <b>Welcome</b>
            <i>Start</i>
            <i>Browse</i>
            <i>Help</i>
            <i>Account</i>
          </span>
        ) : null}
        <span className="cover-number">{number}</span>
      </span>
    </div>
  );
}
