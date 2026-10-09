---
name: ui-ux
description: UI/UX rules and the responsive workflow for the admin panel and the customer site — layout for phone and desktop, states, forms, money/date formatting, accessibility, order-status colors, and a screenshot check at 375/768/1440 px. Use for every task that creates or changes a screen.
---

# UI/UX rules

Goal: a screen that works on a 375 px phone **and** a 1440 px desktop on the
first delivery. Design for the phone first, then let it grow.

## Workflow (every UI task)

1. **Before coding, write down** (in your head or the reply): who uses the screen,
   on which device, the one primary action, and every state it can be in
   (loading, empty, error, partial data, no permission, success).
2. Reuse what exists: admin → Fuse layout + PrimeNG + `app-grid`/`app-table-filter`/
   Formly; client → Tailwind + PrimeNG. Copy the closest existing screen's structure.
3. Build mobile layout first (single column), add `sm:`/`md:`/`lg:` for wider screens.
4. Fill with **realistic data**: long Uzbek/Russian names, 0 items, 1 item, 200 items,
   a 60-character title. Russian strings run ~30% longer than English.
5. Run the responsive check (below), then **open the screenshots and look at them**
   with the Read tool. Fix what you see, rerun. Only then report done.

```bash
node .claude/skills/ui-ux/responsive-check.mjs --base http://localhost:4300 \
  --paths /reference/regions --login admin --out /tmp/ui-check
```

It screenshots phone (375×812), tablet (768×1024) and desktop (1440×900), and lists
horizontal page overflow, elements past the viewport edge, tap targets under 32 px,
console errors and HTTP ≥ 400. Exit code 1 means issues. Requires the API and the app
running (see the `verify` skill). The sign-in endpoint allows 5 attempts/min; the
script signs in once.

## Layout

- Breakpoints — admin (Fuse `tailwind.config.js`): `sm` 600, `md` 960, `lg` 1280,
  `xl` 1440. Client: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
- No fixed pixel widths on containers; use `w-full` + `max-w-*`, `flex-wrap`, grid
  with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Flex children with text get `min-w-0`; long text gets `truncate` or `break-words`.
  The page itself must never scroll sideways.
- Wide tables: in admin, keep them inside their own horizontal scroller and put the
  2–3 most important columns first; in the client, render a card list on phones.
- Dialogs: full screen on phones. PrimeNG `DialogService.open(..., { width: '50vw',
  breakpoints: { '960px': '75vw', '640px': '100vw' } })`. Long forms → a page, not a dialog.
- Primary action: on phones full-width, reachable by the thumb (bottom sticky bar for
  checkout/wizard steps, respecting `env(safe-area-inset-bottom)`); on desktop, right-aligned.
- Spacing on the 4 px scale (Tailwind `p-4`, `gap-6`…). Page side padding: 16 px on
  phones, 24–32 px from `md`.
- Images: fixed `aspect-ratio` boxes so nothing jumps while loading; `loading="lazy"`
  below the fold.

## States

- Loading: skeletons for lists/cards, spinner only inside buttons. No blank screens.
- Empty: an explanation plus the action that fixes it ("Hali bola qo'shilmagan" + button).
- Error: human message in the user's language plus "Qayta urinish"; keep the form data.
- Submitting: disable the button and show progress; **never allow double submit** on
  anything that spends money, starts generation or changes order status.
- Success: toast for small actions; a dedicated screen for payment / order placed.
- Long jobs (AI generation): show steps and a realistic time estimate, let the user
  leave, and say they'll be notified in Telegram.

## Forms

- Label above the field, always visible (no placeholder-only labels).
- Validate on blur and on submit; message under the field, translated.
- Correct types: phone `type="tel"` with `+998` prefix, `inputmode="numeric"` for
  numbers, `autocomplete` (`name`, `tel`, `postal-code`).
- Inputs at least 16 px font on phones (prevents iOS zoom); controls ≥ 44 px tall on
  touch screens.
- Enter submits; the first invalid field gets focus after a failed submit.
- Destructive actions confirm with the record's name; money actions show the amount.

## Visual language

- Colors only from theme tokens (Fuse theme variables / PrimeNG preset in admin,
  Tailwind theme in client). No raw hex in components.
- Text contrast WCAG AA (4.5:1). Never signal meaning by color alone — pair with text/icon.
- Order status tags, the same everywhere (PrimeNG `p-tag` severity):

| Status | Severity |
| --- | --- |
| `PAID`, `GENERATING`, `PRINT_QUEUE`, `PRINTING` | `info` |
| `MODERATION`, `REWORK`, `CUSTOMER_REVIEW`, `ON_HOLD` | `warn` |
| `APPROVED`, `PRINTED`, `SHIPPED`, `DELIVERED` | `success` |
| `CANCELLED`, `RETURNED` | `danger` |
| `REFUNDED` | `secondary` |

- Icons: admin uses heroicons via `fuse-icon` / PrimeIcons, client picks one set.
  Icon-only buttons need `aria-label` and a tooltip on desktop.

## Formatting (Uzbekistan)

- Money: API sends tiyin; show so'm, integer, space as thousands separator:
  `125 000 so'm`. One shared pipe/helper, never ad-hoc.
- Dates `dd.MM.yyyy`, time `HH:mm`, timezone `Asia/Tashkent`.
- Phone `+998 90 123 45 67`.
- Translatable content through `pickTranslation` / `translatable` pipe; UI text through
  i18n keys (see the `i18n` skill). Uzbek in Latin script with `'` (o', g').

## Accessibility

Keyboard reachable, visible focus ring, logical tab order, `alt` on meaningful images,
form errors linked to fields, respect `prefers-reduced-motion`.

## Admin panel specifics

- Users: staff on desktop most of the day; must still work on a phone for quick checks.
- Lists: filters in the collapsible filter panel, sensible default sort (newest first
  for orders), counts visible, row click opens the record.
- Show only actions the admin's permissions allow.
- Moderation screen: original photo and generated page side by side on desktop,
  stacked on phones; keyboard shortcuts for approve / regenerate / next; the current
  page's text editable inline.
- Dashboards: numbers first (cards), then charts; every number links to the filtered list.

## Customer site specifics

- Users: parents on phones, often inside the **Telegram in-app browser**. Google sign-in
  is blocked there (`disallowed_useragent`): detect it, offer Telegram login first,
  and show "open in browser" for Google.
- Landing: real example book spreads above the fold, price visible, 3-step "how it
  works", one CTA "Bepul sinab ko'rish".
- Wizard (child → photo → template → preview): one step per screen on phones, progress
  indicator, back without losing data, state survives a page reload.
- Photo upload: `accept="image/*"` (camera on phones), good/bad examples, resize on the
  client before upload, explain the quality-check result in plain words.
- Previews: watermarked, no download button, right-click/long-press disabled (cosmetic).
- Checkout: summary, balance, missing amount with a top-up button, one pay button.
- Performance: LCP < 2.5 s on 4G, lazy routes, `NgOptimizedImage`, SSR for public pages.

## Done checklist

- [ ] Responsive check passes and screenshots at 375/768/1440 were reviewed
- [ ] Loading, empty, error, no-permission states exist
- [ ] Tested with long ru/uz strings and with 0 and many items
- [ ] No double submit on money/status/generation actions
- [ ] Every string translated in uz/ru/en; money/dates formatted by the shared helpers
- [ ] Keyboard and focus work; icon buttons labelled
