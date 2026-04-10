// ui/hud.js — Live Stats HUD (PRD v1.0 + v2.0)

(function () {

  function draw(ctx, stats, theme, W, H) {
    const {
      handsDetected = 0,
      fps           = 0,
      gesture       = 'None',
      spread        = 0,
      dist          = null,
      mode          = 'NORMAL'
    } = stats;

    const barH  = 36;
    const barY  = H - barH;
    const pad   = 14;

    // Background pill
    ctx.save();
    ctx.fillStyle   = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(pad, barY - 4, W - pad * 2, barH, 8);
    ctx.fill();

    // Neon border
    ctx.strokeStyle = theme.glow + '66';
    ctx.lineWidth   = 1;
    ctx.shadowBlur  = 10;
    ctx.shadowColor = theme.glow;
    ctx.stroke();
    ctx.restore();

    // Text
    const parts = [
      `Hands: ${handsDetected}`,
      `FPS: ${fps}`,
      `Gesture: ${gesture}`,
      `Spread: ${spread}%`,
      dist != null ? `Dist: ${dist}%` : null,
      `Mode: ${mode}`
    ].filter(Boolean);

    const textY = barY + barH / 2 + 5;
    const cx    = W / 2;

    ctx.save();
    ctx.font        = '13px Space Mono, monospace';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    
    let baseColor = theme.hudColor || theme.primary;
    if (typeof baseColor === 'function' || (typeof baseColor === 'string' && baseColor.startsWith('#'))) {
        baseColor = window.NeonAuraThemes.resolveColor(baseColor, Date.now());
    }
    
    ctx.fillStyle   = baseColor;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = theme.glow;
    ctx.fillText(parts.join('   │   '), cx, textY);
    ctx.restore();
  }

  window.NeonAuraHUD = { draw };

})();
