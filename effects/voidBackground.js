// effects/voidBackground.js — The Digital Void 3D Environment (v3.0 Phase 1)

(function () {

  let isActive = false;
  let scrollY  = 0;

  function setEnabled(val) {
    isActive = !!val;
  }

  function draw(ctx, theme, velocity, time, W, H) {
    if (!isActive) return;

    // 1. Draw Deep Space Background
    const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W);
    bgGrad.addColorStop(0, '#0a0a1a');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Draw 3D Perspective Grid
    ctx.save();
    ctx.strokeStyle = theme.glow;
    ctx.lineWidth   = 1;
    ctx.globalAlpha = 0.2;
    ctx.shadowBlur  = 10;
    ctx.shadowColor = theme.glow;

    const horizon = H * 0.45;
    const lines   = 20;
    const spacing = W / lines;
    
    // Dynamic tilt based on velocity
    const tilt = Math.min(20, (velocity || 0) / 50);
    
    // Vertical Perspective Lines
    for (let i = 0; i <= lines; i++) {
      const x = i * spacing;
      ctx.beginPath();
      ctx.moveTo(W/2 + (x - W/2) * 0.1, horizon);
      ctx.lineTo(x + tilt * 2, H);
      ctx.stroke();
    }

    // Horizontal Scanning Lines
    scrollY = (scrollY + 2 + (velocity / 100)) % spacing;
    for (let j = 0; j < 15; j++) {
      const yPos = horizon + Math.pow(j / 15, 2) * (H - horizon) + scrollY;
      if (yPos > H) continue;
      
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(W, yPos);
      ctx.stroke();
    }

    ctx.restore();
  }

  window.NeonAuraVoid = { draw, setEnabled, isActive: () => isActive };

})();
