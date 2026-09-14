import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type NotFoundHeroSectionProps = {
  className?: string;
};

function NotFoundHeroSection({ className }: NotFoundHeroSectionProps) {
  return (
    <section
      data-slot="not-found-hero-section"
      className={cn(
        "mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-[1fr_auto] md:px-8 md:py-24",
        className,
      )}
    >
      <div>
        <p className="nb-sticker bg-accent-guava px-3 py-1 text-sm text-white">404</p>
        <h1 className="font-display mt-6 text-5xl md:text-7xl">Not in the archive.</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed md:text-lg">
          The link may have moved. Head home or browse published sessions.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={ROUTES.home}
            className="nb-box-sm nb-press inline-flex h-11 items-center justify-center bg-primary px-5 text-sm font-bold uppercase tracking-wide text-primary-foreground"
          >
            Home
          </Link>
          <Link
            href={ROUTES.sessions}
            className="nb-box-sm nb-press inline-flex h-11 items-center justify-center bg-background px-5 text-sm font-bold uppercase tracking-wide"
          >
            Sessions
          </Link>
        </div>
      </div>
      <Image
        src="/images/mascot/smash.png"
        alt="Playmates mascot mid-smash"
        width={360}
        height={480}
        className="mx-auto w-56 object-contain md:w-80"
        priority
      />
    </section>
  );
}

export { NotFoundHeroSection };
