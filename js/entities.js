import { G, view, ET } from "./state.js";
import { sfx } from "./audio.js";

export function newPlayer() {
  return {
    x: view.W / 2,
    y: view.H / 2,
    r: 10 * view.SC,
    hp: 5,
    mhp: 5,
    sp: 170 * view.SC,
    fr: 0.42,
    ft: 0,
    dmg: 1,
    proj: 1,
    bsp: 340 * view.SC,
    blife: 0.9,
    bspread: 0.13,
    pr: 60 * view.SC,
    ifr: 0,
    crit: 0.05,
    critMult: 2.5,
  };
}

function spawnAt() {
  const s = Math.floor(Math.random() * 4);
  const m = 30;
  if (s === 0) return { x: -m, y: Math.random() * view.H };
  if (s === 1) return { x: view.W + m, y: Math.random() * view.H };
  if (s === 2) return { x: Math.random() * view.W, y: -m };
  return { x: Math.random() * view.W, y: view.H + m };
}

export function spawnE() {
  const t = G.t;
  const r = Math.random();
  let tp = "basic";
  if (t > 75 && r < 0.18) tp = "shooter";
  else if (t > 50 && r < 0.27) tp = "tank";
  else if (t > 25 && r < 0.4) tp = "fast";
  else if (t > 10 && r < 0.2) tp = "swarm";
  const cfg = ET[tp];
  const pos = spawnAt();
  const e = {
    x: pos.x,
    y: pos.y,
    tp,
    hp: cfg.hp,
    mhp: cfg.hp,
    sp: cfg.sp * view.SC,
    r: cfg.r * view.SC,
    col: cfg.col,
    xp: cfg.xp,
    flash: 0,
    st: tp === "shooter" ? cfg.si * Math.random() : 0,
    si: cfg.si || 0,
  };
  if (tp === "swarm") {
    const extras = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < extras; i++) {
      G.en.push({
        x: pos.x + (Math.random() - 0.5) * 40,
        y: pos.y + (Math.random() - 0.5) * 40,
        tp: "swarm",
        hp: 1,
        mhp: 1,
        sp: cfg.sp * view.SC,
        r: cfg.r * view.SC,
        col: cfg.col,
        xp: cfg.xp,
        flash: 0,
        st: 0,
        si: 0,
      });
    }
  }
  return e;
}

export function spawnBoss() {
  const tier = Math.floor(G.t / 45) + 1;
  const pos = spawnAt();
  const hp = 35 + tier * 22;
  return {
    x: pos.x,
    y: pos.y,
    tp: "boss",
    boss: true,
    hp,
    mhp: hp,
    sp: 36 * view.SC,
    r: 30 * view.SC,
    col: "#ff00aa",
    xp: 30 + tier * 5,
    flash: 0,
    st: 1.0,
    si: 1.3,
    phase: 0,
    tier,
  };
}

export function part(x, y, col, n, sp) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = sp * (0.4 + Math.random() * 0.9);
    G.pt.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      life: 0.4 + Math.random() * 0.4,
      t: 0,
      col,
      r: 1 + Math.random() * 2.5,
    });
  }
}

export function dmgNum(x, y, v, crit = false) {
  G.dmg.push({
    x: x + (Math.random() - 0.5) * 16,
    y: y - 10,
    v,
    crit,
    life: 0.7,
    t: 0,
  });
}

export function damage(e, d, crit) {
  e.hp -= d;
  e.flash = 0.12;
  part(e.x, e.y, e.col, crit ? 7 : 3, 100);
  dmgNum(e.x, e.y, d, crit);
  if (e.hp <= 0) {
    if (e.boss) {
      G.boss = null;
      G.kills += 10;
      part(e.x, e.y, e.col, 60, 240);
      part(e.x, e.y, "#fff", 25, 200);
      G.shake = 14;
      sfx.kill();
      setTimeout(sfx.boss, 50);
      for (let k = 0; k < 6; k++) {
        G.gm.push({
          x: e.x + (Math.random() - 0.5) * 44,
          y: e.y + (Math.random() - 0.5) * 44,
          r: 5 * view.SC,
          xp: Math.ceil(e.xp / 6),
          vx: (Math.random() - 0.5) * 60,
          vy: (Math.random() - 0.5) * 60,
          life: 25,
        });
      }
    } else {
      const i = G.en.indexOf(e);
      if (i >= 0) G.en.splice(i, 1);
      G.kills++;
      part(e.x, e.y, e.col, 12, 150);
      G.gm.push({
        x: e.x,
        y: e.y,
        r: 4 * view.SC,
        xp: e.xp,
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 40,
        life: 18,
      });
      G.combo++;
      G.comboT = 1.8;
      if (G.combo > G.comboMax) G.comboMax = G.combo;
      G.shake = Math.max(G.shake, 1.5);
      sfx.kill();
    }
  }
}
