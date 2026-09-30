"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/brand/monogram";
import { ProjectCover } from "@/components/covers/project-cover";
import { getLenis } from "@/components/motion/smooth-scroll";
import { SplitText } from "@/components/motion/split-text";
import { PROFILE, PROJECTS, projectTitle } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

const STEP = 360 / PROJECTS.length;
const AUTO_SPEED = 0.07; // degrees per frame

/**
 * The home hero: Ruth's projects orbit the monogram. The ring turns on its own, slows under the
 * pointer, spins when dragged and brings a focused card to the front. Clicking a project stops the
 * orbit and opens its detail panel; clicking the monogram scrolls to About.
 */
export function ProjectWorld() {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLButtonElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const focused = useRef<number | null>(null);
  const paused = useRef(false);
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
      ringEl.style.transform = `translateZ(calc(var(--r) * -1)) rotateX(-12deg) rotateY(${angle}deg)`;
      coreEl.style.transform = `translate(-50%, -50%) rotateY(${-angle}deg)`;
      cards.current.forEach((card, i) => {
        if (!card) return;
        const front = (Math.cos(((angle + i * STEP) * Math.PI) / 180) + 1) / 2; // 1 = facing the viewer
        card.style.filter = `grayscale(${1 - front ** 3}) brightness(${0.3 + 0.7 * front})`;
        card.style.setProperty("--front", front.toFixed(3));
      });
    };

    const loop = () => {
      if (visible && !drag) {
        if (focused.current !== null) {
          const target = -focused.current * STEP;
          const delta = ((((target - angle) % 360) + 540) % 360) - 180; // shortest way round
          angle += delta * (still ? 1 : 0.1);
        } else {
          speed += ((hovering || paused.current || still ? 0 : AUTO_SPEED) - speed) * 0.05;
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
      angle = drag.angle + dx * 0.22;
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

  // Leaving the page with the panel open must not leave scrolling stopped.
  useEffect(
    () => () => {
      document.documentElement.classList.remove("has-dialog");
      getLenis()?.start();
    },
    [],
  );

  const openProject = (i: number) => {
    if (dragged.current) return;
    setOpen(i);
    paused.current = true;
    focused.current = i;
    dialog.current?.showModal();
    // Start at the top with focus on Close (otherwise focus lands on the first link, mid-panel on phones).
    if (dialog.current) dialog.current.scrollTop = 0;
    close.current?.focus({ preventScroll: true });
    document.documentElement.classList.add("has-dialog");
    getLenis()?.stop();
  };

  const onClose = () => {
    paused.current = false;
    focused.current = null;
    document.documentElement.classList.remove("has-dialog");
    getLenis()?.start();
  };

  const meetRuth = () => {
    if (dragged.current) return;
    const about = document.getElementById("about");
    if (!about) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(about, { duration: 1.6 });
    else about.scrollIntoView();
  };

  const project = PROJECTS[open] ?? PROJECTS[0];

  return (
    <section className="world" data-theme="ink" aria-labelledby="world-title">
      <header className="world-head">
        <h1 id="world-title" className="world-title display">
          <span className="sr-only">{PROFILE.name}</span>
          <SplitText text={PROFILE.firstName} className="split--intro" delay={0.25} />
          <SplitText text={PROFILE.lastName} className="split--intro world-title-last" delay={0.4} />
        </h1>
        <p className="world-hint ui fade-in">
          {PROFILE.role} · {PROFILE.city} <span className="muted">— click a project to stop the orbit, or the monogram to meet Ruth</span>
        </p>
      </header>

      <div ref={stage} className="orbit" data-cursor="Drag">
        <div ref={ring} className="orbit-ring">
          <button ref={core} type="button" className="orbit-core" onClick={meetRuth} aria-label="About Ruth" data-cursor="Meet Ruth">
            <Monogram />
          </button>
          {PROJECTS.map((item, i) => (
            <button
              key={item.slug}
              ref={(el) => {
                cards.current[i] = el;
              }}
              type="button"
              className="orbit-card"
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--r))` }}
              aria-label={`${projectTitle(item)}, ${item.context} — open details`}
              data-cursor="Open"
              onClick={() => openProject(i)}
              onFocus={() => {
                focused.current = i;
              }}
              onBlur={() => {
                if (!paused.current) focused.current = null;
              }}
            >
              <ProjectCover kind={item.cover} number={item.index} eager={i < 3} />
              <span className="orbit-card-label ui">
                <span className="muted">{item.index}</span> {projectTitle(item)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="world-bar ui fade-in">
        <span>{PROFILE.stackLine}</span>
        <span className="muted world-bar-city">{PROFILE.location}</span>
        <span className="world-bar-status">
          <i className="status-dot" aria-hidden="true" />
          {PROFILE.availability}
        </span>
      </div>

      <dialog
        ref={dialog}
        className="panel"
        aria-labelledby="panel-title"
        onClose={onClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {project ? (
          <div className="panel-inner" data-lenis-prevent>
            <div className="panel-copy">
              <p className="ui panel-kicker">
                {project.years ? `${project.years} · ` : ""}
                {project.context}
              </p>
              <h2 id="panel-title" className="display panel-title">
                {project.title}
                {project.titleItalic ? <em> {project.titleItalic}</em> : null}
              </h2>
              <p className="panel-summary">{project.summary}</p>
              {project.stack.length > 0 ? (
                <>
                  <p className="ui panel-label">Built with</p>
                  <ul className="panel-chips">
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
                  <p className="ui panel-label">Highlights</p>
                  <ul className="panel-highlights">
                    {project.highlights.map((highlight) => (
                      <li key={highlight.lead}>{highlight.lead}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              <div className="panel-actions">
                <Link
                  href={`/work/${project.slug}/`}
                  className="panel-primary ui"
                  onClick={() => dialog.current?.close()}
                >
                  Read the case study →
                </Link>
                {project.link ? (
                  <a href={project.link.href} className="ui u-line" target="_blank" rel="noreferrer">
                    Visit {project.link.label} ↗
                  </a>
                ) : null}
              </div>
            </div>
            <figure className="panel-browser">
              <div className="panel-browser-bar">
                <i />
                <i />
                <i />
                <span className="ui">{project.link?.label ?? projectTitle(project)}</span>
              </div>
              <div className="panel-browser-view">
                <ProjectCover key={project.slug} kind={project.cover} number={project.index} eager />
              </div>
            </figure>
            <form method="dialog">
              <button ref={close} type="submit" className="panel-close ui">
                Close ✕
              </button>
            </form>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
