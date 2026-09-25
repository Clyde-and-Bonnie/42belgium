import { Button } from "@/components/ui/Button";

interface HeroProps {
  headline: string;
  subheadline: string;
  cta: string;
  ctaHref?: string;
}

export function Hero({ headline, subheadline, cta, ctaHref = "#apply" }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-24 sm:pb-28 sm:pt-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300 sm:text-xl">
            {subheadline}
          </p>
          <div className="mt-10">
            <Button href={ctaHref} size="lg">
              {cta}
            </Button>
          </div>
        </div>
      </div>
      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
    </section>
  );
}
