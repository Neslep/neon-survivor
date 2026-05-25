// Audio context lazily created on first beep; reusing one context across all SFX.
let ac = null;
let muted = localStorage.getItem("ns_mute") === "1";

function ctx() {
  if (!ac) {
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
  }
  return ac;
}

function beep(freq, dur, type = "square", vol = 0.04, slide = 0) {
  if (muted) return;
  const c = ctx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  if (slide)
    o.frequency.exponentialRampToValueAtTime(
      Math.max(40, freq + slide),
      c.currentTime + dur,
    );
  g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur);
}

export const sfx = {
  shoot: () => beep(720 + Math.random() * 80, 0.04, "square", 0.012, -200),
  hit: () => beep(220, 0.06, "sawtooth", 0.025, -100),
  kill: () => beep(540, 0.08, "triangle", 0.03, -120),
  pickup: () => beep(1200, 0.04, "sine", 0.025, 400),
  lvl: () => {
    beep(523, 0.08, "square", 0.05);
    setTimeout(() => beep(659, 0.08, "square", 0.05), 70);
    setTimeout(() => beep(784, 0.16, "square", 0.05), 140);
  },
  hurt: () => beep(140, 0.25, "sawtooth", 0.07, -50),
  death: () => beep(110, 1.0, "sawtooth", 0.08, -80),
  boss: () => {
    beep(80, 0.4, "sawtooth", 0.09);
    setTimeout(() => beep(70, 0.5, "sawtooth", 0.09), 150);
  },
  click: () => beep(900, 0.03, "square", 0.015),
};

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  localStorage.setItem("ns_mute", muted ? "1" : "0");
  return muted;
}
