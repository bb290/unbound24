---
name: Unbound
description: Design system for Unbound, a consultancy that helps local service business owners connect with the people they can help the most, so the business stays local. Plain, confident, cheeky. Black text, five colors used only as fills, sticker shapes, no gradients.
version: 1.0.0
updated: 2026-11-13
colors:
  brand:
    cream: "#F8F0E3"
    gray: "#C4C4C4"
    cyan: "#03C0E8"
    teal: "#40E0D0"
    lilac: "#D3D3FF"
    ink: "#121318"
    alert: "#FF7A59"
  light:
    bg: "#F8F0E3"
    surface: "#FFFBF4"
    surface-2: "#F0E5D2"
    line: "#E2D6C1"
    border: "#121318"
    shadow: "#121318"
    text: "#121318"
    text-muted: "#55514A"
    on-fill: "#121318"
    sidebar: "#121318"
    sidebar-text: "#F8F0E3"
    focus: "#03C0E8"
  dark:
    bg: "#121318"
    surface: "#1B1C23"
    surface-2: "#24252E"
    line: "#2E2F39"
    border: "#F8F0E3"
    shadow: "#3A3B46"
    text: "#F8F0E3"
    text-muted: "#B8B1A5"
    on-fill: "#121318"
    sidebar: "#0B0C10"
    sidebar-text: "#F8F0E3"
    focus: "#03C0E8"
typography:
  families:
    display: "Rubik, ui-rounded, system-ui, sans-serif"
    body: "Figtree, system-ui, sans-serif"
    mono: "'DM Mono', ui-monospace, Menlo, monospace"
  scale:
    display-xl: { family: display, size: 72px, line-height: 0.95, weight: 800, tracking: -0.02em, mobile-size: 44px }
    display-l:  { family: display, size: 56px, line-height: 1.0,  weight: 800, tracking: -0.02em, mobile-size: 38px }
    h1:         { family: display, size: 40px, line-height: 1.05, weight: 800, tracking: -0.01em, mobile-size: 32px }
    h2:         { family: display, size: 30px, line-height: 1.1,  weight: 800, tracking: -0.01em, mobile-size: 26px }
    h3:         { family: display, size: 22px, line-height: 1.2,  weight: 700, tracking: 0 }
    body-l:     { family: body, size: 18px, line-height: 1.55, weight: 400, tracking: 0 }
    body:       { family: body, size: 16px, line-height: 1.55, weight: 400, tracking: 0 }
    small:      { family: body, size: 14px, line-height: 1.5,  weight: 500, tracking: 0 }
    label:      { family: mono, size: 12px, line-height: 1.3,  weight: 500, tracking: 0.08em, transform: uppercase }
    code:       { family: mono, size: 13px, line-height: 1.6,  weight: 400, tracking: 0 }
rounded:
  none: 0px
  sm: 6px
  md: 12px
  lg: 20px
  xl: 28px
  pill: 999px
spacing:
  base: 4px
  "0": 0px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 24px
  "6": 32px
  "7": 48px
  "8": 64px
  "9": 96px
borders:
  hairline: 1px
  sticker: 2px
shadows:
  sticker-sm: "2px 2px 0 var(--shadow)"
  sticker: "4px 4px 0 var(--shadow)"
  sticker-lg: "6px 6px 0 var(--shadow)"
motion:
  duration: { fast: 120ms, base: 200ms, slow: 320ms, lazy: 600ms }
  easing:
    out: "cubic-bezier(.2,.8,.2,1)"
    bounce: "cubic-bezier(.34,1.56,.64,1)"
    in-out: "cubic-bezier(.65,0,.35,1)"
  tilt: { left: -2deg, right: 2deg }
breakpoints:
  sm: 480px
  md: 768px
  lg: 1024px
  xl: 1280px
components:
  button:
    radius: pill
    font: "display 700 16px"
    border: "2px solid var(--border)"
    sizes: { sm: 36px, md: 44px, lg: 52px }
    padding-x: { sm: 14px, md: 20px, lg: 26px }
    primary: { bg: cyan, text: on-fill, shadow: sticker }
    secondary: { bg: surface, text: text, shadow: sticker-sm }
    ghost: { bg: transparent, text: text, border: none, decoration: underline 2px }
    pressed: "translate(4px,4px), shadow none"
    disabled: { bg: gray, text: on-fill, shadow: none }
  tag:
    radius: pill
    height: 28px
    padding-x: 12px
    font: "body 600 13px"
    fills: [cyan, teal, lilac, gray]
    text: on-fill
    sticker-variant: "2px border, tilt -2deg"
  input:
    radius: md
    height: 48px
    padding-x: 14px
    border: "2px solid var(--border)"
    bg: surface
    focus: "0 0 0 4px focus"
    error: { message-bg: alert, message-text: on-fill }
  toggle:
    track: { width: 48px, height: 28px, radius: pill, off: gray, on: teal }
    knob: { size: 20px, bg: ink }
  card:
    radius: lg
    padding: 24px
    bg: surface
    border: "1px solid var(--line)"
    sticker-variant: "2px border + sticker shadow + accent fill"
  tab-bar:
    height: 64px
    active: "lilac pill behind icon and label"
  phone-frame:
    width: 360px
    height: 760px
    radius: 44px
---

# Unbound Design System

## Overview

Unbound helps local service business owners connect with the people they can help the most, so the business they spent 10, 15, 20 years building stays local. The customers are owner-operators of plumbing, roofing, electrical and similar businesses doing roughly $500K to $1M a year.

The system has one job: look as good as the work our clients already do, without getting in their way. It should get a little smirk in the first five seconds and then be Fisher-Price simple.

Rules in one breath:
- Text is black (cream in dark mode). The five brand colors are fills and highlights, never text.
- Shapes are stickers: rounded, outlined, with hard offset shadows. No gradients, no blur glows.
- One primary action per screen. Do less, longer.
- Every number shows where it came from.
- No emoji. No em dashes.

## Colors

Brand palette (decided 2026-11-12):

| Token | Hex | Use |
|---|---|---|
| cream | #F8F0E3 | Light page background, dark mode text |
| gray | #C4C4C4 | Neutral fills, disabled, "waiting" states |
| cyan | #03C0E8 | Primary action fill, focus ring, links underline |
| teal | #40E0D0 | Positive fills, "working" states, torn-patch highlight |
| lilac | #D3D3FF | Selected states, soft callouts, active nav |
| ink | #121318 | All text in light mode, borders, hard shadows |
| alert | #FF7A59 | Error and "needs a call" fills only. Added by the system, see Known Gaps |

Every accent is a light fill, so text on any fill is always ink (#121318). Contrast of ink on each fill is above 9:1.

Semantic tokens:

| Token | Light | Dark |
|---|---|---|
| bg | #F8F0E3 | #121318 |
| surface | #FFFBF4 | #1B1C23 |
| surface-2 | #F0E5D2 | #24252E |
| line | #E2D6C1 | #2E2F39 |
| border | #121318 | #F8F0E3 |
| shadow | #121318 | #3A3B46 |
| text | #121318 | #F8F0E3 |
| text-muted | #55514A | #B8B1A5 |
| on-fill | #121318 | #121318 |
| sidebar | #121318 | #0B0C10 |
| focus | #03C0E8 | #03C0E8 |

Dark mode keeps the fills identical. Borders flip to cream, which reads like the white die-cut edge of a sticker.

## Typography

- Display: Rubik 700/800. Heavy and slightly rounded, a cousin of the wordmark. Headlines and button labels.
- Body: Figtree 400/500/600/700. Friendly, open, easy at small sizes on a phone in a truck.
- Mono: DM Mono 400/500. Labels, token names, numbers in data tables.

Scale: display-xl 72, display-l 56, h1 40, h2 30, h3 22, body-l 18, body 16, small 14, label 12 (mono, uppercase, 0.08em), code 13. Headlines get tight leading (0.95 to 1.1) and negative tracking. Body leading is 1.55. Max line length 68ch.

Format rule from the voice: a short, punchy line up top in display, then the real story underneath in body.

## Layout

- Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Inside components use 4 to 16. Between components 24 to 32. Between sections 64 to 96.
- Content max width 1200px. Reading width 68ch.
- Gutters: 16px on mobile, 24px on tablet, 32px on desktop.
- Grids use `repeat(auto-fit, minmax(260px, 1fr))` so they reflow without breakpoints where possible.

## Elevation

There is no blurred shadow in this system. Depth comes from stickers:

- Level 0: flat, 1px `line` border. Default cards.
- Level 1: `sticker-sm` (2px 2px 0). Secondary buttons, tags with outline.
- Level 2: `sticker` (4px 4px 0). Primary buttons, feature cards.
- Level 3: `sticker-lg` (6px 6px 0). Hover lift on interactive cards, modals.

Pressing an element moves it into its shadow: `translate(4px,4px)` and shadow none.

## Components

- Button: pill, 2px border, Rubik 700. Primary is cyan with sticker shadow. Secondary is surface with sticker-sm. Ghost is text with a 2px underline. Sizes 36/44/52. Minimum hit target 44 on mobile.
- Tag: pill, 28px tall, filled with cyan, teal, lilac or gray, ink text. Sticker variant adds a 2px border and a -2deg tilt. Status tags use a dot plus words, never color alone.
- Input: 48px, 12px radius, 2px border, surface fill. Focus adds a 4px cyan ring. Errors show an alert-filled message under the field with plain words.
- Toggle: 48x28 pill track, gray off, teal on, ink knob.
- Card: 20px radius, 24px padding, surface fill, 1px line border. Feature cards are accent-filled stickers with a 2px border.
- Data: big numbers in Rubik 800, source always labeled in mono under the number. Bars are flat accent fills on surface-2 tracks.
- Navigation: dark sidebar on desktop, bottom tab bar on mobile (64px, lilac pill on the active item), segmented tabs for filters.

## Imagery

No reference images have been attached yet, so no locked styles exist. When images arrive, each becomes a numbered locked style (Style 01, Style 02...) with the reference image, a table of rules, and a copy-paste prompt: one subject sentence plus a fixed style block.

Until then: use real photos of real crews and real jobs, never stock handshakes. Torn-paper patches in teal, cyan or lilac can sit behind a subject like the logo's U. No gradients or glow effects on images.

## Responsive Behavior

- Below 900px the dark sidebar becomes an off-canvas menu opened from the top bar.
- Display sizes step down: display-xl 72 to 44, display-l 56 to 38, h1 40 to 32, h2 30 to 26.
- Side-by-side Light/Dark component panels stack below 900px.
- Product screens are designed mobile first at 360px wide.
- Touch targets are at least 44px.
- Motion respects `prefers-reduced-motion`: transitions drop to 0ms and marquees stop.

## Known Gaps

- 850 units in about 6 years at Sagareus: needs confirmation.
- $500K to $1M revenue range for the offer: needs confirmation.
- Best customer story: not provided.
- Ownership value: no specific story yet.
- Stances 5.2 (Give 10 to get 1) and 5.7 (You can't out-market a bad service): no "where it stops" limit defined.
- Stances 5.3 and 5.4 limits are proposed, not confirmed: never gate, fake or buy reviews; never promise rankings or a date.
- strongbrandsocial.com breakdown from the 2026-11-12 session was not pasted in, so its specifics are not reflected.
- No example images attached, so the Imagery section has no locked styles.
- Alert #FF7A59 was added for errors because the brand palette has no warning color. Confirm or replace.
- The brief says text is black. In dark mode text is cream (#F8F0E3) for readability. Text on fills stays black in both modes.
- Unbound's own price is meant to be public but no number was provided.
- No icon set is defined. The product screens use simple placeholder shapes.
