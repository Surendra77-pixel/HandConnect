// effects/constellations.js — Constellation Mode (PRD v3.0 Enhanced #5)

(function () {

  let active = false;
  const stars = [];

  function init(W, H) {
    stars.length = 0;
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5,
        o: Math.random()
      });
    }
  }

  function setActive(val) { active = val; }
  function isActive() { return active; }

  function draw(ctx, handsData, theme, time, W, H) {
    if (!active) return;

    // 1. Deep Space Background
    ctx.save();
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, W, H);
    
    // Twinkling stars
    stars.forEach(s => {
      const p = 0.3 + 0.7 * Math.abs(Math.sin(time * 0.001 + s.x));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.o * p})`;
      ctx.fill();
    });
    ctx.restore();

    // 2. Hand Constellations
    handsData.forEach(hand => {
      const lm = hand.landmarks;
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 0.8;
      
      // Connect landmarks that are "close" to form a constellation
      for (let i = 0; i < lm.length; i++) {
        for (let j = i + 1; j < lm.length; j++) {
            const dx = (lm[i].x - lm[j].x), dy = (lm[i].y - lm[j].y);
            const d = Math.sqrt(dx*dx + dy*dy);
            if (d < 0.15) {
                ctx.beginPath();
                ctx.moveTo((1 - lm[i].x) * W, lm[i].y * H);
                ctx.lineTo((1 - lm[j].x) * W, lm[j].y * H);
                ctx.stroke();
            }
        }
      }

      // Draw Star Points at landmarks
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff';
      lm.forEach(pt => {
        ctx.beginPath();
        ctx.arc((1 - pt.x) * W, pt.y * H, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    });
  }

  window.NeonAuraConstellations = { init, setActive, isActive, draw };

})();
