# okethan35.github.io — AI / contributor context

## What this is

Personal portfolio site for GitHub Pages (`okethan35.github.io`). The **entire interactive app** lives in the **`portfolio/`** subdirectory (React + Vite). The repository root may only contain this folder and metadata; treat **`portfolio/`** as the project root for installs, builds, and linting.

## User-facing experience

1. **Storefront hero** — SVG-based storefront (`StorefrontHero.jsx`) with GSAP motion and an optional noise overlay (`FigmaNoiseOverlay.jsx`). Entering transitions into the main view.
2. **Shelf / grocery experience** — `ShelfScreen.jsx` mounts **`GroceryStore3D.jsx`**: a full-screen **React Three Fiber** scene with aisles, shelf layout, GLB product models, camera transitions, and focus states. Portfolio content (projects, skills, contact) is largely **data-driven** via the `AISLES` / product config inside `GroceryStore3D.jsx` (not a separate CMS).
3. **Supporting sections** — Additional components (`AboutSection`, `ContactSection`, `ProjectsSection`, various hero variants) exist for layout and narrative; the dominant “wow” path is the 3D store.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, JSX (no TypeScript in app source) |
| Build | Vite via **rolldown-vite** (see `package.json` overrides) |
| Styling | **Tailwind CSS v4** with `@tailwindcss/vite` |
| Animation | **GSAP** (including `gsap.context` in components for scoped selectors) |
| 3D | **three**, **@react-three/fiber**, **@react-three/drei** |
| SVG in React | `vite-plugin-svgr` (e.g. `*.svg?react`) |

## Commands

All commands assume current directory is **`portfolio/`**:

```bash
npm install
npm run dev      # Vite dev server
npm run build    # production build to dist/
npm run preview  # serve dist locally
npm run lint     # ESLint
```

## Important paths

| Path | Role |
|------|------|
| `portfolio/src/App.jsx` | Top-level flow: hero ↔ shelf, scroll chrome, GSAP transition orchestration |
| `portfolio/src/components/GroceryStore3D.jsx` | Main 3D experience + aisle/product configuration |
| `portfolio/src/components/3D/` | R3F subcomponents (shelves, lights, models, loading fallback, etc.) |
| `portfolio/public/models/` | **GLB** (and related) assets; referenced as `/models/...` in dev/build |
| `portfolio/vite.config.js` | Plugins: React, Tailwind v4, SVGR; `publicDir: 'public'` |

## Design notes (authoritative source: `portfolio/portfolio_design_spec.md`)

The **canonical visual, motion, and interaction spec** is **`portfolio/portfolio_design_spec.md`** (versioned YAML front matter, tokens, timelines, QA checklist). Prefer it when design choices in code drift. Below is a condensed guide for quick orientation.

### Intent and metaphor

- **Vibe:** Retro mid-century **cereal-box / pop-art packaging** (bold-but-muted reds, yellows, teals; flat color blocks; chunky labels; subtle **halftone / noise** grain) blended with a **modern** full-stack portfolio (clean spacing, readable type, smooth motion).
- **Metaphor:** User enters a **grocery storefront**, then browses **shelves** where shelf areas map to portfolio sections (featured, skills, ingredients, contact / “where to buy”).

### Color tokens (from spec)

| Token / role | Value | Usage |
|--------------|-------|--------|
| Hero background | `#C2352B` | Storefront hero red |
| Cream / paper | `#FFF5E0` | Overlay flash, paper feel |
| Accent | `#F0544F` | Pills, labels |
| Text ink / body | `#2B1B17` / `#3B3734` | Primary / secondary text |
| Deep charcoal | `#2F3236` | Optional dark UI |
| Shadow blocks | `rgba(30,18,14,0.55)` (and 0.80 variant) | Hard-edged retro shadows |

Wood-toned shelf tokens in the spec are optional if shelf art stays in SVG/CSS; **`ShelfBackground.css`** also defines brown wood variables—keep them visually aligned with the spec when changing either.

### Typography

- **Display:** `Bungee` — shelf-style labels, packaging headers (loaded in `index.html`).
- **Body:** Spec names **Inter**; the HTML link also includes **Work Sans** — use one body family consistently with the spec unless you update both spec and `index.html`.
- **Scale (spec):** H1 ~32–40px, H2 ~24–28px, body 16–18px, micro caps 11–12px for aisle/eyebrow labels.

### Spacing, radius, shadows

- **Spacing scale:** 4 → 8 → 12 → 16 → 24 → 32px (`space.1` … `space.6`).
- **Radius:** sm 6px, md 10px, lg 24px.
- **Shadows:** Retro **hard offset** shadows, not soft realism — e.g. **14px / 14px** offset on the storefront card shadow block; brown ink-like fill.

### Motion (GSAP)

- **Easing (names in spec):** `power1.out` / `power1.inOut` / `power2.in`, premium `expo.out`.
- **Durations (seconds):** hover ~0.4, doors ~2.2, zoom ~2.8, overlay to cream ~2.8, shelf settle ~0.7, overlay reveal ~0.8.
- **Storefront hover (spec):** card `y: -8`, `scale: 1.02`; shadow softens (`opacity` ~0.35, slight blur, scale ~1.03×1.02).
- **Storefront click:** doors slide on `#DoorsLeft` / `#DoorsRight`; walls fade; card zoom + fade; **`onEnterStore` at ~1.0s** aligned with overlay — card stays visible under the cream overlay for a continuous feel.
- **Hero → shelf transition:** Overlay fades to opaque **before** swapping DOM (`setShowHero` / shelf visibility) so there is **no double exposure**; shelf enters blurred/scaled then settles (`expo.out`). See spec §5 for exact timing table.

### Noise / grain

- Tiling **`noise.png`**, `pointer-events: none`, opacity roughly **0.06–0.10**, **`mix-blend-mode: soft-light`** (or `overlay` if stronger).
- Apply **once** at a high level (e.g. `App`) to avoid double grain — matches `FigmaNoiseOverlay` / global grain approach.

### Storefront SVG contract

- Import via **`../assets/Storefront.svg?react`** so IDs are in the DOM for GSAP.
- Required IDs for timelines: **`#DoorsLeft`**, **`#DoorsRight`**, **`#WallLeft`**, **`#WallRight`**.
- **Z-index:** transition overlay **z-50** above card (~10) and shadow (0); storefront button uses **`isolate`** for predictable stacking.

### GSAP + React (spec §6)

- **Do not** re-run GSAP setup mid-animation because of changing callback identity — use **`useLayoutEffect(..., [])`** for setup and **`onEnterStoreRef`** for the timeline callback.

### Shelf navigation (spec vs current build)

- The design spec describes a **2D shelf SVG** with **percent-based hotspots** (featured, skills, ingredients, whereToBuy) — see JSON in spec §3.2 / §9.
- The **current primary UI** is **`GroceryStore3D`** (full 3D aisles). When adding features, reconcile with the **hybrid / 3D plans** in-repo (`HYBRID_3D_IMPLEMENTATION_PLAN.md`, `3D_INTERACTIVE_IMPLEMENTATION_SUMMARY.md`): selective 3D, **device detection** / 2D fallback, lazy loading, **one focused interactive model** at a time where applicable.

### Accessibility (spec §7)

- Storefront: real **`<button>`**, visible **focus** ring.
- During transitions: disable repeat clicks and hover timeline churn; consider **`prefers-reduced-motion`** (shorten durations, reduce blur / zoom).

### Related markdown in `portfolio/`

| File | Contents |
|------|----------|
| `portfolio_design_spec.md` | **Main design bible** — tokens, motion tables, storefront/shelf/transition QA |
| `HYBRID_3D_IMPLEMENTATION_PLAN.md` | Phased plan: 3D showcases, isometric nav, CSS 3D cards, performance |
| `3D_INTERACTIVE_IMPLEMENTATION_SUMMARY.md` | Click-to-focus, orbit, GSAP camera, device notes |
| `3D_MODELS_IMPLEMENTATION_GUIDE.md`, `CSS_3D_TRANSFORMS_EXPLAINED.md` | Implementation detail / education |
| `PRELOAD_LOADING_SCREEN_PLAN.md`, `SHELF_*_PLAN.md` | Planned loading / canvas work — not necessarily implemented |

## Conventions for edits

- **Match existing style**: functional components, hooks, inline Tailwind with occasional dedicated `.css` for complex 3D/shelf styling (`GroceryStore3D.css`, `ShelfBackground.css`).
- **Performance-sensitive**: the 3D view is heavy; prefer small, targeted changes; avoid unnecessary re-renders in the Fiber tree; use existing patterns for suspense/loading (`LoadingFallback.jsx`) where applicable.
- **Assets**: new 3D models go under `public/models/`; update product entries in `GroceryStore3D.jsx` (`modelPath`, `modelScale`, `modelRotation`, etc.).
- **Dead / backup files**: `ShelfScreen.backup.jsx` exists; prefer editing the primary `ShelfScreen.jsx` unless intentionally migrating.

## Deployment note

If the site is served from a **subpath** on GitHub Pages (project pages), Vite may need a `base` option in `vite.config.js` and consistent asset paths. For a **user** `username.github.io` repo with the built site at repo root, default `/` base is typical—confirm the actual Pages configuration before changing `base`.
