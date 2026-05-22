# NEON SURVIVOR

> Survive endless waves of neon horrors in a synthwave arena.

A fast-paced, single-file HTML5 survivor-like shooter inspired by *Vampire Survivors* — wrapped in a retro CRT / neon-noir aesthetic. No build tools, no dependencies, no install. Just open the page and dodge.

**Author:** **Nguyen Gia Anh Tuan** (a.k.a. **Neslep**)

🎮 **Play now:** [neslep.github.io/neon-survivor](https://neslep.github.io/neon-survivor/)

---

## ✨ Features

- **Auto-aim combat** — your weapon locks onto the nearest enemy; focus purely on positioning.
- **5 enemy archetypes** — Basic, Fast, Tank, Shooter, Swarm — plus escalating **Tier Bosses** every 45s.
- **13 unique upgrades** across 3 rarities (Common / Rare / Epic), including risk-reward builds like `OVERLOAD` and `BERSERK`.
- **Combo system** with on-screen feedback and per-run high-score tracking.
- **Crit / damage numbers**, particle FX, screen shake, hit flashes, scanlines & vignette — full neon juice.
- **Procedural chiptune SFX** synthesized live via Web Audio (no audio files).
- **Mobile-friendly** — virtual joystick via drag, auto-scaled canvas, fullscreen support.
- **Persistent high scores** via `localStorage`.
- **Zero dependencies** — one HTML file, ~900 lines, ships anywhere a browser runs.

## 🕹️ Controls

| Action | Desktop | Mobile |
| --- | --- | --- |
| Move | `WASD` / Arrow keys | Drag anywhere on screen |
| Shoot | Automatic | Automatic |
| Pause | `P` / `Esc` | ⏸ button |
| Mute | `M` | ♪ button |
| Fullscreen | `F` | — |

## 🚀 Running Locally

```bash
git clone https://github.com/Neslep/neon-survivor.git
cd neon-survivor
# Just open index.html in any modern browser
open index.html      # macOS
# or: xdg-open index.html  (Linux)
# or: start index.html     (Windows)
```

Want a local server? Any static server works:

```bash
python3 -m http.server 8000
# then visit <http://localhost:8000>
```

## 🛠️ Tech Stack

- **HTML5 Canvas 2D** — all rendering
- **Vanilla JavaScript** — game loop, ECS-lite state, no frameworks
- **Web Audio API** — runtime-synthesized chiptune SFX
- **CSS3** — UI, HUD, CRT scanlines, neon glow
- **Google Fonts** — *Press Start 2P* + *VT323*

Deployed via **GitHub Pages** through a GitHub Actions workflow.

## 🎯 Tips for Survival

- Kite enemies in wide circles — the magnet radius pulls gems to you.
- Stack `RAPID` + `MULTI` early for an oppressive bullet stream.
- `BERSERK` is a trap unless you have `VITALITY` to buffer.
- Bosses leave 6 gems on death — bait them, then burst.

## 📜 License

MIT — feel free to fork, remix, and learn from the code.

## 👤 Author

**Nguyen Gia Anh Tuan** — *Neslep*

- GitHub: [@Neslep](https://github.com/Neslep)
- Email: <neslepofficial@gmail.com>

Built with caffeine, neon, and a love for arcade games. If you enjoy it, drop a ⭐ on the repo — it genuinely makes my day.

---

Made in Vietnam · © 2026 Neslep
