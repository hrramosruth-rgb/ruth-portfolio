import Link from "next/link";
import { PYTHON_WORK, getProject } from "@/data/content";

const pad = (n: number) => String(n).padStart(2, "0");

export function PythonWork() {
  return (
    <section id="python" className="section python" data-theme="paper" aria-labelledby="python-title">
      <div className="section-head">
        <h2 id="python-title" className="display">
          Python <em>services</em>
        </h2>
        <span className="ui muted">Backend — {pad(PYTHON_WORK.length)}</span>
      </div>
      <p className="section-intro muted">
        The Python behind the product — services for search, personalization, AI-generated content and experimentation.
      </p>

      <ol className="python-list">
        {PYTHON_WORK.map((service, i) => {
          const project = getProject(service.project);
          return (
            <li key={service.title}>
              <span className="ui muted">{pad(i + 1)}</span>
              <h3 className="display">{service.title}</h3>
              <p className="muted">{service.text}</p>
              <span className="python-meta">
                <span className="ui">{service.stack.join(" · ")}</span>
                {project ? (
                  <Link href={`/work/${project.slug}/`} className="ui u-line muted" data-cursor="View">
                    From {project.title} →
                  </Link>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
