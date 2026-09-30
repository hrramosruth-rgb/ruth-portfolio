type SplitTextProps = {
  text: string;
  className?: string;
  /** Seconds before the first letter moves. */
  delay?: number;
  /** Seconds between letters. */
  step?: number;
  /** Rendered after the letters (e.g. a coloured full stop); animates as the last letter. */
  tail?: React.ReactNode;
};

/**
 * Letters that rise into place from behind a mask. Decorative: the parent carries the accessible text.
 * Moves when `html.is-ready` (page intro) or the nearest `.split.is-in` (see InView) is set.
 */
export function SplitText({ text, className, delay = 0, step = 0.045, tail }: SplitTextProps) {
  const letters = [...text];
  return (
    <span className={className ? `split ${className}` : "split"} aria-hidden="true">
      {letters.map((letter, i) => (
        <span key={i} className="ch" style={{ transitionDelay: `${delay + i * step}s` }}>
          {letter === " " ? " " : letter}
        </span>
      ))}
      {tail ? (
        <span className="ch" style={{ transitionDelay: `${delay + letters.length * step}s` }}>
          {tail}
        </span>
      ) : null}
    </span>
  );
}
