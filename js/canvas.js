import { G, view } from "./state.js";

export function fit() {
  view.W = window.innerWidth;
  view.H = window.innerHeight;
  view.DPR = Math.min(window.devicePixelRatio || 1, 2);
  view.cv.width = Math.floor(view.W * view.DPR);
  view.cv.height = Math.floor(view.H * view.DPR);
  view.cv.style.width = view.W + "px";
  view.cv.style.height = view.H + "px";
  view.cx.setTransform(view.DPR, 0, 0, view.DPR, 0, 0);
  // SC scales sizes/speeds based on shortest screen dim; reference 600.
  view.SC = Math.max(0.6, Math.min(1.8, Math.min(view.W, view.H) / 600));
}

export function genStars() {
  G.stars = [];
  const n = Math.floor((view.W * view.H) / 14000);
  for (let i = 0; i < n; i++)
    G.stars.push({
      x: Math.random() * view.W,
      y: Math.random() * view.H,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.5 + 0.2,
      t: Math.random() * Math.PI * 2,
      sp: 0.2 + Math.random() * 0.4,
    });
}

export function initCanvas() {
  view.cv = document.getElementById("game");
  view.cx = view.cv.getContext("2d");
  fit();
  genStars();
  window.addEventListener("resize", () => {
    fit();
    if (G.p) {
      G.p.x = Math.min(view.W - G.p.r, G.p.x);
      G.p.y = Math.min(view.H - G.p.r, G.p.y);
    }
    genStars();
  });
  window.addEventListener("orientationchange", () => setTimeout(fit, 200));
}
