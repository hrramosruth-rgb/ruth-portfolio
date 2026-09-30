/** Canonical site URL, including the deploy base path (e.g. https://…github.io/ruth-portfolio). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:6220").replace(/\/$/, "");
