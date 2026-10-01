"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Counter } from "@/components/motion/counter";
import { InView } from "@/components/motion/in-view";
import { SplitText } from "@/components/motion/split-text";
import { useReveal } from "@/components/motion/use-reveal";
import { CAREER, CRAFT_MARQUEE, FIGURES, STACK_MARQUEE, getProject, projectTitle } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

const pad = (n: number) => String(n).padStart(2, "0");

function Marquee({ items, className }: { items: string[]; className?: string }) {
  const doubled = [...items, ...items];
  return (
    <div className={className ? `mq-row ${className}` : "mq-row"}>
      <div className="mq-track">
        {doubled.map((item, i) => (
          <span key={i} className={i % 2 ? "mq-item is-italic" : "mq-item"}>
            {item}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Figures and career, on ink. Two marquees of her stack run in opposite directions and speed up with
 * scrolling; figures count up as their rules draw; the timeline's sticky year follows the role in
 * view while a rule fills with progress.
 */
export function Career() {
  const root = useReveal<HTMLElement>(".rv", 0.2);
  const timeline = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Scroll-linked timeline: progress rule and the role in focus.
  useEffect(() => {
    const el = timeline.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>(".career-item")];
    let raf = 0;
    let current = -1;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const box = el.getBoundingClientRect();
      const progress = Math.min(Math.max((vh * 0.55 - box.top) / box.height, 0), 1);
      el.style.setProperty("--p", progress.toFixed(4));
      let index = 0;
      items.forEach((item, i) => {
        if (item.getBoundingClientRect().top < vh * 0.55) index = i;
      });
      if (index !== current) {
        current = index;
        setActive(index);
      }
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
  }, []);

  // Marquees speed up with scroll velocity and follow the scroll direction.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const animations = [...el.querySelectorAll<HTMLElement>(".mq-track")].flatMap((track) => track.getAnimations());
    if (animations.length === 0) return;
    let lastY = window.scrollY;
    let direction = 1;
    let rate = 1;
    let raf = 0;
    const loop = () => {
      const y = window.scrollY;
      const velocity = y - lastY;
      lastY = y;
      if (velocity > 0.5) direction = 1;
      else if (velocity < -0.5) direction = -1;
      const target = (1 + Math.min(Math.abs(velocity) * 0.12, 5)) * direction;
      rate += (target - rate) * 0.08;
      animations.forEach((animation) => {
        animation.playbackRate = rate;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [root]);

  const role = CAREER[active] ?? CAREER[0];

  return (
    <section ref={root} id="career" className="section career" data-theme="ink" aria-labelledby="career-title">
      <div className="mq" aria-hidden="true">
        <Marquee items={STACK_MARQUEE} />
        <Marquee items={CRAFT_MARQUEE} className="mq-row-outline" />
      </div>

      <div className="section-head">
        <InView>
          <h2 className="display career-heading">
            <span className="sr-only">In numbers</span>
            <SplitText text="In" delay={0} />
            <SplitText text="numbers" className="italic" delay={0.12} />
          </h2>
        </InView>
        <span className="ui muted">Measured results</span>
      </div>
      <ul className="figures">
        {FIGURES.map((figure, i) => (
          <li key={figure.label} className="rv figure" style={{ "--row": i } as React.CSSProperties}>
            <Counter figure={figure} className="display" />
            <span className="muted">{figure.label}</span>
          </li>
        ))}
      </ul>

      <div ref={timeline} className="career-grid">
        <aside className="career-aside" aria-hidden="true">
          <span className="career-rail">
            <i />
          </span>
          <div className="career-now">
            <span className="ui muted">Career</span>
            <span key={`year-${active}`} className="career-year display">
              {role?.period}
            </span>
            <span key={`org-${active}`} className="ui career-now-org">
              {role?.org}
            </span>
            <span className="ui muted">
              {pad(active + 1)} / {pad(CAREER.length)}
            </span>
          </div>
        </aside>

        <div>
          <h2 id="career-title" className="sr-only">
            Career
          </h2>
          <ol className="career-list">
            {CAREER.map((item, i) => (
              <li key={item.org} className={`career-item rv${i === active ? " is-active" : ""}`}>
                <span className="ui muted career-period">{item.period}</span>
                <h3 className="career-org display">{item.org}</h3>
                <p className="career-role">
                  {item.role} <span className="muted">· {item.location}</span>
                </p>
                <p className="career-desc muted">{item.description}</p>
                {item.projects.length > 0 ? (
                  <ul className="career-work">
                    {item.projects.map((slug) => {
                      const project = getProject(slug);
                      if (!project) return null;
                      return (
                        <li key={slug}>
                          <Link href={`/work/${slug}/`} className="ui" data-cursor="View">
                            <span className="muted">{project.index}</span> {projectTitle(project)} →
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
