import { G, view } from "./state.js";
import { sfx } from "./audio.js";
import { spawnE, spawnBoss, damage } from "./entities.js";
import { shoot, hurt } from "./combat.js";
import { showLvlUp } from "./upgrades.js";
import { showWave, over, updateHud } from "./ui.js";

function readInputVector() {
  let dx = 0;
  let dy = 0;
  if (G.keys["w"] || G.keys["arrowup"]) dy -= 1;
  if (G.keys["s"] || G.keys["arrowdown"]) dy += 1;
  if (G.keys["a"] || G.keys["arrowleft"]) dx -= 1;
  if (G.keys["d"] || G.keys["arrowright"]) dx += 1;
  if (G.joyA && G.joy) {
    const jdx = G.joy.x - G.joyA.x;
    const jdy = G.joy.y - G.joyA.y;
    const jd = Math.hypot(jdx, jdy);
    if (jd > 8) {
      const mag = Math.min(jd, 70) / 70;
      dx = (jdx / jd) * mag;
      dy = (jdy / jd) * mag;
    }
  }
  const m = Math.hypot(dx, dy);
  if (m > 1) {
    dx /= m;
    dy /= m;
  }
  return { dx, dy };
}

function updateEnemies(p, dt) {
  for (const e of G.en) {
    const ex = e.x - p.x;
    const ey = e.y - p.y;
    const ed = Math.hypot(ex, ey) || 1;
    e.x -= (ex / ed) * e.sp * dt;
    e.y -= (ey / ed) * e.sp * dt;
    if (e.flash > 0) e.flash -= dt;
    if (e.tp === "shooter") {
      e.st -= dt;
      if (e.st <= 0) {
        e.st = e.si;
        const a = Math.atan2(p.y - e.y, p.x - e.x);
        G.eb.push({
          x: e.x,
          y: e.y,
          vx: Math.cos(a) * 150 * view.SC,
          vy: Math.sin(a) * 150 * view.SC,
          life: 3.5,
          r: 4 * view.SC,
        });
      }
    }
    if (ed < p.r + e.r) hurt(over);
  }
  if (G.boss) {
    const e = G.boss;
    const ex = e.x - p.x;
    const ey = e.y - p.y;
    const ed = Math.hypot(ex, ey) || 1;
    e.x -= (ex / ed) * e.sp * dt;
    e.y -= (ey / ed) * e.sp * dt;
    if (e.flash > 0) e.flash -= dt;
    e.st -= dt;
    if (e.st <= 0) {
      e.st = e.si;
      const tA = Math.atan2(p.y - e.y, p.x - e.x);
      const n = 6 + e.tier;
      for (let i = 0; i < n; i++) {
        const a = tA + (i - (n - 1) / 2) * 0.22;
        G.eb.push({
          x: e.x,
          y: e.y,
          vx: Math.cos(a) * 140 * view.SC,
          vy: Math.sin(a) * 140 * view.SC,
          life: 4,
          r: 5 * view.SC,
          boss: 1,
        });
      }
    }
    if (ed < p.r + e.r) hurt(over);
  }
}

function updateBullets(dt) {
  for (let i = G.bl.length - 1; i >= 0; i--) {
    const b = G.bl[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (
      b.life <= 0 ||
      b.x < -30 ||
      b.x > view.W + 30 ||
      b.y < -30 ||
      b.y > view.H + 30
    ) {
      G.bl.splice(i, 1);
      continue;
    }
    let hit = false;
    for (const e of G.en) {
      if (Math.hypot(b.x - e.x, b.y - e.y) < e.r + b.r) {
        damage(e, b.dmg, b.crit);
        G.bl.splice(i, 1);
        hit = true;
        break;
      }
    }
    if (hit) continue;
    if (
      G.boss &&
      Math.hypot(b.x - G.boss.x, b.y - G.boss.y) < G.boss.r + b.r
    ) {
      damage(G.boss, b.dmg, b.crit);
      G.bl.splice(i, 1);
    }
  }

  for (let i = G.eb.length - 1; i >= 0; i--) {
    const b = G.eb[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (b.life <= 0) {
      G.eb.splice(i, 1);
      continue;
    }
    if (Math.hypot(b.x - G.p.x, b.y - G.p.y) < G.p.r + b.r) {
      hurt(over);
      G.eb.splice(i, 1);
    }
  }
}

function updateGems(p, dt) {
  for (let i = G.gm.length - 1; i >= 0; i--) {
    const g = G.gm[i];
    const gx = p.x - g.x;
    const gy = p.y - g.y;
    const gd = Math.hypot(gx, gy) || 1;
    if (gd < p.pr) {
      g.vx += (gx / gd) * 1100 * dt;
      g.vy += (gy / gd) * 1100 * dt;
    }
    g.vx *= 0.92;
    g.vy *= 0.92;
    g.x += g.vx * dt;
    g.y += g.vy * dt;
    g.life -= dt;
    if (gd < p.r + g.r + 4) {
      G.xp += g.xp;
      G.gm.splice(i, 1);
      sfx.pickup();
      while (G.xp >= G.xpN) {
        G.xp -= G.xpN;
        G.lvl++;
        G.xpN = Math.floor(G.xpN * 1.5 + 3);
        showLvlUp();
        return true;
      }
    }
  }
  return false;
}

export function update(dt) {
  const p = G.p;
  G.t += dt;
  G.bossT -= dt;

  const curTier = Math.floor(G.t / 30);
  if (curTier > G.lastTier && curTier > 0) {
    G.lastTier = curTier;
    showWave("TIER " + (curTier + 1));
  }

  const { dx, dy } = readInputVector();
  p.x += dx * p.sp * dt;
  p.y += dy * p.sp * dt;
  p.x = Math.max(p.r, Math.min(view.W - p.r, p.x));
  p.y = Math.max(p.r, Math.min(view.H - p.r, p.y));
  if (p.ifr > 0) p.ifr -= dt;

  if (Math.hypot(dx, dy) > 0.1 && Math.random() < 0.5) {
    G.pt.push({
      x: p.x + (Math.random() - 0.5) * p.r,
      y: p.y + (Math.random() - 0.5) * p.r,
      vx: 0,
      vy: 0,
      life: 0.4,
      t: 0,
      col: "#4dd0ff",
      r: 1 + Math.random() * 2,
    });
  }

  p.ft -= dt;
  if (p.ft <= 0) {
    shoot();
    p.ft = p.fr;
  }

  // Spawning — denser on larger screens, ramps up over time.
  G.sp -= dt;
  const areaF = Math.sqrt((view.W * view.H) / (900 * 700));
  const baseRate = Math.max(0.1, 0.55 - G.t * 0.012);
  const rate = baseRate / areaF;
  if (G.sp <= 0) {
    G.en.push(spawnE());
    G.sp = rate;
  }

  if (G.bossT <= 0 && !G.boss) {
    G.boss = spawnBoss();
    G.bossT = 45;
    showWave("☠ BOSS ☠");
    sfx.boss();
  }

  if (G.comboT > 0) {
    G.comboT -= dt;
    if (G.comboT <= 0) G.combo = 1;
  }
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 30);

  updateEnemies(p, dt);
  updateBullets(dt);
  if (updateGems(p, dt)) return;

  for (let i = G.pt.length - 1; i >= 0; i--) {
    const q = G.pt[i];
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.vx *= 0.92;
    q.vy *= 0.92;
    q.t += dt;
    if (q.t >= q.life) G.pt.splice(i, 1);
  }
  for (let i = G.dmg.length - 1; i >= 0; i--) {
    const d = G.dmg[i];
    d.y -= 36 * dt;
    d.t += dt;
    if (d.t >= d.life) G.dmg.splice(i, 1);
  }
  for (const s of G.stars) {
    s.t += dt * s.sp;
  }

  updateHud();
}
