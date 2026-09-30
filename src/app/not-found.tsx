import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="lost" data-theme="paper">
      <p className="label ui">Page not found</p>
      <h1 className="lost-title display">
        4<em>0</em>4<span className="rouge">.</span>
      </h1>
      <p className="lost-copy display">This page isn&apos;t part of the collection.</p>
      <Link href="/" className="ui u-line" data-cursor="Home">
        Back to the index →
      </Link>
    </main>
  );
}
