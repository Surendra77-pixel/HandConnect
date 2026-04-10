// effects/fire.js — Fire Hands Effect (PRD v3.0 Enhanced #6)

(function () {

  const particles = [];
  const MAX_PARTICLES = 150;
  let active = false;

  function setActive(val) { active = val; }
  function isActive() { return active; }

  function update(handsData, time, W, H) {
    if (!active) return;

    handsData.forEach(hand => {
      const spread = hand.spread;
      const tips = [4, 8, 12, 16, 20];

      tips.forEach(idx => {
        if (Math.random() > 0.4) {
          const lm = hand.landmarks[idx];
          particles.push({
            x: (1 - lm.x) * W,
            y: lm.y * H,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(Math.random() * 3 + 2),
            life: 1.0,
            size: 4 + Math.random() * 8 + (spread / 20),
            hue: 15 + Math.random() * 25 // 15-40: Orange-Red
          });
        }
      });
    });

    // Update & Prune
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx + Math.sin(time * 0.01 + i) * 0.5;
      p.y += p.vy;
      p.life -= 0.02;
      p.size *= 0.96;
      if (p.life <= 0 || particles.length > MAX_PARTICLES) {
        particles.splice(i, 1);
      }
    }
  }

  function draw(ctx, theme, W, H) {
    if (!active || particles.length === 0) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    
    particles.forEach(p => {
      ctx.globalAlpha = p.life * 0.8;
      const color = `hsl(${p.hue}, 100%, ${50 + p.life * 20}%)`;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${p.hue}, 100%, 40%)`;
      ctx.fill();
    });

    ctx.restore();
  }

  window.NeonAuraFire = { setActive, isActive, update, draw };

})();
