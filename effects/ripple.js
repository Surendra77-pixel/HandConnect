// effects/ripple.js — Ripple Wave Effect (PRD v2.0, Feature #6)

(function () {

  const ripples = [];

  function spawn(x, y, color, glowColor) {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        ripples.push({
          x, y,
          radius:    5 + i * 8,
          maxRadius: 150,
          opacity:   1,
          color:     color,
          glow:      glowColor || color,
          speed:     3 + i * 0.5
        });
      }, i * 80);
    }
  }

  function spawnTripleRipple(x, y, color, glow) {
    spawn(x, y, color, glow);
  }

  function update(ctx) {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r   = ripples[i];
      r.radius += r.speed;
      r.opacity = 1 - r.radius / r.maxRadius;
      if (r.opacity <= 0) { ripples.splice(i, 1); continue; }

      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = r.opacity;
      ctx.lineWidth   = 2;
      ctx.shadowBlur  = 12;
      ctx.shadowColor = r.glow;
      ctx.stroke();
      ctx.restore();
    }
  }

  window.NeonAuraRipple = { spawn, spawnTripleRipple, update };

})();
