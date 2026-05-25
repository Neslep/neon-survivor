import { G } from "./state.js";
import { initCanvas } from "./canvas.js";
import { initInput } from "./input.js";
import { wireButtons, updateHighScore } from "./ui.js";
import { update } from "./update.js";
import { draw } from "./draw.js";

initCanvas();
wireButtons();
initInput();
updateHighScore();

G.last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - G.last) / 1000);
  G.last = now;
  if (G.state === "playing") update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
