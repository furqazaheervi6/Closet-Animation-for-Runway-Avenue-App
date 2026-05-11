# Closet Animation — Runway Avenue App

**Task 1 · Graphic Design Intern Project**

An interactive animation prototype demonstrating the **Upload Clothes to Closet** feature for the Runway Avenue fashion app.

---

## Information

This is a single-file HTML/CSS/JS animation that brings to life the moment a user uploads a clothing item to their digital wardrobe. It covers the full 3-phase flow:

| Phase | What Happens....? |
|---|---|
| **1 — Upload** | Garment card rises from the drop zone with a scanning light effect |
| **2 — Detect** | Card flies across the screen toward the closet rod |
| **3 — Hang** | Item settles onto the rod with a spring bounce, sparkles, and confetti |

---

## Features

- 🎽 **Animated closet** — 6 pre-hung garments gently sway on the rod
- 📂 **Drag & drop zone** — hover and drag states with gold accent
- 💊 **Step progress pills** — Upload → Detect → Hang, updating live
- 🎨 **Color variety** — each upload cycles through navy, cream, sage, blush, caramel, charcoal
- 🌙 **Light / dark mode toggle** — full theme switching
- 🎉 **Confetti + toast** — celebratory moment on successful hang
- ♿ **Accessible** — semantic HTML, keyboard nav, ARIA labels, focus rings, reduced motion support

---

## Brand Direction

- **Accent:** Warm champagne gold (`#c9a96e`) — elevated, editorial
- **Surfaces:** Dark walnut tones in dark mode / warm ivory in light mode
- **Fonts:** Cabinet Grotesk (display) + Satoshi (body) via Fontshare
- **Motion:** Physics-inspired spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`)

---

## How to Run

Just open `index.html` in any modern browser — no build tools, no dependencies, no server needed.

```bash
open index.html
```

---

## File Structure

```
/
├── index.html   # All HTML + CSS + JS in one file
└── README.md    # This file
```
---
