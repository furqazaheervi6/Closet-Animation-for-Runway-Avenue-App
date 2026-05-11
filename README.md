# Closet Animation — Runway Avenue App

**Task 1 · Graphic Design Intern Project · v3**

An interactive animation prototype for the **Upload Clothes to Closet** feature of the Runway Avenue fashion app.

---

## File Structure

```
/
├── index.html          ← Main app (HTML + CSS + App module)
└└── js/
    ├── closet-door.js   ← Isolated closet door open/close animation
    └── confetti.js      ← Canvas-based fireworks celebration module
```

---

## Modules

### `js/closet-door.js`
Handles the 3D perspective door swing animation. Exposes:
- `ClosetDoor.toggle()` — open if closed, close if open
- `ClosetDoor.open()` — idempotent open
- `ClosetDoor.close()` — idempotent close

Doors swing open 85° using CSS `perspective` + `rotateY`. Closet interior fades in 380ms into the 750ms swing so clothes appear as the doors clear the frame.

### `js/confetti.js` — Fireworks Edition
Canvas-based fireworks system. Replaces the original CSS confetti-particle approach with:
- Rising rocket shell → mid-air explosion → star particles + sparks + trailing streamers
- **35-colour palette**: brand golds, reds, corals, purples, blues, cyans, greens, oranges, ambers, pinks, blush
- `Confetti.burst(x, y)` — instant radial burst at viewport coords
- `Confetti.burst(x, y, count, rocket)` — rocket that ascends and explodes at peak
- `Confetti.rain(duration, interval)` — timed automated fireworks show
- `Confetti.stopRain()` — halt an ongoing show

---

## What's New in v3

- Closet door and fireworks animations extracted into isolated, reusable JS modules
- Fireworks replace confetti: canvas rAF loop, physics-based particles, glowing trails, rocket mode
- 35-colour fireworks palette (up from 5 original colours)
- Collapsible sidebar for clothing categories
- Full 3D door swing (85° perspective) fully revealing all closet contents
- Production-refactored code: `App`, `Drag`, `Toast`, `ClosetDoor`, `Confetti` modules with unified `state` object

---

## Clothing Items

| Item | Type | Season |
|---|---|---|
| Wool Overcoat | Outerwear | Winter / Formal |
| Silk Blouse | Top | Spring / Office |
| Tailored Trousers | Bottoms | Year-round |
| Wrap Dress | Dress | Evening / Summer |
| Linen Shirt | Top | Casual / Beach |
| Denim Shorts | Bottoms | Summer |

---

## How to Run

1. Clone or download the repo
2. Open `index.html` in any browser — no build tools or server needed
3. The `js/` modules load automatically via `<script src="js/closet-door.js">` tags at the bottom of `index.html`

---

## Brand

Palette: warm champagne gold (`#c9a96e`) on dark walnut surfaces.
Fonts: DM Sans (headings) + Inter (body) via Google Fonts CDN.
