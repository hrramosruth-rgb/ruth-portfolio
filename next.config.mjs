// STATIC_EXPORT=1 builds plain files for GitHub Pages (see deploy/publish-pages.sh).
// Without it, this is a normal Next.js build (Vercel or `next start`).
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(staticExport
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        // Static hosts have no image optimizer; the WebP sources are already small.
        images: { unoptimized: true },
      }
    : {
        trailingSlash: true,
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
