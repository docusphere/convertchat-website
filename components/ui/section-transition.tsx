export function SectionTransition({ from, to }: { from: string; to: string }) {
  return (
    <div aria-hidden className="h-24 md:h-32" style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }} />
  );
}
