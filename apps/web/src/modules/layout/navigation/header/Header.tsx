"use client";

import {
  Button,
  buttonVariants,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@fe-template/ui";
import { Menu, Monitor, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { DEFAULT_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, type ThemeMode } from "@/store/slices/themeSlice";

type HeaderProps = { className?: string; defaultMobileOpen?: boolean };

const THEME_ORDER: ThemeMode[] = ["light", "dark", "system"];

function ThemeToggle({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  const cycleTheme = () => {
    const next = THEME_ORDER[(THEME_ORDER.indexOf(mode) + 1) % THEME_ORDER.length];
    dispatch(setTheme(next));
  };

  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
  const label = mode === "light" ? "Light theme" : mode === "dark" ? "Dark theme" : "System theme";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={cycleTheme}
      aria-label={`Theme: ${label}. Click to change.`}
      title={label}
    >
      <Icon className="size-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.home}
      className={cn("inline-flex shrink-0 items-center gap-2", className)}
      aria-label={`${DEFAULT_SEO.siteName} home`}
    >
      <span className="font-display text-lg font-semibold tracking-tight">{DEFAULT_SEO.siteName}</span>
    </Link>
  );
}

function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <nav className={cn("flex items-center gap-1", className)} aria-label="Main">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function HeaderActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ThemeToggle />
    </div>
  );
}

function Header({ className, defaultMobileOpen = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(defaultMobileOpen);

  return (
    <header
      data-slot="header"
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <NavLinks className="hidden lg:flex" />

        <HeaderActions className="hidden lg:flex" />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle className="font-display text-lg">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 px-4 pb-6">
              <NavLinks
                className="flex-col items-stretch gap-1"
                onNavigate={() => setMobileOpen(false)}
              />
              <HeaderActions className="flex-col items-stretch" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export { NAV_LINKS } from "@/constants/navigation";
export { Header, ThemeToggle };
