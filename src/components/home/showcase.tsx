"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectCover } from "@/components/covers/project-cover";
import type { CoverKind, Project } from "@/data/content";
import { PROFILE, PROJECTS, projectTitle } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

const SLIDE_MS = 7000;
const COUNT = PROJECTS.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Mood colour washed over each project's background. */
const TONES: Record<CoverKind, string> = {
  airrange: "#2b3f9e",
  manhattan: "#0f6b4f",
  albertsons: "#8c1c2b",
  search: "#8a7651",
  personalization: "#a2394c",
  components: "#6f6455",
  touch: "#7a1f2e",
  shopify: "#8a6440",
};

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
 * The landing page: every project as a full-screen picture, with its story in front. Slides wipe in
 * and settle from a zoom, then drift slowly; the title changes letter by letter; the rail of
 * thumbnails shows every project and its progress line drives autoplay (paused on hover, off-screen,
 * or under reduced motion). Drag or swipe, use ← →, or pick a thumbnail.
 */
export function Showcase() {
  const [slide, setSlide] = useState<Slide>({ index: 0, previous: -1, dir: 1, serial: 0 });
  const [hovering, setHovering] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const root = useRef<HTMLElement>(null);
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

  // Keyboard arrows while on screen, autoplay pause off-screen, drag/swipe and mouse parallax.
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
      if ((event.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    let start: { x: number; y: number } | null = null;
    let dx = 0;
    const down = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest("a, button")) return;
      start = { x: event.clientX, y: event.clientY };
      dx = 0;
      el.classList.add("is-dragging");
    };
    const move = (event: PointerEvent) => {
      el.style.setProperty("--mx", ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      if (!start) return;
      dx = event.clientX - start.x;
      el.style.setProperty("--drag", `${dx}px`);
    };
    const up = () => {
      if (!start) return;
      start = null;
      el.classList.remove("is-dragging");
      el.style.setProperty("--drag", "0px");
      if (Math.abs(dx) > 70) step(dx < 0 ? 1 : -1);
    };

    window.addEventListener("keydown", onKey);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
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
      data-dir={slide.dir > 0 ? "next" : "prev"}
      aria-roledescription="carousel"
      aria-label="Selected work"
      style={{ "--tone": TONES[current.cover], "--slide-ms": `${SLIDE_MS}ms` } as React.CSSProperties}
    >
      {/* Full-screen pictures */}
      <div className="sc-bg" aria-hidden="true">
        <div className="sc-bg-inner">
          {PROJECTS.map((project, i) => (
            <div
              key={project.slug}
              className={`sc-slide${i === slide.index ? " is-current" : ""}${i === slide.previous ? " is-leaving" : ""}`}
            >
              <div className="sc-media">
                <div className="sc-drift">
                  <div className="sc-parallax">
                    <ProjectCover kind={project.cover} number={project.index} eager={i < 2} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sc-shade" />
        <div className="sc-grain" />
      </div>

      <header className="sc-caption ui fade-in">
        <h1 className="sc-caption-name">
          {PROFILE.name} <span className="muted">— {PROFILE.role}, {PROFILE.city}</span>
        </h1>
        <span className="sc-caption-status">
          <i className="status-dot" aria-hidden="true" />
          {PROFILE.availability}
        </span>
      </header>

      {/* The story in front */}
      <div className="sc-copy" onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
        <div className="sc-count ui" aria-hidden="true">
          <span className="sc-odo">
            <span className="sc-odo-col" style={{ transform: `translateY(${-slide.index}em)` }}>
              {PROJECTS.map((project) => (
                <span key={project.slug}>{project.index}</span>
              ))}
            </span>
          </span>
          <span className="muted">/ {pad(COUNT)}</span>
          <span key={`meta-${slide.serial}`} className="sc-meta sc-rise" style={{ "--d": "0.2s" } as React.CSSProperties}>
            {current.years ? `${current.years} · ` : ""}
            {current.context}
          </span>
        </div>

        <h2 className="sc-title display">
          <span className="sr-only">{projectTitle(current)}</span>
          {previous ? <TitleLayer key={`out-${slide.serial}`} project={previous} mode="out" /> : null}
          <TitleLayer key={`in-${slide.serial}`} project={current} mode="in" />
        </h2>

        <p key={`sum-${slide.serial}`} className="sc-summary sc-rise" style={{ "--d": "0.45s" } as React.CSSProperties}>
          {current.summary}
        </p>

        {current.stack.length > 0 ? (
          <ul key={`stack-${slide.serial}`} className="sc-stack sc-rise" style={{ "--d": "0.6s" } as React.CSSProperties}>
            {current.stack.slice(0, 6).map((tech) => (
              <li key={tech} className="ui">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="sc-actions">
          <Link
            ref={cta}
            href={`/work/${current.slug}/`}
            className="sc-cta"
            data-cursor="Open"
            aria-label={`View the ${projectTitle(current)} case study`}
          >
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
          <div className="sc-links ui">
            <span key={`next-${slide.serial}`} className="sc-next sc-rise" style={{ "--d": "0.7s" } as React.CSSProperties}>
              <span className="muted">Next —</span> {projectTitle(upcoming)}
            </span>
            {current.link ? (
              <a href={current.link.href} className="u-line" target="_blank" rel="noreferrer">
                Visit {current.link.label} ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Every project, with the autoplay progress line */}
      <ol className="sc-rail" aria-label="All projects" onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
        {PROJECTS.map((project, i) => (
          <li key={project.slug}>
            <button
              type="button"
              className={i === slide.index ? "is-active" : undefined}
              aria-current={i === slide.index ? "true" : undefined}
              aria-label={`Show ${projectTitle(project)}`}
              onClick={() => go(i)}
            >
              <span className="sc-thumb" aria-hidden="true">
                <ProjectCover kind={project.cover} number="" />
              </span>
              <span className="sc-rail-text">
                <span className="ui muted">{project.index}</span>
                <span className="ui sc-rail-title">{projectTitle(project)}</span>
              </span>
              <i className="sc-rail-line">
                {i === slide.index ? (
                  <b key={`progress-${slide.serial}`} className="sc-progress" onAnimationEnd={onProgressEnd} />
                ) : null}
              </i>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
