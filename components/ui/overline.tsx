export function Overline({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${className ?? "text-primary-400/60"}`}>
      {children}
    </p>
  );
}
