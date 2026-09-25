interface WhatYouLearnProps {
  title: string;
  outcomes: string[];
}

export function WhatYouLearn({ title, outcomes }: WhatYouLearnProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {outcomes.map((outcome, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--color-primary)] text-sm font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base leading-relaxed text-zinc-700">
                {outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
