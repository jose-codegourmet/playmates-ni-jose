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
      className={cn("px-4 py-16 md:px-8 md:py-24", className)}
    >
      <p className="text-sm font-medium tracking-wide uppercase">404</p>
      <h1 className="font-display mt-4 text-4xl font-semibold md:text-5xl">
        This page is not in the Playmates archive.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed md:text-lg">
        The link may have moved. Head home or browse published sessions.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={ROUTES.home}
          className="inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90"
        >
          Home
        </Link>
        <Link
          href={ROUTES.sessions}
          className="inline-flex h-10 items-center justify-center rounded-full border border-current px-5 text-sm font-medium hover:bg-muted"
        >
          Sessions
        </Link>
      </div>
    </section>
  );
}

export { NotFoundHeroSection };
