import { G, UPS } from "./state.js";
import { sfx } from "./audio.js";

function pickUps() {
  const pool = [...UPS].sort(() => Math.random() - 0.5);
  return pool.slice(0, 3);
}

export function showLvlUp() {
  G.state = "levelup";
  const flash = document.getElementById("lvlFlash");
  flash.className = "lvl-flash";
  void flash.offsetWidth;
  flash.className = "lvl-flash go";
  sfx.lvl();
  const div = document.getElementById("upCards");
  div.innerHTML = "";
  pickUps().forEach((u) => {
    const c = document.createElement("div");
    c.className =
      "up-card " + (u.r === "E" ? "epic" : u.r === "R" ? "rare" : "");
    const rarityLabel =
      u.r === "E" ? "EPIC" : u.r === "R" ? "RARE" : "COMMON";
    c.innerHTML =
      `<div class="rarity">${rarityLabel}</div>` +
      `<div class="glyph">${u.ic}</div>` +
      `<div class="uname">${u.n}</div>` +
      `<div class="udesc">${u.d}</div>`;
    c.onclick = () => {
      sfx.click();
      u.fn(G.p);
      document.getElementById("mLevel").classList.add("hidden");
      G.state = "playing";
      G.last = performance.now();
    };
    div.appendChild(c);
  });
  document.getElementById("mLevel").classList.remove("hidden");
}
