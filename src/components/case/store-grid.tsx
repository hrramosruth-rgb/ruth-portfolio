import { StoreShot } from "@/components/covers/store-shot";
import { STOREFRONTS } from "@/data/content";

/** The Shopify storefronts, each with its homepage and a link to the live store. */
export function StoreGrid() {
  return (
    <ul className="store-grid">
      {STOREFRONTS.map((store) => (
        <li key={store.slug}>
          <a href={store.url} className="store-tile" target="_blank" rel="noreferrer" data-cursor="Visit">
            <span className="store-tile-shot">
              <StoreShot image={store.image} focus="50% 0%" />
            </span>
            <span className="store-tile-meta">
              <span className="display store-tile-name">{store.name}</span>
              <span className="ui muted">
                {store.category} · {store.platform}
              </span>
            </span>
            <span className="muted store-tile-summary">{store.summary}</span>
            <span className="ui u-line store-tile-visit">Visit {store.domain} ↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
