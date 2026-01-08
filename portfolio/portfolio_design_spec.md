---
doc_type: portfolio_design_spec
project: ethan-portfolio
version: 1.1.0
last_updated: 2026-01-04
primary_stack:
  - Vite
  - React
  - TailwindCSS_v4
  - GSAP
assets:
  storefront_svg: Storefront.svg
  shelf_svg: Shelf.svg
  noise_asset: noise.png
conventions:
  svg_id_prefix: none
  css_units: px
  easing_names: gsap_ease_strings
---

# Portfolio Design + Motion Spec (AI-Parseable)

This document defines **visual design tokens**, **layout rules**, **animation timelines**, and **interaction logic** for a personal portfolio website with a **retro mid-century cereal-box / pop-art packaging** vibe blended with a **modern, clean full-stack portfolio** aesthetic.

## 0) Design Intent

- **Retro packaging vibe**: bold-but-muted reds/yellows/teals, flat color blocking, chunky labels, subtle halftone/noise grain.
- **Modern polish**: clean spacing, readable typography, responsive layout, smooth motion, accessible focus/hover states.
- **Core metaphor**: user enters a grocery storefront, then browses **shelves** where each shelf is a portfolio section.

---

# 1) Design Tokens

## 1.1 Color Palette

> These are the *current* colors found in code. If you later refine colors (e.g., from Figma), update tokens here and keep token names stable.

### Primary Tokens

| Token | Hex / RGBA | Usage |
|---|---:|---|
| `color.bg.heroRed` | `#C2352B` | Storefront hero background |
| `color.bg.creamPaper` | `#FFF5E0` | Paper/packaging cream, overlay flash |
| `color.accent.red` | `#F0544F` | Accent pill/label background |
| `color.text.ink` | `#2B1B17` | Primary text / outlines |
| `color.text.body` | `#3B3734` | Secondary text |
| `color.bg.deepCharcoal` | `#2F3236` | Dark UI background (optional) |
| `color.shadow.brown55` | `rgba(30,18,14,0.55)` | Drop shadow block behind card |
| `color.shadow.brown80` | `rgba(30,18,14,0.80)` | Stronger shadow variant (sparingly) |

### Suggested Shelf/Wood Tokens (placeholders)

> If your shelf art is in SVG, prefer using its intrinsic colors. Only use these if you implement shelf UI in CSS.

| Token | Hex | Intended feel |
|---|---:|---|
| `color.shelf.wood1` | `#C9A26B` | warm wood base |
| `color.shelf.wood2` | `#B88A55` | darker band |
| `color.shelf.woodEdge` | `#7A4E2E` | outline/edge contrast |

## 1.2 Typography

> Use a retro display font for labels + a modern sans for body.

| Token | Value | Usage |
|---|---|---|
| `font.display` | `Bungee` (Google Font) | shelf labels, section headers, packaging-style UI |
| `font.body` | `Inter` (Google Font) | paragraphs, UI text |
| `font.mono` | `ui-monospace` | code snippets if any |

### Type Scale

| Token | Size | Usage |
|---|---:|---|
| `type.h1` | `32px`–`40px` | main right-panel title |
| `type.h2` | `24px`–`28px` | section titles |
| `type.body` | `16px`–`18px` | paragraphs |
| `type.microCaps` | `11px`–`12px` | aisle labels / eyebrow strips |

## 1.3 Spacing + Radius

| Token | Value |
|---|---:|
| `space.1` | `4px` |
| `space.2` | `8px` |
| `space.3` | `12px` |
| `space.4` | `16px` |
| `space.5` | `24px` |
| `space.6` | `32px` |
| `radius.sm` | `6px` |
| `radius.md` | `10px` |
| `radius.lg` | `24px` |

## 1.4 Elevation / Shadows

- Retro look favors **hard-edged offset shadows** over soft realistic shadows.

| Token | Value | Notes |
|---|---|---|
| `shadow.offset.x` | `14px` | used on Storefront card shadow block |
| `shadow.offset.y` | `14px` | used on Storefront card shadow block |
| `shadow.blockColor` | `rgba(30,18,14,0.55)` | consistent ink-like shadow |

## 1.5 Motion Tokens (GSAP)

| Token | Value |
|---|---|
| `ease.out` | `power1.out` |
| `ease.inOut` | `power1.inOut` |
| `ease.in` | `power2.in` |
| `ease.premium` | `expo.out` |
| `dur.hover` | `0.4s` |
| `dur.doors` | `2.2s` |
| `dur.zoom` | `2.8s` |
| `dur.overlayToWhite` | `2.8s` |
| `dur.shelfSettle` | `0.7s` |
| `dur.overlayReveal` | `0.8s` |

---

# 2) Global Visual Effects

## 2.1 Noise / Grain Overlay (Figma-like)

**Goal:** subtle paper/noise texture across scenes (storefront + shelves).

### Implementation (recommended)

- Use a small tiling `noise.png` (transparent PNG).
- Apply as a pseudo-element overlay:
  - `pointer-events: none`
  - `opacity: 0.06`–`0.10`
  - `mix-blend-mode: soft-light` (or `overlay` for stronger grain)

```css
/* global.css */
.grain {
  position: relative;
}
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("/noise.png");
  background-size: cover; /* or 280px 280px for more obvious grain */
  opacity: 0.08;
  mix-blend-mode: soft-light;
}
```

### Rules

- Apply **once globally** (e.g., in `App`) to avoid double-grain flicker.
- Keep grain subtle to preserve legibility.

---

# 3) Screens + Layout

## 3.1 Screen: StorefrontHero

**Purpose:** entry moment. A centered “store card” with sliding glass doors. Clicking initiates the door-open + zoom-in + overlay transition into shelf screen.

### Layout

- Viewport: `min-h-screen`, center content.
- Background: `color.bg.heroRed`.
- Card: `StorefrontSvg` displayed at ~`625px` width (responsive downscale on smaller screens).

### Layering (Z-Index)

| Layer | Element | z-index |
|---|---|---:|
| Top | transition overlay (App-level) | `50` |
| Mid | Storefront SVG (card) | `10` |
| Low | shadow block | `0` |
| Base | background | `0` |

### Required SVG IDs (inside `Storefront.svg`)

These must exist for GSAP selectors:

- `#DoorsLeft`
- `#DoorsRight`
- `#WallLeft`
- `#WallRight`
- (Optional) `#StoreCard` if you later animate the SVG group rather than a wrapper div.

## 3.2 Screen: ShelfScreen

**Purpose:** main browsing experience with grocery shelves as navigation.

### Layout (high-level)

- Left: Shelf SVG navigation area
- Right: Content panel with section details
- Default right state: Welcome panel (`home`)
- Clickable shelf hotspots map to sections:
  - `featured`
  - `skills`
  - `ingredients`
  - `whereToBuy` (contact)

### Shelf Hotspots (percent-based)

```json
{
  "hotspots": [
    { "id": "featured", "top": "5%", "height": "20%" },
    { "id": "skills", "top": "28%", "height": "18%" },
    { "id": "ingredients", "top": "48%", "height": "20%" },
    { "id": "whereToBuy", "top": "71%", "height": "20%" }
  ]
}
```

---

# 4) Interactions

## 4.1 StorefrontHover

**Trigger:** `mouseenter` / `mouseleave` on the storefront button.  
**Disable when:** click animation is playing (`isPlaying === true`).

### Hover Motion (GSAP timeline)

- Card lifts slightly and scales:
  - `y: -8`
  - `scale: 1.02`
  - duration `0.4`, ease `power1.out`
- Shadow becomes slightly softer + lighter:
  - `opacity: 0.35`
  - `filter: blur(1px)`
  - `scaleX: 1.03`, `scaleY: 1.02`
  - duration `0.4`, ease `power1.out`

## 4.2 StorefrontClick

**Trigger:** click on storefront button.  
**Behavior:**
- Freeze hover state where it is (no snap).
- Play click timeline from start.
- Start screen transition overlay at the moment zoom begins.

### Click Motion Timeline (relative timestamps)

| Time (s) | Target | Property | Value | Duration | Ease |
|---:|---|---|---|---:|---|
| 0.0 | `#DoorsLeft` | `xPercent` | `-85` | 2.2 | `expo.out` |
| 0.0 | `#DoorsRight` | `xPercent` | `85` | 2.2 | `expo.out` |
| 0.2 | `#WallLeft,#WallRight` | `opacity` | `0.9` | 0.8 | `power2.inOut` |
| 0.95 | `shadowRef` | `opacity/filter/scale` | fade + blur + scale | 2.6 | `power2.in` |
| 1.0 | `cardRef` | `scale` | `3.0` | 2.8 | `power2.in` |
| 1.0 | `cardRef` | `yPercent` | `-4` | 2.8 | `power2.in` |
| 1.0 | `cardRef` | `opacity` | `0` | 2.8 | `power2.in` |
| 1.0 | **CALL** | `onEnterStore()` | start App overlay transition | 0 | — |

> Note: keep card opacity **visible** during zoom; the overlay fade-to-white hides it “over the top” for a cleaner, continuous feel.

### Click Guardrails

- Set `isPlaying = true` at click start
- Disable hover timeline plays/reverses while `isPlaying`
- At end of click timeline, set `isPlaying = false` (but screen is likely already transitioned)

---

# 5) Screen Transition: Storefront → Shelf

**Owner:** App-level transition controller (keeps overlay above both screens).

## 5.1 Transition Goals

- Fade to cream/white **over** zooming storefront (no snap)
- Swap screens only when overlay is fully opaque
- Reveal shelf screen with a settle-in (scale down to 1, blur to 0)

## 5.2 Transition Timeline (called at Storefront t=1.0s)

### Initial state

- `overlay`: `autoAlpha: 0`
- `shelfWrap`: mounted but hidden `autoAlpha: 0`, `scale: 1.03`, `filter: blur(10px)`, `pointerEvents: none`
- `heroWrap`: visible

### Timeline

| Local Time (s) | Target | Action | Ease |
|---:|---|---|---|
| 0.00 → 2.80 | `overlay` | `autoAlpha: 0 → 1` (fade to cream) | `power1.inOut` |
| 2.80 | **swap** | `setShowHero(false)`, set `shelfWrap autoAlpha: 1` | — |
| 2.70 → 3.40 | `shelfWrap` | `scale: 1.03 → 1`, `blur: 10px → 0` | `expo.out` |
| 2.95 → 3.75 | `overlay` | `autoAlpha: 1 → 0` (reveal shelf) | `power1.out` |
| end | `shelfWrap` | `pointerEvents: auto` | — |

### Key Constraint

- The swap must occur **only** when `overlay` is fully opaque to avoid double exposure.

---

# 6) Implementation Notes

## 6.1 SVG Import + Animation

- Use `vite-plugin-svgr` and import with `?react`:
  - `import StorefrontSvg from "../assets/Storefront.svg?react";`
- GSAP selectors (e.g. `"#DoorsLeft"`) require the SVG be **inline** (SVGR does this).

## 6.2 React/GSAP Lifecycle Safety

**Do NOT re-run GSAP setup mid-animation due to prop identity changes.**

- In `StorefrontHero`, keep the GSAP initialization effect stable:
  - `useLayoutEffect(..., [])`
- Store `onEnterStore` in a ref (`onEnterStoreRef`) and call that ref inside the GSAP timeline.

## 6.3 Z-Index / Stacking Context

- Ensure overlay is always above everything:
  - `overlay: z-50`
- Make the storefront button `isolate` to keep shadow layering predictable.

---

# 7) Accessibility + UX

- Ensure storefront is a `<button>` with visible focus ring.
- While transitions are running:
  - disable repeated clicks
  - disable hover timeline changes
- Respect reduced motion (optional enhancement):
  - if `prefers-reduced-motion`, reduce durations and skip blur/large zoom.

---

# 8) Acceptance Criteria (Quick QA)

## Storefront

- Hover: card lifts smoothly; shadow softens; no jitter.
- Click:
  - doors open continuously with smooth expo.out easing (no snapping closed)
  - card begins zoom at ~1.0s (slightly before doors fully open for better flow)
  - overlay begins fading to cream at the same moment as zoom begins (1.0s)
  - overlay is above card with z-50 (card remains visible under overlay)
  - no "reflash" / no second beat

## Transition

- When overlay reaches full opacity:
  - hero swaps out invisibly
  - shelf swaps in invisibly
- Overlay fades out to reveal shelf with a gentle settle-in.

---

# 9) Machine-Readable Token Dump (JSON)

```json
{
  "colors": {
    "bg": {
      "heroRed": "#C2352B",
      "creamPaper": "#FFF5E0",
      "deepCharcoal": "#2F3236"
    },
    "accent": {
      "red": "#F0544F"
    },
    "text": {
      "ink": "#2B1B17",
      "body": "#3B3734"
    },
    "shadow": {
      "brown55": "rgba(30,18,14,0.55)",
      "brown80": "rgba(30,18,14,0.80)"
    }
  },
  "motion": {
    "ease": {
      "out": "power1.out",
      "inOut": "power1.inOut",
      "in": "power2.in",
      "premium": "expo.out"
    },
    "durations_s": {
      "hover": 0.4,
      "doors": 2.2,
      "zoom": 2.8,
      "overlayToWhite": 2.8,
      "shelfSettle": 0.7,
      "overlayReveal": 0.8
    },
    "storefront": {
      "hover": {
        "card": {
          "y": -8,
          "scale": 1.02,
          "duration": 0.4,
          "ease": "power1.out"
        },
        "shadow": {
          "opacity": 0.35,
          "blur_px": 1,
          "scaleX": 1.03,
          "scaleY": 1.02,
          "duration": 0.4,
          "ease": "power1.out"
        }
      },
      "click": {
        "doors": {
          "left_xPercent": -85,
          "right_xPercent": 85,
          "duration": 2.2,
          "ease": "expo.out"
        },
        "walls": {
          "opacity": 0.9,
          "duration": 0.8,
          "ease": "power2.inOut",
          "startTime_s": 0.2
        },
        "zoomStart_s": 1.0,
        "cardZoom": {
          "scale": 3.0,
          "yPercent": -4,
          "opacity": 0,
          "duration": 2.8,
          "ease": "power2.in"
        },
        "shadowFade": {
          "opacity": 0,
          "blur_px": 20,
          "scaleX": 1.1,
          "scaleY": 1.1,
          "duration": 2.6,
          "ease": "power2.in",
          "startTime_s": 0.95
        }
      }
    },
    "transition": {
      "overlayFadeIn": {
        "duration": 2.8,
        "ease": "power1.inOut"
      },
      "shelfSettle": {
        "duration": 0.7,
        "ease": "expo.out",
        "startTime_s": 2.7
      },
      "overlayFadeOut": {
        "duration": 0.8,
        "ease": "power1.out",
        "startTime_s": 2.95
      }
    }
  },
  "svg_ids": [
    "DoorsLeft",
    "DoorsRight",
    "WallLeft",
    "WallRight"
  ],
  "shelf_hotspots": [
    {
      "id": "featured",
      "top": "5%",
      "height": "20%"
    },
    {
      "id": "skills",
      "top": "28%",
      "height": "18%"
    },
    {
      "id": "ingredients",
      "top": "48%",
      "height": "20%"
    },
    {
      "id": "whereToBuy",
      "top": "71%",
      "height": "20%"
    }
  ]
}
```

