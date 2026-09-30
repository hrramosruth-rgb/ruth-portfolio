"use client";

import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/brand/monogram";
import { StoreShot } from "@/components/covers/store-shot";
import { getLenis } from "@/components/motion/smooth-scroll";
import { STOREFRONTS } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

const STEP = 360 / STOREFRONTS.length;
const AUTO_SPEED = 0.08; // degrees per frame
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Storefront screenshots orbiting the monogram. The ring turns on its own, slows under the pointer,
 * spins when dragged, and brings a focused card to the front. Cards open a detail dialog.
 */
export function Storefronts() {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLSpanElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const dragged = useRef(false);
  const focused = useRef<number | null>(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const stageEl = stage.current;
    const ringEl = ring.current;
    const coreEl = core.current;
    if (!stageEl || !ringEl || !coreEl) return;

    const still = prefersReducedMotion();
    let angle = 0;
    let speed = still ? 0 : AUTO_SPEED;
    let hovering = false;
    let visible = true;
    let drag: { x: number; angle: number } | null = null;
    let raf = 0;

    const render = () => {
      ringEl.style.transform = `translateZ(calc(var(--r) * -1)) rotateX(-11deg) rotateY(${angle}deg)`;
      coreEl.style.transform = `translate(-50%, -50%) rotateY(${-angle}deg)`;
      cards.current.forEach((card, i) => {
        if (!card) return;
        const front = (Math.cos(((angle + i * STEP) * Math.PI) / 180) + 1) / 2; // 1 = facing the viewer
        card.style.filter = `grayscale(${1 - front ** 3}) brightness(${0.32 + 0.68 * front})`;
      });
    };

    const loop = () => {
      if (visible && !drag) {
        if (focused.current !== null) {
          const target = -focused.current * STEP;
          const delta = ((((target - angle) % 360) + 540) % 360) - 180; // shortest way round
          angle += delta * (still ? 1 : 0.1);
        } else {
          speed += ((hovering || still ? 0 : AUTO_SPEED) - speed) * 0.05;
          angle -= speed;
        }
      }
      render();
      raf = requestAnimationFrame(loop);
    };

    const down = (event: PointerEvent) => {
      drag = { x: event.clientX, angle };
      dragged.current = false;
      focused.current = null;
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (Math.abs(dx) > 4) dragged.current = true;
      angle = drag.angle + dx * 0.25;
    };
    const up = () => {
      drag = null;
      // The click that ends a drag fires after pointerup; forget the drag once it has been seen.
      window.setTimeout(() => {
        dragged.current = false;
      }, 0);
    };
    const enter = () => {
      hovering = true;
    };
    const leave = () => {
      hovering = false;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    observer.observe(stageEl);
    stageEl.addEventListener("pointerdown", down);
    stageEl.addEventListener("pointerenter", enter);
    stageEl.addEventListener("pointerleave", leave);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    raf = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      stageEl.removeEventListener("pointerdown", down);
      stageEl.removeEventListener("pointerenter", enter);
      stageEl.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      cancelAnimationFrame(raf);
    };
  }, []);

  const openStore = (i: number, fromRing = false) => {
    if (fromRing && dragged.current) return;
    setOpen(i);
    dialog.current?.showModal();
    document.documentElement.classList.add("has-dialog");
    getLenis()?.stop();
  };

  const onClose = () => {
    document.documentElement.classList.remove("has-dialog");
    getLenis()?.start();
  };

  const store = STOREFRONTS[open] ?? STOREFRONTS[0];

  return (
    <section id="storefronts" className="section stores" data-theme="ink" aria-labelledby="stores-title">
      <div className="section-head">
        <h2 id="stores-title" className="display">
          Shopify <em>storefronts</em>
        </h2>
        <span className="ui muted">Commerce — {pad(STOREFRONTS.length)}</span>
      </div>
      <p className="section-intro muted">
        Storefronts on Shopify and Hydrogen for brands where the experience is the product. Drag the ring to turn it;
        open a store for details.
      </p>

      <div ref={stage} className="orbit" data-cursor="Drag">
        <div ref={ring} className="orbit-ring">
          <span ref={core} className="orbit-core" aria-hidden="true">
            <Monogram />
          </span>
          {STOREFRONTS.map((item, i) => (
            <button
              key={item.slug}
              ref={(el) => {
                cards.current[i] = el;
              }}
              type="button"
              className="orbit-card"
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--r))` }}
              aria-label={`${item.name}, ${item.category} — open details`}
              data-cursor="Open"
              onClick={() => openStore(i, true)}
              onFocus={() => {
                focused.current = i;
              }}
              onBlur={() => {
                focused.current = null;
              }}
            >
              <StoreShot image={item.image} focus="50% 0%" />
              <span className="orbit-card-label ui">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="stores-legend ui">
        {STOREFRONTS.map((item, i) => (
          <li key={item.slug}>
            <button
              type="button"
              className="u-line"
              data-cursor="Open"
              onClick={() => openStore(i)}
              onPointerEnter={() => {
                focused.current = i;
              }}
              onPointerLeave={() => {
                focused.current = null;
              }}
            >
              <span className="muted">{pad(i + 1)}</span> {item.name}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="store-dialog"
        aria-labelledby="store-dialog-title"
        onClose={onClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {store ? (
          <div className="store-dialog-inner" data-lenis-prevent>
            <figure className="store-browser">
              <div className="store-browser-bar">
                <i />
                <i />
                <i />
                <span className="ui">{store.domain}</span>
              </div>
              <div className="store-browser-view">
                <StoreShot key={store.slug} image={store.image} focus="50% 0%" eager />
              </div>
            </figure>
            <div className="store-dialog-copy">
              <p className="ui store-dialog-kicker">
                {store.category} · {store.platform}
              </p>
              <h3 id="store-dialog-title" className="display">
                {store.name}
              </h3>
              <p>{store.summary}</p>
              <ul className="store-stack">
                {store.stack.map((tech) => (
                  <li key={tech} className="ui">
                    {tech}
                  </li>
                ))}
              </ul>
              <a href={store.url} className="store-visit ui" target="_blank" rel="noreferrer">
                Visit {store.domain} ↗
              </a>
            </div>
            <form method="dialog">
              <button type="submit" className="store-close ui">
                Close ✕
              </button>
            </form>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
