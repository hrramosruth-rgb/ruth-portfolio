import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import { SiteNav } from "@/components/chrome/site-nav";
import { Cursor } from "@/components/motion/cursor";
import { Loader } from "@/components/motion/loader";
import { SectionTheme } from "@/components/motion/section-theme";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PROFILE } from "@/data/content";
import { asset } from "@/lib/asset";
import { OG_IMAGE } from "@/lib/og";
import { SITE_URL } from "@/lib/site-url";
import "@/styles/tokens.css";
import "@/styles/chrome.css";
import "@/styles/home.css";
import "@/styles/case.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const inter = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // Origin only; the icon and share-image URLs below carry the deploy base path themselves.
  metadataBase: new URL(new URL(SITE_URL).origin),
  title: { default: PROFILE.title, template: `%s — ${PROFILE.name}` },
  description: PROFILE.description,
  alternates: { canonical: `${SITE_URL}/` },
  icons: { icon: [{ url: asset("/icon.png"), type: "image/png", sizes: "64x64" }] },
  openGraph: {
    title: PROFILE.title,
    description: PROFILE.description,
    url: `${SITE_URL}/`,
    siteName: PROFILE.name,
    locale: "en_US",
    type: "profile",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: PROFILE.title, description: PROFILE.description, images: [OG_IMAGE] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f1eee8",
};

// Runs before first paint: returning visitors and reduced-motion users skip the intro.
const BOOT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("rr-loaded")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("is-loaded","is-ready")}catch(e){d.classList.add("is-loaded","is-ready")}})();`;

// Without JavaScript every reveal is shown in its final state.
const NO_SCRIPT = `.loader{display:none}.split .ch,.fade-in,.word,.hero-frame{opacity:1!important;transform:none!important;clip-path:none!important}.hero-frame{transform:translate(-50%,-50%)!important}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <noscript>
          <style>{NO_SCRIPT}</style>
        </noscript>
        <a href="#main" className="skip ui">
          Skip to content
        </a>
        <Loader />
        <SmoothScroll />
        <SectionTheme />
        <SiteNav />
        {children}
        <Cursor />
      </body>
    </html>
  );
}
