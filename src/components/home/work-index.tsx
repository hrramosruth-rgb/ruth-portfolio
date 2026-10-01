"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProjectCover } from "@/components/covers/project-cover";
import { InView } from "@/components/motion/in-view";
import { SplitText } from "@/components/motion/split-text";
import type { Project, WorkTag } from "@/data/content";
import { PROJECTS, WORK_TAGS } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";
import { TONES } from "@/lib/tones";

type Filter = "All" | WorkTag;
type View = "grid" | "list";

const FILTERS: Filter[] = ["All", ...WORK_TAGS];
const count = (filter: Filter) => (filter === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.tags.includes(filter)).length);
const cell = (n: number) => ({ "--c": n }) as React.CSSProperties;

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" />
      <rect x="9" y="1" width="6" height="6" />
      <rect x="1" y="9" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="2" width="14" height="2" />
      <rect x="1" y="7" width="14" height="2" />
      <rect x="1" y="12" width="14" height="2" />
    </svg>
  );
}

/** A project as a browser window on its own tinted backdrop. */
function GridCard({ project, order }: { project: Project; order: number }) {
  const title = [project.title, project.titleItalic].filter(Boolean).join(" ");
  return (
    <li className="wg-card" style={{ "--tone": TONES[project.cover], "--order": order % 2 } as React.CSSProperties}>
      <Link href={`/work/${project.slug}/`} className="wg-link" data-cursor="View" aria-label={`${title} — ${project.context}`}>
        <span className="wg-frame">
          <span className="wg-media">
            <span className="wg-window">
              <span className="wg-bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>{project.link?.label ?? title}</span>
              </span>
              <span className="wg-screen">
                <ProjectCover kind={project.cover} number={project.index} />
              </span>
            </span>
          </span>
          <span className="wg-view ui" aria-hidden="true">
            View case study <span>→</span>
          </span>
        </span>
        <span className="wg-meta">
          <span className="wg-title display">
            <span>
              {project.title}
              {project.titleItalic ? <em> {project.titleItalic}</em> : null}
            </span>
          </span>
          <span className="ui muted wg-context">{project.context}</span>
        </span>
        <span className="wg-sub ui muted">
          <span>{project.index}</span>
          <span>{project.years ?? "Selected"}</span>
          <span className="wg-tags">{project.tags.join(" · ")}</span>
        </span>
      </Link>
    </li>
  );
}

/**
 * Selected work, the way award-winning portfolios show it: a staggered gallery of the projects as
 * browser windows on tinted backdrops (filterable, with a list view). Cards wipe up and settle from
 * a zoom as they arrive and drift with a light parallax; hover zooms the screen and raises a
 * "View case study" pill. The list view keeps the ink sweep and the cover that follows the cursor.
 */
export function WorkIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<View>("grid");
  const [active, setActive] = useState<number | null>(null);
  const [last, setLast] = useState(0);
  const root = useRef<HTMLElement>(null);
  const peek = useRef<HTMLDivElement>(null);

  const projects = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter));

  // Reveal cards/rows as they enter (re-run whenever the filter or view swaps the items).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }),
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    el.querySelectorAll(".wg-card, .work-item").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [filter, view]);

  // Gallery parallax: each screen drifts against the scroll.
  useEffect(() => {
    const el = root.current;
    if (!el || view !== "grid" || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      el.querySelectorAll<HTMLElement>(".wg-frame").forEach((frame) => {
        const box = frame.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        const progress = (box.top + box.height / 2 - vh / 2) / vh; // -0.5 … 0.5 around the centre
        frame.style.setProperty("--py", (progress * -10).toFixed(2));
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [filter, view]);

  // List view: the cover that follows the cursor, tilting with its speed.
  useEffect(() => {
    const el = peek.current;
    if (!el || view !== "list" || !window.matchMedia("(pointer: fine)").matches) return;
    const ease = prefersReducedMotion() ? 1 : 0.09;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let px = x;
    let py = y;
    let tilt = 0;
    let raf = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
    };
    const loop = () => {
      const vx = (x - px) * ease;
      px += vx;
      py += (y - py) * ease;
      tilt += (Math.max(-12, Math.min(12, vx * 0.5)) - tilt) * 0.12;
      el.style.transform = `translate3d(${px - el.offsetWidth / 2}px, ${py - el.offsetHeight / 2}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [view]);

  const shown = PROJECTS[last] ?? PROJECTS[0];
  const enter = (i: number) => {
    setActive(i);
    setLast(i);
  };

  return (
    <section ref={root} id="work" className="section work" data-theme="paper" aria-labelledby="work-title">
      <div className="section-head">
        <InView>
          <h2 id="work-title" className="display work-heading">
            <span className="sr-only">Selected work</span>
            <SplitText text="Selected" delay={0} />
            <SplitText text="work" className="italic" delay={0.25} />
          </h2>
        </InView>
        <p className="work-lede muted">
          Products shipped end to end — from no-code SaaS and enterprise retail to Python services and storefronts.
        </p>
      </div>

      <div className="wf-bar">
        <div className="wf-filters" role="group" aria-label="Filter projects">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={`wf-pill ui${filter === item ? " is-active" : ""}`}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
              <sup>{count(item)}</sup>
            </button>
          ))}
        </div>
        <div className="wf-views" role="group" aria-label="Layout">
          <button type="button" className={`wf-view${view === "grid" ? " is-active" : ""}`} aria-pressed={view === "grid"} aria-label="Grid view" onClick={() => setView("grid")}>
            <GridIcon />
          </button>
          <button type="button" className={`wf-view${view === "list" ? " is-active" : ""}`} aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")}>
            <ListIcon />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <ul key={`grid-${filter}`} className="wg-grid">
          {projects.map((project, i) => (
            <GridCard key={project.slug} project={project} order={i} />
          ))}
        </ul>
      ) : (
        <ol key={`list-${filter}`} className="work-list" onPointerLeave={() => setActive(null)}>
          {projects.map((project, i) => {
            const index = PROJECTS.indexOf(project);
            return (
              <li key={project.slug} className="work-item" style={{ "--row": i % 4 } as React.CSSProperties}>
                <Link
                  href={`/work/${project.slug}/`}
                  className="work-row"
                  data-cursor="View"
                  onPointerEnter={() => enter(index)}
                  onFocus={() => enter(index)}
                  onBlur={() => setActive(null)}
                >
                  <span className="work-fill" aria-hidden="true" />
                  <span className="work-cell ui muted" style={cell(0)}>
                    <span>{project.index} /</span>
                  </span>
                  <span className="work-cell work-title display" style={cell(1)}>
                    <span>
                      <span className="work-title-text">
                        {project.title}
                        {project.titleItalic ? <em> {project.titleItalic}</em> : null}
                      </span>
                    </span>
                  </span>
                  <span className="work-cell ui muted work-context" style={cell(2)}>
                    <span>{project.context}</span>
                  </span>
                  <span className="work-cell ui muted work-years" style={cell(3)}>
                    <span>{project.years ?? "—"}</span>
                  </span>
                  <span className="work-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="work-thumb">
                    <ProjectCover kind={project.cover} number={project.index} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      {view === "list" ? (
        <div ref={peek} className={`work-peek${active === null ? "" : " is-on"}`} aria-hidden="true">
          {shown ? (
            <span key={shown.slug} className="work-peek-media">
              <ProjectCover kind={shown.cover} number={shown.index} eager />
            </span>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
