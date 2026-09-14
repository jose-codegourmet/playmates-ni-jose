# Playmates ni José — Branding Guide

Canonical visual identity for the public archive and the admin portal. Implementation tokens live in each app's `globals.css`. The logo lives in `@fe-template/ui` as `Logo`.

Engineering wiring: [`docs/styling-and-design-system.md`](../styling-and-design-system.md).

---

## 1. Brand Overview

**Playmates ni José** is a playful, warm, social-first brand built around friendship, spontaneity, shared activities, and the feeling of finding people to play, hang out, and have fun with.

The brand should feel:

- Playful, not childish
- Friendly, not corporate
- Nostalgic, but still modern
- Filipino in warmth and personality without relying on clichés
- Social, casual, and welcoming
- Slightly retro and expressive
- Easy to recognize at a glance

The visual identity should feel like a modern community app wearing a vintage recreational-club personality.

On this product, that language is applied to a **badminton session archive**: cream first, green second, accents third.

The public site (`apps/web`) is **neo-brutalist**: Anton display type, 2-3px ink borders, hard offset shadows, and square surfaces. Admin keeps the softer cream-and-green mapping in `apps/admin/src/app/globals.css`.

---

## 2. Brand Personality

| Trait | Direction |
|---|---|
| Playful | Energetic, charming, expressive |
| Friendly | Approachable, inclusive, conversational |
| Social | Designed around people and shared experiences |
| Nostalgic | Inspired by vintage club posters, recreational graphics, and warm print colors |
| Relaxed | Never feels overly polished, sterile, or corporate |
| Confident | Strong typography and simple visual choices |
| Human | Copy and visuals should feel personal rather than automated |

**Keywords:** playful, warm, social, retro, friendly, casual, inviting, community, fun, local

---

## 3. Logo

The **Playmates ni Jose** wordmark is the visual anchor. Do not recreate the lettering in another font.

Canonical component: `Logo` from `@fe-template/ui`.

```tsx
import { Logo } from "@fe-template/ui";

<Logo className="h-8 w-auto text-primary" title="Playmates ni José" />
<Logo variant="mark" className="size-6 text-primary" />
```

- `fill` defaults to `currentColor`, so Tailwind `text-*` drives the color. An explicit `fill` prop still wins.
- `variant="wordmark"` is the full stacked lettering (`viewBox="0 0 145.8 63.3"`).
- `variant="mark"` is the `P` glyph for collapsed chrome and favicons.

### Primary logo color

```css
--brand-green: #284400;
```

### Logo usage

Use the logo primarily on cream, off-white, light yellow, or very pale green. Cream on a dark green surface is also allowed.

Avoid stretching, gradients, heavy drop shadows, low-contrast placements, or making the mark feel tech-oriented.

Static copies: `apps/web/public/logo.svg`, `apps/admin/public/logo.svg`. Prefer the React component in UI.

---

## 4. Color System

**60% cream / 25% brand green / 15% accent.** When unsure: cream background + green typography + one playful accent.

### Primary

| Name | Hex | Use |
|---|---|---|
| Playmates Green | `#284400` | Logo, primary text, buttons, strong borders, selected states |
| Playmates Cream | `#FCF4C6` | Page backgrounds, heroes, marketing surfaces |

### Supporting neutrals

| Name | Hex | Use |
|---|---|---|
| Ink | `#10100A` | Public-site borders, hard shadows, high-contrast text |
| Soft Cream | `#FFF9E6` | Elevated cards on cream |
| Warm White | `#FFFCF3` | Forms, modals, content-heavy surfaces |
| Ink Green | `#182B0B` | Admin text, leftover ink-green aliases |
| Muted Olive | `#6D7A45` | Secondary text, metadata, inactive UI |

### Playful accents (public site uses the stronger values)

| Name | Hex (web) | Hex (admin) | Use |
|---|---|---|---|
| Guava | `#F2603F` | `#E97864` | Social highlights, game bands, failed states |
| Mango | `#FFC42E` | `#F2B84B` | Featured moments, sessions bands |
| Sky | `#58B4CC` | `#8DBCC7` | Players bands, informational states |
| Lilac | `#B189D9` | `#B6A3C9` | Venues bands, category tags |
| Leaf | `#789653` | `#789653` | Secondary positive states |

### Semantic UI

```css
--success: #5F7D3B;
--warning: #D99A2B;
--danger: #C95D4E;
--info: #6A9DA8;
```

---

## 5. Implementation tokens

Public site (`apps/web`) is the neo-brutalist mapping. Tailwind utilities: `bg-brand-green`, `text-brand-cream`, `bg-accent-mango`, `bg-ink`, `shadow-nb`, `shadow-brand-offset`. Admin still uses the softer radii and faded accents.

```css
:root {
  --color-ink: #10100a;
  --brand-green: #284400;
  --brand-cream: #fcf4c6;
  --accent-guava: #f2603f;
  --accent-mango: #ffc42e;
  --accent-sky: #58b4cc;
  --accent-lilac: #b189d9;
  --accent-leaf: #789653;
  --background: #fcf4c6;
  --foreground: #10100a;
  --primary: #284400;
  --accent: #ffc42e;
  --border: #10100a;
  --radius: 0;
}
```

Dark tokens exist for coherence (`ink` background, cream borders). `Providers.tsx` still sets `forcedTheme="light"`.

---

## 6. Typography

1. **Display / headings (web):** Anton. Single-weight condensed poster face. Headlines render uppercase with `letter-spacing: -0.02em` and `line-height: 0.92`.
2. **UI / body:** Manrope. Navigation, forms, buttons, lists, metadata, tables.
3. **Admin headings:** Figtree is still allowed on selected admin titles.

Do not use a decorative serif to fake the logo lettering. Do not mix a random serif into a sans headline.

Loaded via `next/font` as `--font-anton` and `--font-manrope` on the public site. Mapped to `--font-display`, `--font-heading`, and `--font-sans`.

---

## 7. Shape, borders, shadows

Public site rule: **every surface is square**. The only round things are player avatars and rotated sticker badges, both with a 2px ink ring.

```css
--radius: 0;
--border-nb: 2px;
--border-nb-thick: 3px;
--shadow-nb-sm: 3px 3px 0 var(--color-ink);
--shadow-nb: 6px 6px 0 var(--color-ink);
--shadow-nb-lg: 10px 10px 0 var(--color-ink);
--shadow-brand: 6px 6px 0 var(--color-ink);
```

Utility classes in `apps/web/src/app/globals.css`: `.nb-box`, `.nb-box-sm`, `.nb-press`, `.nb-sticker`, `.nb-band`, `.nb-marquee`, `.nb-card-link`. Use at most one marquee per page (footer).

---

## 8. Buttons

- **Primary (web):** `#284400` background, cream text, 2px ink border, hard offset shadow. Press: translate 3px and collapse the shadow.
- **Secondary:** cream or mango fill, ink border, same press.
- Never generic SaaS blue. Never pill radius on the public site.

---

## 9. Cards and chrome

Cards should feel like recreation-club cards or social invitations, not enterprise panels. Featured cards may use a green border, one accent header, or a small offset shadow.

Public marketing surfaces can be more expressive. Admin keeps the same palette and type but simpler: sans for most UI, green as the interaction color, cream pages, warm-white cards, Figtree only on selected headings.

---

## 10. Motion, voice, empty states

Motion: small button bounce, soft card lift, sticker-like scale-in. Fast 120-180ms, standard 180-260ms, playful spring 300-450ms. Honor `prefers-reduced-motion`.

Voice: casual, warm, short, encouraging. Prefer "You're in." over "Your request has been successfully processed." Prefer "No playmates yet. Try widening your search." over "No matching users were found."

Filipino warmth is welcome when it is natural (`Tara?`, `G?`, `Sama ka?`). Do not force Tagalog onto every screen.

Empty states are brand moments: "Nothing happening yet?" / "Quiet in here." Loading copy may say "Finding playmates…" or "Warming up…" on non-critical flows.

---

## 11. Accessibility

Playfulness must not reduce usability. WCAG AA contrast, no color-only status, visible focus, 44px tap targets where possible, meaningful icon labels. Audit cream-on-green and green-on-cream component by component.

---

## 12. Brand formula

> Warm cream foundation + deep green structure + Anton headlines + ink outlines + hard shadows + one playful accent + the Playmates mascot.

If a design feels too corporate, increase warmth. If it feels too childish, drop decoration and return to cream and green.

**Primary visual rule:** Cream first. Green second. Accents third.

**Final principle:** Playmates ni José should feel less like software people have to use and more like an invitation people want to accept.

> Tara, laro tayo.
