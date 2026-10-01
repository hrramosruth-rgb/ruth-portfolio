"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProjectCover } from "@/components/covers/project-cover";
import { InView } from "@/components/motion/in-view";
import { SplitText } from "@/components/motion/split-text";
import { useReveal } from "@/components/motion/use-reveal";
import { PROJECTS } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

const cell = (n: number) => ({ "--c": n }) as React.CSSProperties;

/**
 * Numbered project index. Rows draw their rule and lift their text in as they scroll into view; on
 * hover an ink fill sweeps up behind the row and, on fine pointers, the project's cover follows the
 * cursor, tilting with its speed.
 */
export function WorkIndex() {
  const [active, setActive] = useState<number | null>(null);
  // The peek keeps its last cover while it closes, so it never blanks mid-animation.
  const [last, setLast] = useState(0);
  const peek = useRef<HTMLDivElement>(null);
  const list = useReveal<HTMLOListElement>(".work-item", 0.25);

  useEffect(() => {
    const el = peek.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
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
  }, []);

  const shown = PROJECTS[last] ?? PROJECTS[0];
  const enter = (i: number) => {
    setActive(i);
    setLast(i);
  };

  return (
    <section id="work" className="section work" data-theme="paper" aria-labelledby="work-title">
      <div className="section-head">
        <InView>
          <h2 id="work-title" className="display work-heading">
            <span className="sr-only">Selected work</span>
            <SplitText text="Selected" delay={0} />
            <SplitText text="work" className="italic" delay={0.25} />
          </h2>
        </InView>
        <span className="ui muted">Index — {String(PROJECTS.length).padStart(2, "0")}</span>
      </div>

      <ol ref={list} className="work-list" onPointerLeave={() => setActive(null)}>
        {PROJECTS.map((project, i) => (
          <li key={project.slug} className="work-item" style={{ "--row": i % 4 } as React.CSSProperties}>
            <Link
              href={`/work/${project.slug}/`}
              className="work-row"
              data-cursor="View"
              onPointerEnter={() => enter(i)}
              onFocus={() => enter(i)}
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
        ))}
      </ol>

      <div ref={peek} className={`work-peek${active === null ? "" : " is-on"}`} aria-hidden="true">
        {shown ? (
          <span key={shown.slug} className="work-peek-media">
            <ProjectCover kind={shown.cover} number={shown.index} eager />
          </span>
        ) : null}
      </div>
    </section>
  );
}
