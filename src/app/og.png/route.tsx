import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MONOGRAM_MIRROR, MONOGRAM_PATH } from "@/components/brand/monogram-paths";

// Served as a plain /og.png file (not the `opengraph-image.tsx` convention), so the static export
// keeps the GitHub Pages base path in its URL. Referenced through OG_IMAGE in src/lib/og.ts.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

export async function GET() {
  const [roman, italic] = await Promise.all([
    font("BodoniModa-96-Regular.ttf"),
    font("BodoniModa-96-Italic.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F1EEE8",
          color: "#111010",
          padding: "52px 64px",
          fontFamily: "Bodoni",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <svg width="64" height="64" viewBox="0 0 100 100" fill="#111010">
            <path d={MONOGRAM_PATH} />
            <path d={MONOGRAM_PATH} transform={MONOGRAM_MIRROR} />
          </svg>
          <span style={{ fontSize: 20, letterSpacing: 7, textTransform: "uppercase" }}>Portfolio · MMXXVI</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 200, lineHeight: 0.84, letterSpacing: -7 }}>
          <span>Ruth</span>
          <span style={{ display: "flex", alignSelf: "flex-end", fontStyle: "italic" }}>
            Ramos<span style={{ color: "#8C1C2B", fontStyle: "normal" }}>.</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 21,
            letterSpacing: 6,
            textTransform: "uppercase",
            borderTop: "1px solid rgba(17,16,16,0.2)",
            paddingTop: 20,
          }}
        >
          <span>Design Engineer · Full Stack</span>
          <span>Madrid, Spain</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bodoni", data: roman, style: "normal", weight: 400 },
        { name: "Bodoni", data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}
