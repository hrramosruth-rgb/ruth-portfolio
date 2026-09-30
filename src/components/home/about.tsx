import { WordReveal } from "@/components/motion/word-reveal";
import { DISCIPLINES, PROFILE } from "@/data/content";

export function About() {
  return (
    <section id="about" className="section about" data-theme="paper" aria-labelledby="about-title">
      <h2 id="about-title" className="label ui">
        About
      </h2>
      <WordReveal className="statement display" segments={PROFILE.statement} tail={<span className="rouge">.</span>} />
      <ul className="disciplines">
        {DISCIPLINES.map((discipline) => (
          <li key={discipline.index}>
            <span className="ui muted">{discipline.index}</span>
            <h3 className="display">{discipline.title}</h3>
            <p className="muted">
              {discipline.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
