// EU-stars + padlock mark with "GDPR / Compliant" text. There is no official
// GDPR logo, so this is drawn in-brand as inline SVG. Color flows through
// currentColor: set text color (and opacity) on the parent/className.
const STAR_PATH =
  "M0,-1 L0.225,-0.309 0.951,-0.309 0.363,0.118 0.588,0.809 0,0.382 -0.588,0.809 -0.363,0.118 -0.951,-0.309 -0.225,-0.309 Z";

type GdprBadgeProps = {
  acronym: string;
  label: string;
  className?: string;
};

export function GdprBadge({ acronym, label, className = "" }: GdprBadgeProps) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x = 24 + 19 * Math.sin(angle);
    const y = 24 - 19 * Math.cos(angle);
    return { x, y };
  });

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-hidden="true">
        {stars.map(({ x, y }, i) => (
          <path key={i} d={STAR_PATH} fill="currentColor" transform={`translate(${x} ${y}) scale(2.6)`} />
        ))}
        {/* Padlock */}
        <path
          d="M20 21.5v-2.5a4 4 0 0 1 8 0v2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <rect x="17" y="21.5" width="14" height="11" rx="2.5" fill="currentColor" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="font-sans text-base font-semibold tracking-wide">{acronym}</span>
        <span className="font-sans text-xs opacity-80">{label}</span>
      </span>
    </div>
  );
}
