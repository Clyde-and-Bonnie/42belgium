import { Button } from "@/components/ui/Button";

interface CtaSectionProps {
  title: string;
  description: string;
  cta: string;
  ctaHref?: string;
}

export function CtaSection({
  title,
  description,
  cta,
  ctaHref = "#apply",
}: CtaSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-[var(--color-primary)]"
      id="apply"
    >
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            {description}
          </p>
          <div className="mt-10">
            <Button href={ctaHref} variant="outline" size="lg">
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
