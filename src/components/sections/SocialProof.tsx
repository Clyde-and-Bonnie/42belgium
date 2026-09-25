interface SocialProofProps {
  title: string;
  stats: { value: string; label: string }[];
}

export function SocialProof({ title, stats }: SocialProofProps) {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div key={i} className="text-center sm:text-left">
              <p className="text-5xl font-bold text-[var(--color-primary)] sm:text-6xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm uppercase tracking-wider text-zinc-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
