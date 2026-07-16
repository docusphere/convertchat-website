import { Button } from "@/components/ui/button";
import { RainbowBorder } from "@/components/ui/rainbow-border";

export function CtaBlock({ text, button, href }: { text: string; button: string; href: string }) {
  const isExternal = href.startsWith("http");

  return (
    <div className="my-10">
      {/* RainbowBorder default: borderRadius="20px", padding="4px" → inner = 16px = rounded-2xl */}
      <RainbowBorder>
        <div className="rounded-2xl bg-neutral-900 p-8 text-center">
          <p className="font-serif text-2xl text-white">{text}</p>
          <div className="mt-5">
            <Button href={href} {...(isExternal ? { target: "_blank", rel: "noopener" } : {})}>
              {button}
            </Button>
          </div>
        </div>
      </RainbowBorder>
    </div>
  );
}
