import Image from "next/image";

/**
 * Continuous partner-logo marquee.
 * - List rendered twice so the -50% translate loops seamlessly.
 * - Pauses on hover so visitors can read individual logos.
 * - Greyscale by default, full colour on hover.
 * - Edge fade masks soften the clipping at both sides.
 */

interface Partner {
  name: string;
  src: string;
}

const PARTNERS: Partner[] = [
  { name: "Belfius", src: "/assets/partners/Belfius.png" },
  { name: "Deloitte", src: "/assets/partners/Deloitte.png" },
  { name: "Proximus", src: "/assets/partners/Proximus.png" },
  { name: "DPG Media", src: "/assets/partners/DPG.png" },
  { name: "Securex", src: "/assets/partners/Securex.png" },
  { name: "GBL", src: "/assets/partners/GBL.png" },
  { name: "Euroclear", src: "/assets/partners/Euroclear.png" },
  { name: "Digipolis", src: "/assets/partners/Digipolis.png" },
  { name: "Duvel", src: "/assets/partners/Duvel.png" },
  { name: "HUBO", src: "/assets/partners/HUBO.png" },
  { name: "Interparking", src: "/assets/partners/Interparking.png" },
  { name: "CLDNC", src: "/assets/partners/CLDNC.png" },
  { name: "Port of Antwerp-Bruges", src: "/assets/partners/Port-of-Antwerp-and-Bruges.png" },
];

export function PartnerStrip() {
  return (
    <section className="bg-white border-y border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8">
          Our partners and sponsors
        </p>

        <div className="relative overflow-hidden">
          {/* Edge fade masks - soften the clipping on both sides */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white/90 to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/90 to-transparent z-10"
          />

          {/* Track - PARTNERS rendered twice for a seamless loop */}
          <div className="flex w-max gap-12 animate-marquee">
            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="shrink-0 flex items-center justify-center w-32 h-20"
                aria-hidden={i >= PARTNERS.length ? "true" : undefined}
              >
                <Image
                  src={partner.src}
                  alt={i >= PARTNERS.length ? "" : partner.name}
                  width={128}
                  height={80}
                  className="max-h-full w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
