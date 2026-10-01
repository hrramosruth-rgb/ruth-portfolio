"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectCover } from "@/components/covers/project-cover";
import type { Project } from "@/data/content";
import { PROFILE, PROJECTS, projectTitle } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";
import { TONES } from "@/lib/tones";

const SLIDE_MS = 4500;
const COUNT = PROJECTS.length;
const pad = (n: number) => String(n).padStart(2, "0");


type Slide = { index: number; previous: number; dir: 1 | -1; serial: number };

function Letters({ text, offset = 0 }: { text: string; offset?: number }) {
  let i = offset;
  return (
    <>
      {text.split(" ").map((word, w, words) => (
        <span key={w} className="sc-word">
          {[...word].map((letter) => (
            <span key={i} className="ch" style={{ "--i": i++ } as React.CSSProperties}>
              {letter}
            </span>
          ))}
          {w < words.length - 1 ? <span className="ch">&nbsp;</span> : null}
        </span>
      ))}
    </>
  );
}

function TitleLayer({ project, mode }: { project: Project; mode: "in" | "out" }) {
  return (
    <span className={`sc-title-layer is-${mode}`} aria-hidden="true">
      <span className="sc-line">
        <Letters text={project.title} />
      </span>
      {project.titleItalic ? (
        <span className="sc-line sc-line-italic">
          <Letters text={project.titleItalic} offset={project.title.length} />
        </span>
      ) : null}
    </span>
  );
}

/**
 * The landing carousel: every project on a cinematic stage. Slides wipe in with a zoom-settle,
 * titles change letter by letter, the counter rolls, and the rail's progress line drives autoplay
 * (paused on hover, off-screen, or under reduced motion). Drag, swipe or use ← → to move.
 */
export function Showcase() {
  const [slide, setSlide] = useState<Slide>({ index: 0, previous: -1, dir: 1, serial: 0 });
  const [hovering, setHovering] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);

  const go = useCallback(
    (to: number) =>
      setSlide((s) => {
        const index = ((to % COUNT) + COUNT) % COUNT;
        if (index === s.index) return s;
        return { index, previous: s.index, dir: index > s.index ? 1 : -1, serial: s.serial + 1 };
      }),
    [],
  );
  const step = useCallback(
    (delta: 1 | -1) =>
      setSlide((s) => ({ index: (s.index + delta + COUNT) % COUNT, previous: s.index, dir: delta, serial: s.serial + 1 })),
    [],
  );

  // Keyboard arrows while the carousel is on screen; pause autoplay off-screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      setOffscreen(!visible);
    });
    observer.observe(el);
    const onKey = (event: KeyboardEvent) => {
      if (!visible || event.altKey || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [step]);

  // Stage: mouse parallax, drag or swipe to move, click to open the case study.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let start: { x: number; y: number; id: number } | null = null;
    let dx = 0;

    const down = (event: PointerEvent) => {
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
      dx = 0;
      el.classList.add("is-dragging");
    };
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      el.style.setProperty("--mx", (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", (((event.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
      if (!start) return;
      dx = event.clientX - start.x;
      el.style.setProperty("--drag", `${dx}px`);
    };
    const up = (event: PointerEvent) => {
      if (!start) return;
      const moved = Math.abs(dx);
      const vertical = Math.abs(event.clientY - start.y);
      start = null;
      el.classList.remove("is-dragging");
      el.style.setProperty("--drag", "0px");
      if (moved > 60) step(dx < 0 ? 1 : -1);
      else if (moved < 6 && vertical < 6 && event.type === "pointerup") cta.current?.click();
    };
    const leave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };

    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
    };
  }, [step]);

  // Magnetic call to action.
  useEffect(() => {
    const el = cta.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      el.style.setProperty("--tx", `${(event.clientX - box.left - box.width / 2) * 0.28}px`);
      el.style.setProperty("--ty", `${(event.clientY - box.top - box.height / 2) * 0.28}px`);
    };
    const leave = () => {
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const current = PROJECTS[slide.index] as Project;
  const previous = slide.previous >= 0 ? PROJECTS[slide.previous] : undefined;
  const upcoming = PROJECTS[(slide.index + 1) % COUNT] as Project;
  const href = `/work/${current.slug}/`;
  const paused = hovering || offscreen;

  const onProgressEnd = () => {
    if (prefersReducedMotion()) return;
    step(1);
  };

  return (
    <section
      ref={root}
      className={`sc${paused ? " is-paused" : ""}`}
      data-theme="ink"
      aria-roledescription="carousel"
      aria-label="Selected work"
      style={{ "--tone": TONES[current.cover] } as React.CSSProperties}
    >
      <div className="sc-glow" aria-hidden="true" />
      <div className="sc-grain" aria-hidden="true" />

      <header className="sc-caption ui fade-in">
        <h1 className="sc-caption-name">
          {PROFILE.name} <span className="muted">— {PROFILE.role}</span>
        </h1>
        <span className="muted sc-caption-mid">Selected work</span>
        <span className="sc-caption-status">
          <i className="status-dot" aria-hidden="true" />
          {PROFILE.availability}
        </span>
      </header>

      <div className="sc-main" onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
        <div className="sc-copy">
          <div className="sc-count ui" aria-hidden="true">
            <span className="sc-odo">
              <span className="sc-odo-col" style={{ transform: `translateY(${-slide.index}em)` }}>
                {PROJECTS.map((project) => (
                  <span key={project.slug}>{project.index}</span>
                ))}
              </span>
            </span>
            <span className="muted">/ {pad(COUNT)}</span>
          </div>

          <p key={`meta-${slide.serial}`} className="sc-meta ui sc-rise" style={{ "--d": "0.2s" } as React.CSSProperties}>
            {current.years ? `${current.years} · ` : ""}
            {current.context}
          </p>

          <h2 className="sc-title display">
            <span className="sr-only">{projectTitle(current)}</span>
            {previous ? <TitleLayer key={`out-${slide.serial}`} project={previous} mode="out" /> : null}
            <TitleLayer key={`in-${slide.serial}`} project={current} mode="in" />
          </h2>

          <p key={`sum-${slide.serial}`} className="sc-summary sc-rise" style={{ "--d": "0.45s" } as React.CSSProperties}>
            {current.summary}
          </p>

          <div className="sc-actions">
            <Link ref={cta} href={href} className="sc-cta" data-cursor="Open" aria-label={`View the ${projectTitle(current)} case study`}>
              <svg className="sc-cta-ring" viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <path id="sc-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text>
                  <textPath href="#sc-circle" textLength="230" lengthAdjust="spacing">
                    View case study · View case study ·
                  </textPath>
                </text>
              </svg>
              <span className="sc-cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <div className="sc-arrows">
              <button type="button" className="sc-arrow" onClick={() => step(-1)} aria-label="Previous project" data-cursor="Prev">
                ←
              </button>
              <button type="button" className="sc-arrow" onClick={() => step(1)} aria-label="Next project" data-cursor="Next">
                →
              </button>
            </div>
            {current.link ? (
              <a href={current.link.href} className="ui u-line sc-visit" target="_blank" rel="noreferrer">
                Visit {current.link.label} ↗
              </a>
            ) : null}
          </div>
        </div>

        <div ref={stage} className="sc-stage" data-dir={slide.dir > 0 ? "next" : "prev"} data-cursor="View" aria-hidden="true">
          <div className="sc-stage-inner">
            {PROJECTS.map((project, i) => (
              <div
                key={project.slug}
                className={`sc-slide${i === slide.index ? " is-current" : ""}${i === slide.previous ? " is-leaving" : ""}`}
              >
                <div className="sc-media">
                  <div className="sc-parallax">
                    <ProjectCover kind={project.cover} number={project.index} eager={i < 2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <span className="sc-stage-drag ui">Drag</span>
        </div>

        <button type="button" className="sc-peek" onClick={() => step(1)} data-cursor="Next" aria-label={`Next: ${projectTitle(upcoming)}`}>
          <span className="sc-peek-frame">
            <span key={`peek-${slide.serial}`} className="sc-peek-media">
              <ProjectCover kind={upcoming.cover} number={upcoming.index} />
            </span>
          </span>
          <span key={`peek-label-${slide.serial}`} className="sc-peek-label ui sc-rise" style={{ "--d": "0.5s" } as React.CSSProperties}>
            <span className="muted">Next</span>
            <span>{projectTitle(upcoming)}</span>
          </span>
        </button>
      </div>

      <ol className="sc-rail" aria-label="All projects">
        {PROJECTS.map((project, i) => (
          <li key={project.slug}>
            <button
              type="button"
              className={i === slide.index ? "is-active" : undefined}
              aria-current={i === slide.index ? "true" : undefined}
              onClick={() => go(i)}
            >
              <span className="ui muted">{project.index}</span>
              <span className="ui sc-rail-title">{projectTitle(project)}</span>
              <i className="sc-rail-line">
                {i === slide.index ? (
                  <b
                    key={`progress-${slide.serial}`}
                    className="sc-progress"
                    style={{ animationDuration: `${SLIDE_MS}ms` }}
                    onAnimationEnd={onProgressEnd}
                  />
                ) : null}
              </i>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
