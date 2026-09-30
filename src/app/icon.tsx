import { ImageResponse } from "next/og";
import { MONOGRAM_MIRROR, MONOGRAM_PATH } from "@/components/brand/monogram-paths";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111010",
        }}
      >
        <svg width="54" height="54" viewBox="0 0 100 100" fill="#F1EEE8">
          <path d={MONOGRAM_PATH} />
          <path d={MONOGRAM_PATH} transform={MONOGRAM_MIRROR} />
        </svg>
      </div>
    ),
    size,
  );
}
