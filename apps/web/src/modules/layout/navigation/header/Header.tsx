"use client";

import {
  buttonVariants,
  Logo,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@fe-template/ui";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { DEFAULT_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";

type HeaderProps = { className?: string; defaultMobileOpen?: boolean };

function isActiveNavHref(pathname: string, href: string) {
  if (href === ROUTES.home) {
    return pathname === ROUTES.home;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandLink({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.home}
      className={cn("inline-flex min-h-10 shrink-0 items-center gap-2", className)}
      aria-label={`${DEFAULT_SEO.siteName} home`}
    >
      <Logo className="h-7 w-auto text-primary" />
    </Link>
  );
}

function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname() ?? ROUTES.home;

  return (
    <nav className={cn("flex min-w-0 items-center gap-1", className)} aria-label="Main">
      {NAV_LINKS.map((link) => {
        const active = isActiveNavHref(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 min-w-10 items-center border-2 border-transparent px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors hover:border-ink hover:bg-primary hover:text-primary-foreground",
              active ? "border-ink bg-primary text-primary-foreground" : "text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Header({ className, defaultMobileOpen = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(defaultMobileOpen);

  return (
    <header
      data-slot="header"
      className={cn(
        "sticky top-0 z-40 w-full min-w-0 overflow-x-clip border-b-[3px] border-ink bg-background",
        className,
      )}
    >
      <div className="mx-auto flex h-16 min-w-0 max-w-7xl items-center justify-between gap-4 overflow-x-clip px-4 sm:px-6 lg:px-8">
        <BrandLink />

        <NavLinks className="hidden lg:flex" />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-10 lg:hidden")}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle className="font-display text-lg">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex min-w-0 flex-col gap-6 overflow-x-clip px-4 pb-6">
              <NavLinks
                className="flex-col items-stretch gap-1"
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export { NAV_LINKS } from "@/constants/navigation";
export { Header };
