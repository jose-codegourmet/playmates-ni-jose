"use client";

import { buttonVariants } from "@fe-template/ui";
import { Monitor, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { DEFAULT_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, type ThemeMode } from "@/store/slices/themeSlice";

type FooterProps = { className?: string };

const FOOTER_LINKS = NAV_LINKS;

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function FooterThemeSelector() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  return (
    <fieldset className="m-0 flex items-center gap-1 border-0 p-0">
      <legend className="sr-only">Theme</legend>
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className={buttonVariants({
            variant: mode === value ? "secondary" : "ghost",
            size: "icon-sm",
          })}
          onClick={() => dispatch(setTheme(value))}
          aria-label={label}
          aria-pressed={mode === value}
          title={label}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </fieldset>
  );
}

function Footer({ className }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn("mt-auto border-t border-border bg-muted/30", className)}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-3">
            <Link
              href={ROUTES.home}
              className="inline-flex font-display text-lg font-semibold tracking-tight"
              aria-label={`${DEFAULT_SEO.siteName} home`}
            >
              {DEFAULT_SEO.siteName}
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">{DEFAULT_SEO.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">Archive by José</p>
          <FooterThemeSelector />
        </div>
      </div>
    </footer>
  );
}

export { FOOTER_LINKS, Footer };
