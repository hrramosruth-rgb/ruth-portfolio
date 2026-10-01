// Renders the illustration scenes in design/illustrations/index.html to public/covers/<scene>.webp.
// Usage: pnpm illustrations   (needs the Playwright Chromium build and `cwebp` on PATH)
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const SCENES = ["albertsons", "search", "personalization", "components", "touch"];
const page = new URL("../design/illustrations/index.html", import.meta.url);
const out = new URL("../public/covers/", import.meta.url);
const tmp = mkdtempSync(join(tmpdir(), "illustrations-"));

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
const tab = await context.newPage();
for (const scene of SCENES) {
  await tab.goto(`${page.href}?scene=${scene}`, { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.waitForTimeout(300);
  const png = join(tmp, `${scene}.png`);
  await tab.screenshot({ path: png });
  execFileSync("cwebp", ["-quiet", "-q", "84", png, "-o", new URL(`${scene}.webp`, out).pathname]);
  console.log(`rendered ${scene}.webp`);
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
