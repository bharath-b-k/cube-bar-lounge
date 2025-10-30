import Link from "next/link";
import Image from "next/image";
import { Music, Flame, UtensilsCrossed, PartyPopper } from "lucide-react";
import bgHero from "@/assets/shisha.png";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full text-white">
      {/* Background image with gradient overlay and fade-in */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={(bgHero as any).src ?? (bgHero as unknown as string)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="fade-in-bg object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-purple-900/40 to-black/70 backdrop-blur-[1.5px]" />
      {/* OPTIONAL: alternative backgrounds */}
      {/**
       * Alternative options:
       * - https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070 (colorful shisha)
       * - https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070 (smoke effect)
       */}

      {/* Smoke overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 smoke-overlay" />

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 pb-16 text-center">
        <h1 className="text-shadow-lg bg-gradient-to-r from-purple-200 to-pink-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow md:text-7xl">
          Cube Bar Lounge
        </h1>
        <p className="mt-4 max-w-2xl text-balance text-lg text-white/90 drop-shadow md:text-xl">
          West African Cuisine • Premium Shisha • Live Music • DJ Nights
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/table-booking"
            className="cta-pulse rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white shadow-xl transition hover:scale-[1.01] hover:bg-purple-500 hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[44px] min-w-[44px]"
          >
            Book a Table
          </Link>
          <Link
            href="/event-booking"
            className="cta-pulse rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white shadow-xl transition hover:scale-[1.01] hover:bg-pink-500 hover:shadow-[0_0_18px_rgba(236,72,153,0.35)] focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[44px] min-w-[44px]"
          >
            Host an Event
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Music className="h-8 w-8 text-purple-300" />}
            title="Live DJ"
            description="Vibes curated by top DJs every weekend."
          />
          <FeatureCard
            icon={<Flame className="h-8 w-8 text-purple-300" />}
            title="Premium Shisha"
            description="Smooth, flavorful blends with premium coals."
          />
          <FeatureCard
            icon={<UtensilsCrossed className="h-8 w-8 text-purple-300" />}
            title="Authentic Food"
            description="West African dishes prepared to perfection."
          />
          <FeatureCard
            icon={<PartyPopper className="h-8 w-8 text-purple-300" />}
            title="Private Events"
            description="Celebrate birthdays, weddings, and corporate nights."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg transition hover:translate-y-[-2px] hover:bg-white/15">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-white/80">{description}</p>
    </div>
  );
}
