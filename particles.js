// particles.js — Particle Pool System (PRD v2.0)

(function () {

  const POOL_SIZE = 500;
  const pool = Array.from({ length: POOL_SIZE }, () => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0,
    r: 0, alpha: 0, color: '#fff', life: 0, maxLife: 0
  }));

  // ── Init ──────────────────────────────────────────────────────────────────
  function init(count) {
    // Optional: could resize pool here
  }

  // ── Get a free particle from the pool ──────────────────────────────────────
  function getParticle() {
    for (let i = 0; i < pool.length; i++) {
      if (!pool[i].active) return pool[i];
    }
    return pool[0]; // recycle oldest if pool full
  }

  // ── Spawn a single particle at (x, y) ─────────────────────────────────────
  function spawn(x, y, color, options = {}) {
    const p     = getParticle();
    const angle = options.angle !== undefined ? options.angle : Math.random() * Math.PI * 2;
    const speed = options.speed !== undefined ? options.speed : 0.5 + Math.random() * 2;

    p.active  = true;
    p.x       = x;
    p.y       = y;
    p.vx      = Math.cos(angle) * speed;
    p.vy      = Math.sin(angle) * speed - (options.upBias || 0.5);
    p.r       = options.r || (2 + Math.random() * 3);
    p.alpha   = 1;
    p.color   = typeof color === 'function' ? color() : color;
    p.maxLife = options.life || (40 + Math.random() * 40);
    p.life    = p.maxLife;
  }

  // ── Spawn a burst of particles (e.g. fist explosion) ──────────────────────
  function spawnBurst(cx, cy, color, count, speed) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const spd   = speed * (0.5 + Math.random());
      spawn(cx, cy, color, { angle, speed: spd, life: 50, upBias: 0 });
    }
  }

  // ── Update & draw all particles ────────────────────────────────────────────
  function update(ctx) {
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (!p.active) continue;

      p.life--;
      if (p.life <= 0) { p.active = false; continue; }

      p.x      += p.vx;
      p.y      += p.vy;
      p.vy     += 0.03;             // gravity
      p.r      *= 0.97;             // shrink
      p.alpha   = p.life / p.maxLife;

      ctx.save();
      ctx.globalAlpha  = p.alpha;
      ctx.fillStyle    = p.color;
      ctx.shadowBlur   = 8;
      ctx.shadowColor  = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.r), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  window.NeonAuraParticles = { init, spawn, spawnBurst, update };

})();
