interface WhoItsForProps {
  title: string;
  description: string;
}

export function WhoItsFor({ title, description }: WhoItsForProps) {
  return (
    <section className="bg-[var(--color-gray-100)]">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
