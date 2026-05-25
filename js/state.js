// Mutable global game state shared across modules.
export const G = {
  state: "menu",
  t: 0,
  kills: 0,
  lvl: 1,
  xp: 0,
  xpN: 5,
  combo: 1,
  comboT: 0,
  comboMax: 1,
  shake: 0,
  p: null,
  en: [],
  bl: [],
  gm: [],
  pt: [],
  eb: [],
  dmg: [],
  sp: 0,
  boss: null,
  bossT: 30,
  keys: {},
  joy: null,
  joyA: null,
  lastTier: 0,
  stars: [],
  last: 0,
};

// Canvas / viewport dimensions. Mutated by canvas.fit().
export const view = {
  W: 0,
  H: 0,
  DPR: 1,
  SC: 1,
  cv: null,
  cx: null,
};

// Enemy archetype config.
export const ET = {
  basic: { hp: 1, sp: 42, r: 8, col: "#ff3860", xp: 1 },
  fast: { hp: 1, sp: 88, r: 6, col: "#ffcc44", xp: 1 },
  tank: { hp: 6, sp: 24, r: 14, col: "#a855f7", xp: 3 },
  shooter: { hp: 2, sp: 32, r: 9, col: "#00e5ff", xp: 2, si: 2.0 },
  swarm: { hp: 1, sp: 55, r: 5, col: "#ff8844", xp: 1 },
};

// Upgrade pool — each card applied to player on level up.
export const UPS = [
  { ic: "+", n: "POWER", d: "+1 sát thương", r: "C", fn: (p) => (p.dmg += 1) },
  { ic: "»", n: "RAPID", d: "+22% tốc bắn", r: "C", fn: (p) => (p.fr *= 0.82) },
  {
    ic: "※",
    n: "MULTI",
    d: "+1 đạn / phát",
    r: "R",
    fn: (p) => {
      p.proj += 1;
      p.bspread = Math.max(0.09, p.bspread);
    },
  },
  { ic: "→", n: "SWIFT", d: "+18% tốc chạy", r: "C", fn: (p) => (p.sp *= 1.18) },
  {
    ic: "↗",
    n: "VELOCITY",
    d: "+25% tốc đạn",
    r: "C",
    fn: (p) => (p.bsp *= 1.25),
  },
  {
    ic: "◎",
    n: "MAGNET",
    d: "+45% bán kính hút",
    r: "C",
    fn: (p) => (p.pr *= 1.45),
  },
  {
    ic: "♥",
    n: "VITALITY",
    d: "+1 max HP, hồi 2",
    r: "R",
    fn: (p) => {
      p.mhp += 1;
      p.hp = Math.min(p.mhp, p.hp + 2);
    },
  },
  {
    ic: "+",
    n: "HEAL",
    d: "Hồi 60% HP",
    r: "C",
    fn: (p) => {
      p.hp = Math.min(p.mhp, p.hp + Math.ceil(p.mhp * 0.6));
    },
  },
  { ic: "∞", n: "RANGE", d: "+30% tầm đạn", r: "C", fn: (p) => (p.blife *= 1.3) },
  {
    ic: "★",
    n: "CRIT",
    d: "+8% tỉ lệ chí mạng",
    r: "R",
    fn: (p) => (p.crit += 0.08),
  },
  {
    ic: "✦",
    n: "IMPACT",
    d: "+50% sát thương crit",
    r: "R",
    fn: (p) => (p.critMult += 0.5),
  },
  {
    ic: "⊕",
    n: "OVERLOAD",
    d: "+2 đạn, -10% sát thương",
    r: "E",
    fn: (p) => {
      p.proj += 2;
      p.dmg = Math.max(1, Math.floor(p.dmg * 0.9));
    },
  },
  {
    ic: "☆",
    n: "BERSERK",
    d: "+40% tốc bắn, -1 max HP",
    r: "E",
    fn: (p) => {
      p.fr *= 0.6;
      p.mhp = Math.max(1, p.mhp - 1);
      p.hp = Math.min(p.mhp, p.hp);
    },
  },
];

export function resetState() {
  G.t = 0;
  G.kills = 0;
  G.lvl = 1;
  G.xp = 0;
  G.xpN = 5;
  G.combo = 1;
  G.comboT = 0;
  G.comboMax = 1;
  G.shake = 0;
  G.en = [];
  G.bl = [];
  G.gm = [];
  G.pt = [];
  G.eb = [];
  G.dmg = [];
  G.sp = 0;
  G.boss = null;
  G.bossT = 30;
  G.lastTier = 0;
}
