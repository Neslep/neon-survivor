import { G, view } from "./state.js";
import { pauseGame, resumeGame, toggleMute, toggleFullscreen } from "./ui.js";

const MOVE_KEYS = [
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  " ",
];

export function initInput() {
  window.addEventListener(
    "keydown",
    (e) => {
      const k = e.key.toLowerCase();
      G.keys[k] = 1;
      if (MOVE_KEYS.includes(k)) e.preventDefault();
      if (k === "p" || k === "escape") {
        if (G.state === "playing") pauseGame();
        else if (G.state === "paused") resumeGame();
      }
      if (k === "m") toggleMute();
      if (k === "f") toggleFullscreen();
    },
    { passive: false },
  );
  window.addEventListener("keyup", (e) => {
    G.keys[e.key.toLowerCase()] = 0;
  });

  const cv = view.cv;
  cv.addEventListener("pointerdown", (e) => {
    if (G.state !== "playing") return;
    G.joyA = { x: e.clientX, y: e.clientY };
    G.joy = { x: e.clientX, y: e.clientY };
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener("pointermove", (e) => {
    if (G.joyA) G.joy = { x: e.clientX, y: e.clientY };
  });
  cv.addEventListener("pointerup", () => {
    G.joyA = null;
    G.joy = null;
  });
  cv.addEventListener("pointercancel", () => {
    G.joyA = null;
    G.joy = null;
  });
}
