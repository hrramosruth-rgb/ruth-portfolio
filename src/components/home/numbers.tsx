import { Counter } from "@/components/motion/counter";
import { EXPERIENCE, FIGURES } from "@/data/content";

export function Numbers() {
  return (
    <section className="section numbers" data-theme="ink" aria-labelledby="numbers-title">
      <h2 id="numbers-title" className="label ui">
        In numbers
      </h2>
      <ul className="figures">
        {FIGURES.map((figure) => (
          <li key={figure.label}>
            <Counter figure={figure} className="display" />
            <span className="muted">{figure.label}</span>
          </li>
        ))}
      </ul>

      <h2 className="label ui experience-title">Experience</h2>
      <ol className="experience">
        {EXPERIENCE.map((role) => (
          <li key={role.org}>
            <span className="ui muted">{role.period}</span>
            <span className="experience-org display">{role.org}</span>
            <span>{role.role}</span>
            <span className="ui muted experience-where">{role.location}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
