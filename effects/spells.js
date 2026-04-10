// effects/spells.js — Gesture-based Combat System (Phase 4)

(function () {

  let shockwaves = [];
  const SHOCKWAVE_DIST = 100; // px
  const SHOCKWAVE_COOLDOWN = 1000;
  let lastShockwaveTime = 0;

  function update(handsData, time, W, H) {
    // 1. SHOCKWAVE: Two Fists Bang
    if (handsData.length === 2 && (time - lastShockwaveTime > SHOCKWAVE_COOLDOWN)) {
      const g1 = handsData[0].gesture, g2 = handsData[1].gesture;
      if (g1 === 'Fist' && g2 === 'Fist') {
        const p1 = window.NeonAuraGestures.getPalmCenter(handsData[0].landmarks);
        const p2 = window.NeonAuraGestures.getPalmCenter(handsData[1].landmarks);
        const dist = Math.hypot((p1.x - p2.x) * W, (p1.y - p2.y) * H);
        
        if (dist < SHOCKWAVE_DIST) {
          triggerShockwave(((p1.x + p2.x) / 2), ((p1.y + p2.y) / 2), W, H, time);
        }
      }
    }

    // Update existing shockwaves
    shockwaves = shockwaves.filter(s => {
      s.age += 16;
      return s.age < s.duration;
    });
  }

  function triggerShockwave(nx, ny, W, H, time) {
    lastShockwaveTime = time;
    // Mirror x for screen position
    const rx = (1 - nx) * W;
    const ry = ny * H;

    shockwaves.push({ x: rx, y: ry, age: 0, duration: 800 });
    
    // Visual burst
    window.NeonAuraParticles?.spawnBurst(rx, ry, '#ffffff', 60, 5);
    window.NeonAuraRipple?.spawnTripleRipple(rx, ry, '#ffffff', '#00ffff');
    
    // Audio trigger
    if (window.NeonAuraAudio?.playNote) {
      window.NeonAuraAudio.playNote(110); // Low bass bang
    }
  }

  function draw(ctx, theme, time, W, H) {
    shockwaves.forEach(s => {
      const progress = s.age / s.duration;
      const radius = progress * W * 0.5;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 10 * (1 - progress);
      ctx.globalAlpha = 0.6 * (1 - progress);
      ctx.shadowBlur = 30;
      ctx.shadowColor = theme.glow;
      ctx.stroke();
      
      // Secondary chromatic ring
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 5 * (1 - progress);
      ctx.stroke();
      
      ctx.restore();
    });
  }

  window.NeonAuraSpells = { update, draw };

})();
