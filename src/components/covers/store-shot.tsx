import { asset } from "@/lib/asset";

type StoreShotProps = { image: string; focus?: string; eager?: boolean; className?: string };

/** A storefront screenshot filling its frame; `focus` picks the crop for portrait frames. */
export function StoreShot({ image, focus = "50% 50%", eager = false, className }: StoreShotProps) {
  return (
    <div className={className ? `cover cover--store ${className}` : "cover cover--store"} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
      <img
        src={asset(image)}
        alt=""
        width={1440}
        height={900}
        style={{ objectPosition: focus }}
        loading={eager ? "eager" : "lazy"}
        draggable={false}
      />
    </div>
  );
}
