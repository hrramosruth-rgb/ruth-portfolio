import Link from "next/link";
import { InView } from "@/components/motion/in-view";
import { SplitText } from "@/components/motion/split-text";
import { LINKS, PROFILE } from "@/data/content";

export function Contact() {
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

      <div className="contact-links">
        <a href={LINKS.email.href} className="contact-email display" data-cursor="Write">
          {LINKS.email.label}
        </a>
        <span className="contact-social ui">
          <a href={LINKS.linkedin.href} className="u-line" data-cursor="Open" target="_blank" rel="noreferrer">
            {LINKS.linkedin.label}
          </a>
          <a href={LINKS.github.href} className="u-line" data-cursor="Open" target="_blank" rel="noreferrer">
            {LINKS.github.label}
          </a>
        </span>
      </div>

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
