import { ImageResponse } from "next/og";
import { MONOGRAM_MIRROR, MONOGRAM_PATH } from "@/components/brand/monogram-paths";

// Served as a plain /icon.png file (not the `icon.tsx` convention), so the static export keeps
// the GitHub Pages base path in its URL. Linked from the root layout's metadata.
export const dynamic = "force-static";

const size = { width: 64, height: 64 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1426",
        }}
      >
        <svg width="54" height="54" viewBox="0 0 100 100" fill="#EEF1F7">
          <path d={MONOGRAM_PATH} />
          <path d={MONOGRAM_PATH} transform={MONOGRAM_MIRROR} />
        </svg>
      </div>
    ),
    size,
  );
}
