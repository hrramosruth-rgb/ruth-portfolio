import Link from "next/link";
import type { Project } from "@/data/content";
import { PROJECTS } from "@/data/content";

export function NextProject({ project }: { project: Project }) {
  return (
    <section className="next" data-theme="paper" aria-labelledby="next-title">
      <Link href={`/work/${project.slug}/`} className="next-link" data-cursor="Next">
        <span className="next-meta ui">
          <span className="muted">Next project</span>
          <span className="muted">
            {project.index} / {String(PROJECTS.length).padStart(2, "0")} — {project.context}
          </span>
        </span>
        <span id="next-title" className="next-title display">
          {project.title}
          {project.titleItalic ? <em> {project.titleItalic}</em> : null}
          <span className="next-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </Link>
    </section>
  );
}
