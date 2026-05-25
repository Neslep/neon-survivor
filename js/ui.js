import { G, resetState } from "./state.js";
import { sfx, isMuted, toggleMute as toggleMuteAudio } from "./audio.js";
import { newPlayer } from "./entities.js";

export function fmtTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

export function showWave(txt) {
  const el = document.getElementById("wave");
  el.textContent = txt;
  el.className = "wave-toast";
  void el.offsetWidth;
  el.className = "wave-toast show";
}

export function updateHighScore() {
  const best = parseFloat(localStorage.getItem("ns_best") || "0");
  document.getElementById("hBest").textContent =
    best > 0 ? fmtTime(best) : "0:00";
  document.getElementById("hsStart").textContent =
    best > 0 ? "🏆 BEST  " + fmtTime(best) : "";
}

export function startGame() {
  resetState();
  G.p = newPlayer();
  document.getElementById("mStart").classList.add("hidden");
  document.getElementById("btnPause").classList.add("show");
  document.getElementById("btnMute").classList.add("show");
  G.state = "playing";
  G.last = performance.now();
  showWave("TIER 1");
}

export function pauseGame() {
  if (G.state !== "playing") return;
  G.state = "paused";
  document.getElementById("mPause").classList.remove("hidden");
}

export function resumeGame() {
  G.state = "playing";
  document.getElementById("mPause").classList.add("hidden");
  G.last = performance.now();
}

export function quitGame() {
  document.getElementById("mPause").classList.add("hidden");
  document.getElementById("btnPause").classList.remove("show");
  document.getElementById("btnMute").classList.remove("show");
  G.state = "menu";
  updateHighScore();
  document.getElementById("mStart").classList.remove("hidden");
}

export function retryGame() {
  document.getElementById("mOver").classList.add("hidden");
  startGame();
}

export function over() {
  G.state = "gameover";
  const best = parseFloat(localStorage.getItem("ns_best") || "0");
  const bestK = parseInt(localStorage.getItem("ns_best_kills") || "0");
  let nb = false;
  let nbk = false;
  if (G.t > best) {
    localStorage.setItem("ns_best", G.t);
    nb = true;
  }
  if (G.kills > bestK) {
    localStorage.setItem("ns_best_kills", G.kills);
    nbk = true;
  }
  document.getElementById("finalStats").innerHTML = `
    <div>Sống sót: <span class="num">${fmtTime(G.t)}</span> ${nb ? '<span class="num gold">★ KỶ LỤC MỚI</span>' : ""}</div>
    <div>Số mạng diệt: <span class="num">${G.kills}</span> ${nbk ? '<span class="num gold">★</span>' : ""}</div>
    <div>Level đạt: <span class="num pink">${G.lvl}</span></div>
    <div>Combo cao nhất: <span class="num gold">×${G.comboMax}</span></div>
  `;
  document.getElementById("hsOver").textContent =
    "🏆 BEST  " + fmtTime(parseFloat(localStorage.getItem("ns_best") || "0"));
  document.getElementById("mOver").classList.remove("hidden");
  document.getElementById("btnPause").classList.remove("show");
}

export function toggleMute() {
  const muted = toggleMuteAudio();
  const btn = document.getElementById("btnMute");
  btn.textContent = muted ? "✕" : "♪";
  btn.classList.toggle("off", muted);
}

export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    (
      document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen
    )?.call(document.documentElement);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
  }
}

export function updateHud() {
  const p = G.p;
  document.getElementById("hTime").textContent = fmtTime(G.t);
  document.getElementById("hLvl").textContent = G.lvl;
  document.getElementById("hKills").textContent = G.kills;
  document.getElementById("hpFill").style.width =
    (p.hp / p.mhp) * 100 + "%";
  document.getElementById("xpFill").style.width =
    (G.xp / G.xpN) * 100 + "%";
  const co = document.getElementById("combo");
  if (G.combo > 2) {
    co.textContent = "COMBO ×" + G.combo;
    co.className = "combo show" + (G.combo >= 10 ? " big" : "");
  } else {
    co.className = "combo";
  }
}

export function wireButtons() {
  document.getElementById("btnStart").onclick = () => {
    sfx.click();
    startGame();
  };
  document.getElementById("btnPause").onclick = () => {
    sfx.click();
    pauseGame();
  };
  document.getElementById("btnResume").onclick = () => {
    sfx.click();
    resumeGame();
  };
  document.getElementById("btnQuit").onclick = () => {
    sfx.click();
    quitGame();
  };
  document.getElementById("btnRetry").onclick = () => {
    sfx.click();
    retryGame();
  };
  document.getElementById("btnMute").onclick = () => {
    sfx.click();
    toggleMute();
  };
  // Initial mute button state from persisted preference.
  if (isMuted()) {
    const btn = document.getElementById("btnMute");
    btn.textContent = "✕";
    btn.classList.add("off");
  }
}
