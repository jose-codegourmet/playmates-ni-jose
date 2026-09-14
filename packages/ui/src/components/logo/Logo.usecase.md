# Logo — Use Cases

> Part of the [Component Usage Guide](../../../../../docs/component-guide.md).

## Purpose

Playmates ni José wordmark and compact `P` mark. Fill follows `currentColor` unless `fill` is set.

## When to use

- App chrome (header, footer, admin sidebar, login)
- Empty states and branded moments that need the official lettering

## When NOT to use

- Recreating the lettering in Figtree or any other font
- Decorative icons that are not the brand mark

## Examples

```tsx
import { Logo } from "@fe-template/ui";

<Logo className="h-8 w-auto text-primary" title="Playmates ni José" />
<Logo variant="mark" className="size-6 text-primary" />
<Logo className="h-8 w-auto" fill="#284400" />
```

## Gotchas

- Pass `title` when the logo is the only accessible name. Otherwise it is `aria-hidden`.
