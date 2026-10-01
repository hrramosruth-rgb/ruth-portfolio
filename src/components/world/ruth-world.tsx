"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Clock } from "@/components/chrome/clock";
import { ProjectCover } from "@/components/covers/project-cover";
import { getLenis } from "@/components/motion/smooth-scroll";
import { SplitText } from "@/components/motion/split-text";
import type { Project } from "@/data/content";
import { LINKS, PROFILE, PROJECTS, projectTitle } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";
import { Globe, type GlobeHandle } from "./globe";

const COUNT = PROJECTS.length;
const STEP = (Math.PI * 2) / COUNT;
const AUTO_SPEED = 0.0016; // radians per frame
const RING_DROP = 0.1; // how far the near side of the ring sits below the far side

/** Where card i sits for a ring angle: a 3D position plus an inward turn so it never reads mirrored. */
function placement(i: number, angle: number) {
  const theta = angle + i * STEP;
  const x = Math.sin(theta);
  const z = Math.cos(theta);
  return {
    transform: `translate3d(calc(var(--r) * ${x.toFixed(4)}), calc(var(--r) * ${(z * RING_DROP).toFixed(4)}), calc(var(--r) * ${z.toFixed(4)})) rotateY(${(x * 46).toFixed(2)}deg)`,
    zIndex: String(Math.round(200 + z * 100)),
    depth: z,
  };
}

/** Deterministic specks of stardust (same on server and client). */
const DUST = Array.from({ length: 220 }, (_, i) => {
  const rand = (n: number) => {
    const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  return {
    left: `${(rand(1) * 100).toFixed(2)}%`,
    top: `${(rand(2) * 100).toFixed(2)}%`,
    size: rand(3) > 0.9 ? 2 : 1,
    delay: `${(rand(4) * 6).toFixed(2)}s`,
    tone: rand(5) > 0.85 ? "#cfe0ff" : "#ffffff",
  };
});

function badge(project: Project) {
  if (project.illustration) return "Illustration";
  if (project.link || project.stores) return "Live site";
  return "Selected";
}

/**
 * The home page: Ruth's projects orbit a pearl globe. The ring turns on its own, slows under the
 * pointer and spins when dragged. Clicking a project stops the orbit and opens its panel; clicking
 * the globe turns it to Madrid and shows where Ruth is based.
 */
export function RuthWorld() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const globe = useRef<GlobeHandle>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const motion = useRef({ angle: 0, paused: false, hovering: false, focus: null as number | null, dragged: false });
  const [open, setOpen] = useState(0);
  const [home, setHome] = useState(false);

  // Orbit loop: positions every card each frame; drag to spin.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const m = motion.current;
    const still = prefersReducedMotion();
    let speed = still ? 0 : AUTO_SPEED;
    let visible = true;
    let drag: { x: number; angle: number } | null = null;
    let raf = 0;

    const render = () => {
      cards.current.forEach((card, i) => {
        if (!card) return;
        const p = placement(i, m.angle);
        card.style.transform = p.transform;
        card.style.zIndex = p.zIndex;
        card.style.setProperty("--depth", ((p.depth + 1) / 2).toFixed(3));
      });
    };

    const loop = () => {
      if (visible && !drag) {
        if (m.focus !== null) {
          const target = -m.focus * STEP;
          const delta = ((((target - m.angle) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
          m.angle += delta * (still ? 1 : 0.08);
        } else {
          speed += ((m.hovering || m.paused || still ? 0 : AUTO_SPEED) - speed) * 0.05;
          m.angle -= speed;
        }
        render();
      }
      raf = requestAnimationFrame(loop);
    };

    const down = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest(".rw-place, .rw-globe")) return;
      drag = { x: event.clientX, angle: m.angle };
      m.dragged = false;
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (Math.abs(dx) > 4) m.dragged = true;
      m.angle = drag.angle + dx * 0.004;
      render();
    };
    const up = () => {
      drag = null;
      window.setTimeout(() => {
        m.dragged = false;
      }, 0);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    observer.observe(el);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    render();
    raf = requestAnimationFrame(loop);
    return () => {
      observer.disconnect();
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Leaving the page with the panel open must not leave scrolling stopped.
  useEffect(
    () => () => {
      document.documentElement.classList.remove("has-dialog");
      getLenis()?.start();
    },
    [],
  );

  const openProject = (i: number) => {
    const m = motion.current;
    if (m.dragged) return;
    setHome(false);
    globe.current?.release();
    setOpen(i);
    m.paused = true;
    m.focus = i;
    dialog.current?.showModal();
    if (dialog.current) dialog.current.scrollTop = 0;
    closeButton.current?.focus({ preventScroll: true });
    document.documentElement.classList.add("has-dialog");
    getLenis()?.stop();
  };

  const onClose = () => {
    const m = motion.current;
    m.paused = false;
    m.focus = null;
    document.documentElement.classList.remove("has-dialog");
    getLenis()?.start();
  };

  const toggleHome = () => {
    if (motion.current.dragged) return;
    const next = !home;
    motion.current.paused = next;
    if (next) globe.current?.focusHome();
    else globe.current?.release();
    setHome(next);
  };

  // Click away (or Escape) closes the "based in" card.
  useEffect(() => {
    if (!home) return;
    const close = () => {
      motion.current.paused = false;
      globe.current?.release();
      setHome(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onDown = (event: PointerEvent) => {
      if (!(event.target as HTMLElement | null)?.closest(".rw-place, .rw-globe")) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [home]);

  const project = PROJECTS[open] ?? PROJECTS[0];

  return (
    <section className={`rw${home ? " is-home" : ""}`} data-theme="night" aria-labelledby="rw-title">
      <div className="rw-sky" aria-hidden="true">
        {DUST.map((d, i) => (
          <i
            key={i}
            style={{ left: d.left, top: d.top, width: d.size, height: d.size, background: d.tone, animationDelay: d.delay }}
          />
        ))}
      </div>

      <header className="rw-head">
        <h1 id="rw-title" className="rw-title display">
          <span className="sr-only">Ruth&apos;s World — {PROFILE.name}, {PROFILE.role}</span>
          <SplitText text="Ruth's" className="split--intro" delay={0.2} />
          <SplitText text="World" className="split--intro italic" delay={0.32} />
        </h1>
        <p className="rw-hint ui fade-in" aria-live="polite">
          {home ? "Madrid. Take a look, or click away" : "Click a project to stop the orbit, or click the world"}
        </p>
      </header>

      <div ref={stage} className="rw-stage" data-cursor="Drag">
        <div className="rw-orbit">
          <button
            type="button"
            className="rw-globe"
            onClick={toggleHome}
            aria-label="Where Ruth is based"
            aria-expanded={home}
            data-cursor={home ? "Close" : "Madrid"}
          >
            <Globe ref={globe} className="rw-globe-canvas" />
          </button>

          {PROJECTS.map((item, i) => {
            const p = placement(i, 0);
            return (
              <button
                key={item.slug}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                type="button"
                className="rw-card"
                style={{ transform: p.transform, zIndex: Number(p.zIndex), "--depth": ((p.depth + 1) / 2).toFixed(3) } as React.CSSProperties}
                aria-label={`${projectTitle(item)}, ${item.context} — open details`}
                data-cursor="Open"
                onClick={() => openProject(i)}
                onPointerEnter={() => {
                  motion.current.hovering = true;
                }}
                onPointerLeave={() => {
                  motion.current.hovering = false;
                }}
                onFocus={() => {
                  motion.current.focus = i;
                }}
                onBlur={() => {
                  if (!motion.current.paused) motion.current.focus = null;
                }}
              >
                <span className="rw-card-shot">
                  <ProjectCover kind={item.cover} number={item.index} eager={i < 3} />
                </span>
                <span className="rw-card-badge ui">{badge(item)}</span>
                <span className="rw-card-label ui">
                  <span className="muted">{item.index}</span> {projectTitle(item)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rw-place" role="region" aria-label="Where Ruth is based" hidden={!home}>
          <p className="ui muted">Based in</p>
          <p className="rw-place-city display">{PROFILE.location}</p>
          <p className="ui muted rw-place-time">
            Central European Time · <Clock city="Madrid" timeZone={PROFILE.timeZone} />
          </p>
          <p className="rw-place-status ui">
            <i className="rw-green-dot" aria-hidden="true" />
            {PROFILE.availability}
          </p>
          <p className="rw-place-copy muted">{PROFILE.role} — React, Node.js and Python, end to end.</p>
          <a href={LINKS.email.href} className="rw-place-primary ui" data-cursor="Write">
            Work with me
          </a>
          <a
            href="#about"
            className="rw-place-secondary ui"
            onClick={() => {
              setHome(false);
              globe.current?.release();
              motion.current.paused = false;
            }}
          >
            About me
          </a>
        </div>
      </div>

      <p className="rw-foot ui fade-in">
        <span>{PROFILE.role}</span>
        <span className="muted">{PROFILE.stackLine}</span>
        <span>
          <i className="status-dot" aria-hidden="true" /> {PROFILE.availability}
        </span>
      </p>

      <dialog
        ref={dialog}
        className="rw-panel"
        aria-labelledby="rw-panel-title"
        onClose={onClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {project ? (
          <div className="rw-panel-inner" data-lenis-prevent>
            <div className="rw-panel-copy">
              <p className="ui rw-kicker">
                {project.years ? `${project.years} · ` : ""}
                {project.context}
              </p>
              <h2 id="rw-panel-title" className="display rw-panel-title">
                {project.title}
                {project.titleItalic ? <em> {project.titleItalic}</em> : null}
              </h2>
              <p className="rw-panel-summary">{project.summary}</p>
              {project.stack.length > 0 ? (
                <>
                  <p className="ui rw-label">Built with</p>
                  <ul className="rw-chips">
                    {project.stack.map((tech) => (
                      <li key={tech} className="ui">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {project.highlights.length > 0 ? (
                <>
                  <p className="ui rw-label">Highlights</p>
                  <ul className="rw-highlights">
                    {project.highlights.map((highlight) => (
                      <li key={highlight.lead}>{highlight.lead}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="rw-panel-summary muted">{project.description}</p>
              )}
              <ul className="rw-tags">
                {project.tags.map((tag) => (
                  <li key={tag} className="ui">
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="rw-actions">
                <Link href={`/work/${project.slug}/`} className="rw-primary ui" onClick={() => dialog.current?.close()}>
                  Read the case study →
                </Link>
                {project.link ? (
                  <a href={project.link.href} className="rw-secondary ui" target="_blank" rel="noreferrer">
                    Open full site in new tab ↗
                  </a>
                ) : null}
              </div>
            </div>

            <figure className="rw-browser">
              <div className="rw-browser-bar">
                <i />
                <i />
                <i />
                <span className="ui">{project.illustration ? projectTitle(project) : (project.link?.label ?? projectTitle(project))}</span>
                <button ref={closeButton} type="button" className="rw-close" aria-label="Close" onClick={() => dialog.current?.close()}>
                  ✕
                </button>
              </div>
              <div className="rw-browser-view">
                <ProjectCover key={project.slug} kind={project.cover} number={project.index} eager />
              </div>
              <figcaption className="ui muted">
                {project.illustration
                  ? "Illustration of the system — not a screenshot of the client's product."
                  : "Esc, or click outside, to resume the orbit."}
              </figcaption>
            </figure>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
