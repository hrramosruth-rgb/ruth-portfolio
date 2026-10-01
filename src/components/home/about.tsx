"use client";

import { useEffect, useRef } from "react";
import { Clock } from "@/components/chrome/clock";
import { Counter } from "@/components/motion/counter";
import { useReveal } from "@/components/motion/use-reveal";
import { Globe, type GlobeHandle } from "@/components/world/globe";
import { CAREER, DISCIPLINES, FIGURES, PROFILE, STACK_MARQUEE } from "@/data/content";

const [LATENCY, THROUGHPUT, CONVERSION] = FIGURES;

/** A soft light that follows the pointer across a tile. */
function spotlight(event: React.PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const box = el.getBoundingClientRect();
  el.style.setProperty("--sx", `${event.clientX - box.left}px`);
  el.style.setProperty("--sy", `${event.clientY - box.top}px`);
}

/**
 * About, as a bento grid: an introduction, where Ruth is based (the same globe as the first page),
 * results, experience, stack and what she does. Tiles rise in on scroll and catch a soft light
 * under the pointer.
 */
export function About() {
  const grid = useReveal<HTMLDivElement>(".bento-tile");
  const globe = useRef<GlobeHandle>(null);

  // This globe always faces Madrid.
  useEffect(() => {
    globe.current?.focusHome();
  }, []);
  const tile = (n: number) => ({ "--n": n }) as React.CSSProperties;

  return (
    <section id="about" className="section about" data-theme="paper" aria-labelledby="about-title">
      <div ref={grid} className="bento">
        <article className="bento-tile bento-intro" style={tile(0)} onPointerMove={spotlight}>
          <p className="label ui">About</p>
          <h2 id="about-title" className="bento-hello display">
            Hello, I&apos;m <em>Ruth</em>
            <span className="rouge">.</span>
          </h2>
          <p className="bento-lede">{PROFILE.statement.map((segment) => segment.text).join("")}.</p>
          <div className="bento-intro-foot">
            <span className="bento-status ui">
              <i aria-hidden="true" />
              {PROFILE.availability}
            </span>
            <a href="#work" className="bento-link ui">
              Selected work ↓
            </a>
            <a href="#contact" className="bento-link ui">
              Get in touch →
            </a>
          </div>
        </article>

        <article className="bento-tile bento-place" style={tile(1)} onPointerMove={spotlight}>
          <p className="ui muted">Based in</p>
          <div className="bento-globe">
            <Globe ref={globe} className="bento-globe-canvas" />
          </div>
          <p className="bento-city display">{PROFILE.location}</p>
          <p className="ui muted">
            CET · <Clock city="Madrid" timeZone={PROFILE.timeZone} />
          </p>
        </article>

        {LATENCY ? (
          <article className="bento-tile bento-stat bento-stat--rose" style={tile(2)} onPointerMove={spotlight}>
            <p className="ui">Query latency</p>
            <Counter figure={{ ...LATENCY, prefix: "−" }} className="bento-num display" />
            <p className="bento-stat-label">1,500 ms to under 500 ms at Albertsons</p>
          </article>
        ) : null}

        {THROUGHPUT ? (
          <article className="bento-tile bento-stat" style={tile(3)} onPointerMove={spotlight}>
            <p className="ui muted">Throughput</p>
            <Counter figure={THROUGHPUT} className="bento-num display rouge" />
            <p className="bento-stat-label muted">Requests per second on AWS ECS and Kubernetes</p>
          </article>
        ) : null}

        <article className="bento-tile bento-stack" style={tile(4)} onPointerMove={spotlight}>
          <p className="ui muted">Stack</p>
          <ul className="bento-chips">
            {STACK_MARQUEE.map((tech) => (
              <li key={tech} className="ui">
                {tech}
              </li>
            ))}
          </ul>
        </article>

        <article className="bento-tile bento-career" style={tile(5)} onPointerMove={spotlight}>
          <p className="ui muted">Experience</p>
          <ol>
            {CAREER.map((role) => (
              <li key={role.org}>
                <span className="display">{role.org}</span>
                <span className="ui muted">{role.period}</span>
              </li>
            ))}
          </ol>
        </article>

        {CONVERSION ? (
          <article className="bento-tile bento-stat bento-stat--gold" style={tile(6)} onPointerMove={spotlight}>
            <p className="ui">Conversion</p>
            <Counter figure={CONVERSION} className="bento-num display" />
            <p className="bento-stat-label">From A/B-tested React features</p>
          </article>
        ) : null}

        {DISCIPLINES.map((discipline, i) => (
          <article
            key={discipline.index}
            className="bento-tile bento-craft"
            style={tile(7 + i)}
            onPointerMove={spotlight}
          >
            <span className="ui muted">{discipline.index}</span>
            <h3 className="display">{discipline.title}</h3>
            <ul>
              {discipline.items.map((item) => (
                <li key={item} className="muted">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
