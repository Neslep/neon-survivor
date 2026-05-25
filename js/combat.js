import { G, view } from "./state.js";
import { sfx } from "./audio.js";
import { part } from "./entities.js";

export function shoot() {
  const p = G.p;
  let tgt = null;
  let bd = Infinity;
  for (const e of G.en) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = dx * dx + dy * dy;
    if (d < bd) {
      bd = d;
      tgt = e;
    }
  }
  if (G.boss) {
    const dx = G.boss.x - p.x;
    const dy = G.boss.y - p.y;
    const d = dx * dx + dy * dy;
    if (d < bd) {
      bd = d;
      tgt = G.boss;
    }
  }
  if (!tgt) return;
  const ang = Math.atan2(tgt.y - p.y, tgt.x - p.x);
  for (let i = 0; i < p.proj; i++) {
    const off = (i - (p.proj - 1) / 2) * p.bspread;
    const a = ang + off;
    const isCrit = Math.random() < p.crit;
    const d = isCrit ? p.dmg * p.critMult : p.dmg;
    G.bl.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(a) * p.bsp,
      vy: Math.sin(a) * p.bsp,
      life: p.blife,
      dmg: d,
      r: 3 * view.SC,
      crit: isCrit,
    });
  }
  sfx.shoot();
}

export function hurt(onDeath) {
  if (G.p.ifr > 0) return;
  G.p.hp--;
  G.p.ifr = 1.2;
  G.shake = 10;
  G.combo = 1;
  G.comboT = 0;
  part(G.p.x, G.p.y, "#fff", 20, 180);
  const flash = document.getElementById("flash");
  flash.className = "flash";
  void flash.offsetWidth;
  flash.className = "flash hit";
  sfx.hurt();
  if (G.p.hp <= 0) {
    part(G.p.x, G.p.y, "#4dd0ff", 50, 250);
    sfx.death();
    setTimeout(onDeath, 600);
    G.state = "dying";
  }
}
