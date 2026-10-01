import { About } from "@/components/home/about";
import { Career } from "@/components/home/career";
import { Contact } from "@/components/home/contact";
import { WorkIndex } from "@/components/home/work-index";
import { RuthWorld } from "@/components/world/ruth-world";
import { LINKS, PROFILE } from "@/data/content";
import { SITE_URL } from "@/lib/site-url";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  url: `${SITE_URL}/`,
  email: LINKS.email.href,
  telephone: PROFILE.phone,
  address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "ES" },
  alumniOf: "National University of Distance Education (UNED)",
  sameAs: [LINKS.linkedin.href],
};

export default function Page() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <RuthWorld />
      <About />
      <WorkIndex />
      <Career />
      <Contact />
    </main>
  );
}
