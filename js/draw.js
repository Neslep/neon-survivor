import { G, view } from "./state.js";

function drawBackground(cx) {
  cx.fillStyle = "#07070f";
  cx.fillRect(0, 0, view.W, view.H);

  for (const s of G.stars) {
    cx.fillStyle = `rgba(180, 200, 255, ${s.a * (0.7 + 0.3 * Math.sin(s.t))})`;
    cx.fillRect(s.x, s.y, s.r, s.r);
  }

  cx.strokeStyle = "rgba(77,208,255,0.045)";
  cx.lineWidth = 1;
  const gs = 50;
  for (let x = 0; x < view.W; x += gs) {
    cx.beginPath();
    cx.moveTo(x, 0);
    cx.lineTo(x, view.H);
    cx.stroke();
  }
  for (let y = 0; y < view.H; y += gs) {
    cx.beginPath();
    cx.moveTo(0, y);
    cx.lineTo(view.W, y);
    cx.stroke();
  }
}

function drawParticles(cx) {
  for (const q of G.pt) {
    const a = 1 - q.t / q.life;
    cx.globalAlpha = a;
    cx.fillStyle = q.col;
    cx.beginPath();
    cx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
    cx.fill();
  }
  cx.globalAlpha = 1;
}

function drawGems(cx) {
  for (const g of G.gm) {
    const pulse = 0.7 + 0.3 * Math.sin(performance.now() * 0.008 + g.x);
    cx.fillStyle = "#4dd0ff";
    cx.shadowColor = "#4dd0ff";
    cx.shadowBlur = 14 * pulse;
    cx.beginPath();
    cx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
    cx.fill();
    cx.shadowBlur = 0;
  }
}

function drawEnemies(cx) {
  for (const e of G.en) {
    const col = e.flash > 0 ? "#fff" : e.col;
    cx.fillStyle = col;
    cx.shadowColor = e.col;
    cx.shadowBlur = 14;
    cx.beginPath();
    cx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    cx.fill();
    cx.shadowBlur = 0;
    if (e.hp < e.mhp) {
      cx.fillStyle = "rgba(0,0,0,0.55)";
      cx.fillRect(e.x - e.r, e.y - e.r - 7, e.r * 2, 2.5);
      cx.fillStyle = "#ff3860";
      cx.fillRect(e.x - e.r, e.y - e.r - 7, e.r * 2 * (e.hp / e.mhp), 2.5);
    }
  }
}

function drawBoss(cx) {
  if (!G.boss) return;
  const e = G.boss;
  const col = e.flash > 0 ? "#fff" : e.col;
  cx.fillStyle = col;
  cx.shadowColor = e.col;
  cx.shadowBlur = 28;
  cx.beginPath();
  cx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
  cx.fill();
  cx.shadowBlur = 0;
  cx.strokeStyle = "#fff";
  cx.lineWidth = 2;
  cx.stroke();
  const pulse = 1 + 0.05 * Math.sin(performance.now() * 0.005);
  cx.strokeStyle = "rgba(255,0,170,0.4)";
  cx.lineWidth = 2;
  cx.beginPath();
  cx.arc(e.x, e.y, e.r * 1.5 * pulse, 0, Math.PI * 2);
  cx.stroke();
  // Boss HP bar across the top.
  const bw = Math.min(view.W * 0.6, 360);
  const bx = (view.W - bw) / 2;
  cx.fillStyle = "rgba(0,0,0,0.7)";
  cx.fillRect(bx - 2, 18, bw + 4, 8);
  cx.fillStyle = "#ff00aa";
  cx.shadowColor = "#ff00aa";
  cx.shadowBlur = 8;
  cx.fillRect(bx, 20, bw * (e.hp / e.mhp), 4);
  cx.shadowBlur = 0;
  cx.font = "11px 'Press Start 2P', monospace";
  cx.fillStyle = "#ff00aa";
  cx.textAlign = "center";
  cx.fillText("TIER " + e.tier + " BOSS", view.W / 2, 14);
  cx.textAlign = "left";
}

function drawBullets(cx) {
  for (const b of G.bl) {
    cx.fillStyle = b.crit ? "#ffcc44" : "#4dd0ff";
    cx.shadowColor = cx.fillStyle;
    cx.shadowBlur = b.crit ? 14 : 10;
    cx.beginPath();
    cx.arc(b.x, b.y, b.r * (b.crit ? 1.4 : 1), 0, Math.PI * 2);
    cx.fill();
    cx.shadowBlur = 0;
  }
  for (const b of G.eb) {
    cx.fillStyle = b.boss ? "#ff00aa" : "#ff8844";
    cx.shadowColor = cx.fillStyle;
    cx.shadowBlur = 10;
    cx.beginPath();
    cx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    cx.fill();
    cx.shadowBlur = 0;
  }
}

function drawPlayer(cx) {
  const p = G.p;
  if (!p || G.state === "menu") return;
  const blink = p.ifr > 0 && Math.floor(p.ifr * 20) % 2 === 0;
  if (blink) return;
  cx.strokeStyle = "rgba(77,208,255,0.12)";
  cx.lineWidth = 1;
  cx.beginPath();
  cx.arc(p.x, p.y, p.pr, 0, Math.PI * 2);
  cx.stroke();
  cx.fillStyle = "#fff";
  cx.shadowColor = "#4dd0ff";
  cx.shadowBlur = 22;
  cx.beginPath();
  cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  cx.fill();
  cx.shadowBlur = 0;
  cx.fillStyle = "#4dd0ff";
  cx.beginPath();
  cx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
  cx.fill();
}

function drawDmgNums(cx) {
  for (const d of G.dmg) {
    const a = 1 - d.t / d.life;
    cx.globalAlpha = a;
    cx.font = (d.crit ? "bold 18px" : "13px") + " 'VT323', monospace";
    cx.fillStyle = d.crit ? "#ffcc44" : "#fff";
    cx.textAlign = "center";
    cx.fillText(d.crit ? d.v + "!" : d.v, d.x, d.y);
    cx.textAlign = "left";
  }
  cx.globalAlpha = 1;
}

function drawJoystick(cx) {
  if (!(G.joyA && G.joy && G.state === "playing")) return;
  cx.strokeStyle = "rgba(255,255,255,0.18)";
  cx.lineWidth = 2;
  cx.beginPath();
  cx.arc(G.joyA.x, G.joyA.y, 70, 0, Math.PI * 2);
  cx.stroke();
  const jdx = G.joy.x - G.joyA.x;
  const jdy = G.joy.y - G.joyA.y;
  const jd = Math.min(Math.hypot(jdx, jdy), 70);
  const ja = Math.atan2(jdy, jdx);
  cx.fillStyle = "rgba(77,208,255,0.45)";
  cx.shadowColor = "#4dd0ff";
  cx.shadowBlur = 10;
  cx.beginPath();
  cx.arc(
    G.joyA.x + Math.cos(ja) * jd,
    G.joyA.y + Math.sin(ja) * jd,
    26,
    0,
    Math.PI * 2,
  );
  cx.fill();
  cx.shadowBlur = 0;
}

export function draw() {
  const cx = view.cx;
  cx.save();
  if (G.shake > 0)
    cx.translate(
      (Math.random() - 0.5) * G.shake,
      (Math.random() - 0.5) * G.shake,
    );
  drawBackground(cx);
  drawParticles(cx);
  drawGems(cx);
  drawEnemies(cx);
  drawBoss(cx);
  drawBullets(cx);
  drawPlayer(cx);
  drawDmgNums(cx);
  drawJoystick(cx);
  cx.restore();
}
