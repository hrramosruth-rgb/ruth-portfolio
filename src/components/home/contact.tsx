"use client";

import Link from "next/link";
import { InView } from "@/components/motion/in-view";
import { SplitText } from "@/components/motion/split-text";
import { useReveal } from "@/components/motion/use-reveal";
import { CONTACTS, PROFILE } from "@/data/content";

export function Contact() {
  const list = useReveal<HTMLUListElement>(".contact-item");

  return (
    <section id="contact" className="section contact" data-theme="paper" aria-labelledby="contact-title">
      <p className="label ui">Contact</p>
      <InView>
        <h2 id="contact-title" className="contact-title display">
          <span className="sr-only">Let&apos;s talk.</span>
          <SplitText text="Let's" delay={0} />
          <SplitText text="talk" className="contact-talk" delay={0.1} tail={<span className="rouge">.</span>} />
        </h2>
      </InView>

      <ul ref={list} className="contact-list">
        {CONTACTS.map((item, i) => (
          <li key={item.kind} className="contact-item rv" style={{ "--row": i } as React.CSSProperties}>
            <a
              href={item.link.href}
              className="contact-row"
              data-cursor={item.cursor}
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span className="contact-fill" aria-hidden="true" />
              <span className="ui muted contact-kind">
                {String(i + 1).padStart(2, "0")} — {item.kind}
              </span>
              <span className="contact-value display">{item.link.label}</span>
              <span className="contact-arrow" aria-hidden="true">
                {item.external ? "↗" : "→"}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="contact-where ui muted">
        {PROFILE.location} · {PROFILE.availability}
      </p>

      <footer className="footer">
        <div className="footer-bar ui muted">
          <span>© 2026 {PROFILE.name}</span>
          <span className="footer-type">Set in Bodoni Moda &amp; Inter Tight</span>
          <Link href="/#main" className="u-line">
            Back to top ↑
          </Link>
        </div>
        <p className="footer-mark display" aria-hidden="true">
          {PROFILE.name}
          <span className="rouge">.</span>
        </p>
      </footer>
    </section>
  );
}
