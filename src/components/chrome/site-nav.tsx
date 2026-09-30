import Link from "next/link";
import { Monogram } from "@/components/brand/monogram";
import { PROFILE } from "@/data/content";
import { Clock } from "./clock";

export function SiteNav() {
  return (
    <header className="nav ui">
      <Link href="/" className="nav-mark" aria-label={`${PROFILE.name} — home`} data-cursor="Home">
        <Monogram />
      </Link>
      <span className="nav-word" aria-hidden="true">
        {PROFILE.name}
      </span>
      <nav className="nav-links" aria-label="Primary">
        <Link href="/#work">Work</Link>
        <Link href="/#about">About</Link>
        <Link href="/#contact">Contact</Link>
        <Clock city={PROFILE.city} timeZone={PROFILE.timeZone} />
      </nav>
    </header>
  );
}
