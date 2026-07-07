import type { ReactNode } from "react";

export function RainbowBorder({
  children,
  className = "",
  padding = "4px",
  borderRadius = "20px",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
  borderRadius?: string;
}) {
  const innerRadius = `calc(${borderRadius} - ${padding})`;

  return (
    <div
      className={`rainbow-border-animated group/rainbow ${className}`}
      style={{
        padding,
        borderRadius,
        background: "var(--rainbow-gradient)",
        backgroundSize: "200% 200%",
        animation: "rainbow-shift 12s ease-in-out infinite",
        willChange: "background-position",
      }}
    >
      <div className="h-full" style={{ borderRadius: innerRadius }}>{children}</div>
    </div>
  );
}
