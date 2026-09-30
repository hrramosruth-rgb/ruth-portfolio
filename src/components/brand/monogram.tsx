import { MONOGRAM_MIRROR, MONOGRAM_PATH } from "./monogram-paths";

type MonogramProps = { className?: string; title?: string };

/** Two Bodoni capital R's mirrored to share one stem. */
export function Monogram({ className, title }: MonogramProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d={MONOGRAM_PATH} />
      <path d={MONOGRAM_PATH} transform={MONOGRAM_MIRROR} />
    </svg>
  );
}
