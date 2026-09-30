"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProjectCover } from "@/components/covers/project-cover";
import { PROJECTS } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

/** Numbered project index. On fine pointers, the hovered project's cover follows the cursor. */
export function WorkIndex() {
  const [active, setActive] = useState<number | null>(null);
  // The peek keeps its last cover while it closes, so it never blanks mid-animation.
  const [last, setLast] = useState(0);
  const peek = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = peek.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const ease = prefersReducedMotion() ? 1 : 0.09;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let px = x;
    let py = y;
    let raf = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
    };
    const loop = () => {
      px += (x - px) * ease;
      py += (y - py) * ease;
      el.style.transform = `translate3d(${px - el.offsetWidth / 2}px, ${py - el.offsetHeight / 2}px, 0)`;
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
        <h2 id="work-title" className="display">
          Selected <em>work</em>
        </h2>
        <span className="ui muted">Index — {String(PROJECTS.length).padStart(2, "0")}</span>
      </div>

      <ol className="work-list" onPointerLeave={() => setActive(null)}>
        {PROJECTS.map((project, i) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}/`}
              className="work-row"
              data-cursor="View"
              onPointerEnter={() => enter(i)}
              onFocus={() => enter(i)}
              onBlur={() => setActive(null)}
            >
              <span className="ui muted">{project.index} /</span>
              <span className="work-title display">
                {project.title}
                {project.titleItalic ? <em> {project.titleItalic}</em> : null}
              </span>
              <span className="ui muted work-context">{project.context}</span>
              <span className="ui muted work-years">{project.years}</span>
              <span className="work-thumb">
                <ProjectCover kind={project.cover} number={project.index} />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div ref={peek} className={`work-peek${active === null ? "" : " is-on"}`} aria-hidden="true">
        {shown ? <ProjectCover kind={shown.cover} number={shown.index} eager /> : null}
      </div>
    </section>
  );
}
