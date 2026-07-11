import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "glass";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-glow hover:shadow-glow-hover hover:-translate-y-0.5",
  secondary: "bg-neutral-900 text-white hover:bg-neutral-700 hover:-translate-y-0.5",
  ghost: "bg-transparent border border-neutral-200 text-neutral-700 hover:bg-neutral-100",
  glass:
    "bg-white/[0.06] text-white/75 border border-white/[0.08] hover:bg-white/[0.12] hover:text-white/90 backdrop-blur-sm",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-[18px] py-2 text-[13px]",
  md: "px-7 py-3.5 text-[15px]",
  lg: "px-9 py-[18px] text-[17px]",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & (
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
);

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  // Design override: rounded-xl (12px) instead of spec's rounded-full (pill).
  // User explicitly rejected pill shape as looking "too AI generated."
  // Nav bar container remains pill-shaped; buttons use softer rounded-xl.
  const classes = `inline-flex items-center justify-center whitespace-nowrap rounded-xl font-sans font-semibold transition-all duration-200 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props as { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
    return <a href={href} className={classes} {...rest} />;
  }

  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
