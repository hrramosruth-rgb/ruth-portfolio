import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NextProject } from "@/components/case/next-project";
import { ProjectCover } from "@/components/covers/project-cover";
import { Counter } from "@/components/motion/counter";
import { InView } from "@/components/motion/in-view";
import { SplitText } from "@/components/motion/split-text";
import { LINKS, PROFILE, PROJECTS, getProject, nextProject } from "@/data/content";
import { OG_IMAGE } from "@/lib/og";
import { SITE_URL } from "@/lib/site-url";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const title = [project.title, project.titleItalic].filter(Boolean).join(" ");
  const url = `${SITE_URL}/work/${project.slug}/`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: { title: `${title} — ${PROFILE.name}`, description: project.summary, url, type: "article", images: [OG_IMAGE] },
  };
}

export default async function CasePage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const title = [project.title, project.titleItalic].filter(Boolean).join(" ");
  const total = String(PROJECTS.length).padStart(2, "0");

  const meta: [string, React.ReactNode][] = [
    ["Role", project.role],
    ["Company", project.company],
    ["Period", project.period],
    ["Location", project.location],
    ["Stack", project.stack.join(", ")],
  ];
  if (project.link) {
    meta.push([
      "Live",
      <a key="live" href={project.link.href} className="u-line" data-cursor="Visit" target="_blank" rel="noreferrer">
        {project.link.label} ↗
      </a>,
    ]);
  }

  return (
    <main id="main" className="case">
      <section className="case-hero" data-theme="paper" aria-labelledby="case-title">
        <p className="case-crumbs ui">
          <Link href="/#work" className="u-line">
            ← Index
          </Link>
          <span className="muted">
            {project.index} / {total}
          </span>
          <span className="muted">{project.context}</span>
        </p>
        <InView>
          <h1 id="case-title" className="case-title display">
            <span className="sr-only">{title}</span>
            <SplitText text={project.title} delay={0.45} />
            {project.titleItalic ? <SplitText text={project.titleItalic} className="case-title-italic" delay={0.6} /> : null}
          </h1>
        </InView>
        <p className="case-summary display">{project.summary}</p>
      </section>

      <div className={`case-cover case-cover--${project.cover}`}>
        <ProjectCover kind={project.cover} number={project.index} eager />
      </div>

      <section className="section case-body" data-theme="paper" aria-label="Overview">
        <dl className="case-meta">
          {meta.map(([term, value]) => (
            <div key={term}>
              <dt className="ui muted">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <h2 className="label ui">Context</h2>
          <p className="case-description display">{project.description}</p>
        </div>
      </section>

      <section className="section case-work" data-theme="ink" aria-labelledby="case-work-title">
        <h2 id="case-work-title" className="label ui">
          What I built
        </h2>
        <ol className="case-highlights">
          {project.highlights.map((highlight, i) => (
            <li key={highlight.lead}>
              <span className="ui muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display">{highlight.lead}</h3>
              <p className="muted">{highlight.text}</p>
            </li>
          ))}
        </ol>
        {project.figures.length > 0 ? (
          <>
            <h2 className="label ui case-figures-title">Impact</h2>
            <ul className="figures">
              {project.figures.map((figure) => (
                <li key={figure.label}>
                  <Counter figure={figure} className="display" />
                  <span className="muted">{figure.label}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <NextProject project={nextProject(project.slug)} />

      <footer className="case-foot footer-bar ui muted">
        <span>© 2026 {PROFILE.name}</span>
        <a href={LINKS.email.href} className="u-line">
          {LINKS.email.label}
        </a>
        <Link href="/#main" className="u-line">
          Home ↑
        </Link>
      </footer>
    </main>
  );
}
