export function GradientFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-dark-base">
      <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-blob rounded-full bg-primary-500/20 blur-3xl" />
      <div className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] animate-blob rounded-full bg-gradient-teal/20 blur-3xl [animation-delay:2s]" />
      <div className="absolute -bottom-1/4 left-1/3 h-[550px] w-[550px] animate-blob rounded-full bg-gradient-cyan/15 blur-3xl [animation-delay:4s]" />
    </div>
  );
}
