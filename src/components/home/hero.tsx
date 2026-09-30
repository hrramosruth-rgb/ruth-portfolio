"use client";

import { useEffect, useState } from "react";
import { ProjectCover } from "@/components/covers/project-cover";
import { StoreShot } from "@/components/covers/store-shot";
import { SplitText } from "@/components/motion/split-text";
import { HERO_SLIDES, PROFILE } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

const INTERVAL = 3200;

export function Hero() {
  const [slide, setSlide] = useState({ current: 0, previous: -1 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setSlide(({ current }) => ({ current: (current + 1) % HERO_SLIDES.length, previous: current }));
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  const showing = HERO_SLIDES[slide.current] ?? HERO_SLIDES[0];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="hero" data-theme="paper" aria-labelledby="hero-name">
      <div className="hero-frame">
        {HERO_SLIDES.map((item, i) => (
          <div
            key={item.key}
            className={`hero-slide${i === slide.current ? " is-on" : ""}${i === slide.previous ? " is-was" : ""}`}
          >
            {item.kind === "store" ? (
              <StoreShot image={item.image} focus={item.focus} eager={i === 0} />
            ) : (
              <ProjectCover kind={item.cover} number={item.index} />
            )}
          </div>
        ))}
      </div>

      <h1 id="hero-name" className="hero-name display">
        <span className="sr-only">{PROFILE.name}</span>
        <SplitText text={PROFILE.firstName} className="split--intro hero-first" delay={0.25} />
        <SplitText text={PROFILE.lastName} className="split--intro hero-last" delay={0.37} />
      </h1>

      <p className="hero-now ui fade-in" aria-live="off">
        <span className="hero-now-index">
          {pad(slide.current + 1)} / {pad(HERO_SLIDES.length)}
        </span>
        <span className="hero-now-title">{showing?.title}</span>
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
