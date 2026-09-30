"use client";

import { useEffect, useState } from "react";
import { ProjectCover } from "@/components/covers/project-cover";
import { SplitText } from "@/components/motion/split-text";
import { PROFILE, PROJECTS } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

const INTERVAL = 3200;

export function Hero() {
  const [slide, setSlide] = useState({ current: 0, previous: -1 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setSlide(({ current }) => ({ current: (current + 1) % PROJECTS.length, previous: current }));
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  const showing = PROJECTS[slide.current] ?? PROJECTS[0];

  return (
    <section className="hero" data-theme="paper" aria-labelledby="hero-name">
      <div className="hero-frame">
        {PROJECTS.map((project, i) => (
          <div
            key={project.slug}
            className={`hero-slide${i === slide.current ? " is-on" : ""}${i === slide.previous ? " is-was" : ""}`}
          >
            <ProjectCover kind={project.cover} number={project.index} eager={i === 0} />
          </div>
        ))}
      </div>

      <h1 id="hero-name" className="hero-name display">
        <span className="sr-only">{PROFILE.name}</span>
        <SplitText text={PROFILE.firstName} className="hero-first" delay={0.25} />
        <SplitText text={PROFILE.lastName} className="hero-last" delay={0.37} />
      </h1>

      <p className="hero-now ui fade-in" aria-live="off">
        <span className="hero-now-index">
          {showing?.index} / {String(PROJECTS.length).padStart(2, "0")}
        </span>
        <span className="hero-now-title">
          {showing?.title} {showing?.titleItalic}
        </span>
        <span className="muted hero-now-tag">Now showing</span>
      </p>

      <div className="hero-bar ui fade-in">
        <span>{PROFILE.role}</span>
        <span className="muted">{PROFILE.stackLine}</span>
        <span className="muted hero-bar-city">{PROFILE.location}</span>
        <span className="hero-bar-status">
          <i className="status-dot" aria-hidden="true" />
          {PROFILE.availability}
        </span>
      </div>
    </section>
  );
}
