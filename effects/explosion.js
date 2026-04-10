// effects/explosion.js — Velocity Explosion Effect (PRD v2.0, Feature #3)

(function () {

  const HISTORY_SIZE = 5;
  const historyMap   = { 0: [], 1: [] }; // per hand index

  function calculateVelocity(landmarks, handIdx, W, H) {
    const hist  = historyMap[handIdx] || [];
    const wrist = landmarks[0];

    hist.push({ x: wrist.x * W, y: wrist.y * H, t: Date.now() });
    if (hist.length > HISTORY_SIZE) hist.shift();
    historyMap[handIdx] = hist;

    if (hist.length < 2) return 0;
    const oldest = hist[0], newest = hist[hist.length - 1];
    const dt = (newest.t - oldest.t) / 1000 || 0.001;
    return Math.hypot(newest.x - oldest.x, newest.y - oldest.y) / dt;
  }

  function checkAndExplode(landmarks, handIdx, cx, cy, velocity, theme) {
    if (velocity < 300) return;
    const { resolveColor } = window.NeonAuraThemes;
    const color = resolveColor(theme.particle, Date.now());
    const col   = typeof color === 'function' ? color() : color;
    const count = Math.min(80, Math.round(velocity / 10));
    window.NeonAuraParticles.spawnBurst(cx, cy, col, count, velocity / 200);
  }

  function resetHistory(handIdx) {
    historyMap[handIdx] = [];
  }

  window.NeonAuraExplosion = { calculateVelocity, checkAndExplode, resetHistory };

})();
