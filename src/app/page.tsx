import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { Numbers } from "@/components/home/numbers";
import { WorkIndex } from "@/components/home/work-index";
import { LINKS, PROFILE } from "@/data/content";
import { SITE_URL } from "@/lib/site-url";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: "Design Engineer & Full Stack Developer",
  url: `${SITE_URL}/`,
  email: LINKS.email.href,
  address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "ES" },
  alumniOf: "National University of Distance Education (UNED)",
  sameAs: [LINKS.linkedin.href, LINKS.github.href],
};

export default function Page() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <About />
      <WorkIndex />
      <Numbers />
      <Contact />
    </main>
  );
}
