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
| Soft Cream | `#FFF9E6` | Elevated cards on cream |
| Warm White | `#FFFCF3` | Forms, modals, content-heavy surfaces |
| Ink Green | `#182B0B` | High-contrast text |
| Muted Olive | `#6D7A45` | Secondary text, metadata, inactive UI |

### Playful accents (sun-faded, not neon)

| Name | Hex | Use |
|---|---|---|
| Guava | `#E97864` | Social highlights, reactions, occasional badges |
| Mango | `#F2B84B` | Featured moments, activity indicators |
| Sky | `#8DBCC7` | Informational states |
| Lilac | `#B6A3C9` | Category tags, special events (sparingly) |
| Leaf | `#789653` | Secondary positive states |

### Semantic UI

```css
--success: #5F7D3B;
--warning: #D99A2B;
--danger: #C95D4E;
--info: #6A9DA8;
```

---

## 5. Implementation tokens

Both apps share this mapping. Tailwind utilities: `bg-brand-green`, `text-brand-cream`, `bg-accent-mango`, `shadow-brand`, `shadow-brand-offset`.

```css
:root {
  --brand-green: #284400;
  --brand-green-dark: #182b0b;
  --brand-cream: #fcf4c6;
  --brand-cream-soft: #fff9e6;
  --brand-white: #fffcf3;

  --accent-guava: #e97864;
  --accent-mango: #f2b84b;
  --accent-sky: #8dbcc7;
  --accent-lilac: #b6a3c9;
  --accent-leaf: #789653;

  --background: #fcf4c6;
  --foreground: #182b0b;
  --card: #fff9e6;
  --primary: #284400;
  --primary-foreground: #fff9e6;
  --accent: #f2b84b;
  --destructive: #c95d4e;
  --border: #d9d9b5;
  --ring: #789653;
  --radius: 0.875rem;
}
```

Dark mode stays warm olive, not black-and-neon:

```css
.dark {
  --background: #17200f;
  --foreground: #fff4c9;
  --card: #202b17;
  --border: #485536;
}
```

---

## 6. Typography

1. **Display / headings:** Figtree (600-900). Thick, friendly sans. Used for hero headlines, section titles, empty-state titles, branded moments.
2. **UI / body:** Manrope. Navigation, forms, buttons, lists, metadata, tables.

Do not use a decorative serif to fake the logo lettering. Do not mix a random serif into a sans headline.

```css
font-weight: 700-900; /* display */
letter-spacing: -0.02em;
line-height: 0.95-1.05; /* headlines */
line-height: 1.5-1.65; /* body */
```

Loaded via `next/font` as `--font-figtree` and `--font-manrope`. Mapped to `--font-display`, `--font-heading`, and `--font-sans`.

---

## 7. Shape, borders, shadows

```css
--radius-sm: 8px;
--radius-md: 14px;
--radius-lg: 20px;
--radius-xl: 28px;
--radius-pill: 999px;

border: 1px solid #d9d9b5; /* default */
border: 2px solid #284400; /* featured cards / primary CTAs */

--shadow-brand: 0 4px 14px rgba(40, 68, 0, 0.08);
--shadow-brand-offset: 4px 4px 0 #284400; /* sparingly */
```

Soft rounded cards, pill filters, circular avatars. Not every control should be bubbly.

---

## 8. Buttons

- **Primary:** `#284400` background, `#FFF9E6` text, pill radius, hover `#182B0B`.
- **Secondary:** transparent, green text, 1.5px green border.
- **Playful CTA:** mango, guava, or cream with an offset green shadow. Never generic SaaS blue.

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

> Warm cream foundation + deep green structure + friendly sans-serif UI + expressive Figtree headline + one playful accent + people-first content.

If a design feels too corporate, increase warmth. If it feels too childish, drop decoration and return to cream and green.

**Primary visual rule:** Cream first. Green second. Accents third.

**Final principle:** Playmates ni José should feel less like software people have to use and more like an invitation people want to accept.

> Tara, laro tayo.
