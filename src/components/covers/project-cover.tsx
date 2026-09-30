import type { CoverKind } from "@/data/content";
import { asset } from "@/lib/asset";

type ProjectCoverProps = { kind: CoverKind; number: string; eager?: boolean };

/**
 * Art-directed project covers. Airrange is a real screenshot of airrange.io; the others are
 * compositions (Albertsons.com blocks automated capture; the other two are bodies of work).
 * Compositions are 3:4 posters sized with container query units, centred in any frame.
 */
export function ProjectCover({ kind, number, eager = false }: ProjectCoverProps) {
  if (kind === "airrange") {
    return (
      <div className="cover cover--airrange" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
        <img src={asset("/covers/airrange.webp")} alt="" width={1440} height={900} loading={eager ? "eager" : "lazy"} />
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
