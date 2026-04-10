// effects/interHand.js — Two-Hand Connection Effects (PRD v2.0 Bug Fix #1)

(function () {

  // ── Wrist-to-wrist gradient beam ─────────────────────────────────────────
  function drawInterHandBeam(ctx, lm1, lm2, theme, time, W, H) {
    const x1 = lm1[0].x * W, y1 = lm1[0].y * H;
    const x2 = lm2[0].x * W, y2 = lm2[0].y * H;
    const pulse = 0.4 + 0.4 * Math.sin(time * 0.005);

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0,   theme.primary);
    grad.addColorStop(0.5, theme.secondary);
    grad.addColorStop(1,   theme.primary);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 8; // Thicker wrist beam
    ctx.globalAlpha = 0.8 + 0.2 * Math.sin(time * 0.005); // Brighter baseline
    ctx.shadowBlur  = 20;
    ctx.shadowColor = theme.glow;
    ctx.stroke();
    ctx.restore();
  }

  // ── Straight Neon Laser Fingertip Connections ─────────────────────────────
  function drawFingerLasers(ctx, lm1, lm2, theme, time, W, H) {
    const tips = [4, 8, 12, 16, 20];
    
    ctx.save();
    ctx.lineCap     = 'round';
    ctx.lineWidth   = 6; // Very thick per user request
    ctx.shadowBlur  = 15;
    ctx.shadowColor = theme.glow;
    
    tips.forEach((idx, i) => {
      const x1 = lm1[idx].x * W, y1 = lm1[idx].y * H;
      const x2 = lm2[idx].x * W, y2 = lm2[idx].y * H;
      
      // Individual bright gradients for each laser beam
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, theme.primary);
      grad.addColorStop(1, '#ffffff');

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.85 + 0.15 * Math.sin(time * 0.01 + i); // Continuous glow
      ctx.stroke();
    });
    
    ctx.restore();
  }

  // ── MORPHING 3D GEOMETRY (Phase 2: Geometric Evolution) ──────────────────
  let currentMorph = 0; // 0=Cube, 1=Diamond, 2=Star

  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawMidpointShape(ctx, lm1, lm2, theme, time, W, H, velocity) {
    const w1 = lm1[0], w2 = lm2[0];
    const midX = ((w1.x + w2.x) / 2) * W;
    const midY = ((w1.y + w2.y) / 2) * H;
    const dist = Math.hypot((w2.x - w1.x) * W, (w2.y - w1.y) * H);

    // 1. Determine target morph based on velocity
    let targetMorph = 0;
    if (velocity > 600) targetMorph = 2;      // Star
    else if (velocity > 200) targetMorph = 1; // Diamond
    
    // Smooth transition between morph states
    currentMorph = lerp(currentMorph, targetMorph, 0.1);

    const size = Math.max(20, 160 - dist * 0.3);
    const rot  = time * 0.002;

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(rot);

    // Draw the shape based on current morphed percentage
    // For simplicity, we interpolate the "pointiness" and vertex count visuals
    ctx.beginPath();
    
    const segments = 4 + Math.floor(currentMorph * 4); // Morph from 4 to 12 points
    const innerR   = size * (1 - currentMorph * 0.4);
    
    for (let i = 0; i <= segments * 2; i++) {
      const angle = (i * Math.PI) / segments;
      const r = (i % 2 === 0) ? size : innerR;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.5, theme.primary);
    g.addColorStop(1, 'transparent');

    ctx.fillStyle   = g;
    ctx.shadowBlur  = 40 + (currentMorph * 20);
    ctx.shadowColor = theme.glow;
    ctx.globalAlpha = 0.8;
    ctx.fill();

    // Sharp wireframe
    ctx.lineWidth   = 1.5 + currentMorph;
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 1.0;
    ctx.stroke();

    // 3D Cross-axes that spin faster with velocity
    ctx.rotate(time * 0.005 * (1 + currentMorph));
    ctx.beginPath();
    ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
    ctx.moveTo(0, -size); ctx.lineTo(0, size);
    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
    return dist;
  }

  // ── Distance ruler label ──────────────────────────────────────────────────
  function drawDistanceMeter(ctx, lm1, lm2, theme, W, H) {
    const x1 = lm1[0].x * W, y1 = lm1[0].y * H;
    const x2 = lm2[0].x * W, y2 = lm2[0].y * H;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const pct  = Math.round((dist / W) * 100);

    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = theme.secondary;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth   = 1;
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle   = theme.primary;
    ctx.globalAlpha = 0.9;
    ctx.font        = '13px Space Mono, monospace';
    ctx.textAlign   = 'center';
    ctx.fillText(`${pct}%`, (x1 + x2) / 2, (y1 + y2) / 2 - 16);
    ctx.restore();

    return pct;
  }

  // ── Portal vortex (when hands < 100 px apart) ─────────────────────────────
  function drawPortal(ctx, lm1, lm2, theme, time, W, H) {
    const w1 = lm1[0], w2 = lm2[0];
    const midX = ((w1.x + w2.x) / 2) * W;
    const midY = ((w1.y + w2.y) / 2) * H;
    const dist = Math.hypot((w2.x - w1.x) * W, (w2.y - w1.y) * H);
    if (dist > 100) return;

    const intensity = 1 - dist / 100;
    const radius    = 60 * intensity;
    const rings     = 5;

    for (let i = rings; i >= 1; i--) {
      const r    = (radius * i) / rings;
      const rot  = time * 0.003 * (i % 2 === 0 ? 1 : -1);
      const opa  = intensity * (i / rings) * 0.6;
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = theme.primary;
      ctx.globalAlpha = opa;
      ctx.lineWidth   = 2;
      ctx.shadowBlur  = 5; // optimized
      ctx.shadowColor = theme.glow;
      ctx.stroke();
      ctx.restore();
    }

    const cg = ctx.createRadialGradient(midX, midY, 0, midX, midY, radius * 0.5);
    cg.addColorStop(0, theme.glow);
    cg.addColorStop(1, 'transparent');
    ctx.save();
    ctx.globalAlpha = intensity * 0.8;
    ctx.fillStyle   = cg;
    ctx.beginPath();
    ctx.arc(midX, midY, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Master entry point ─────────────────────────────────────────────────────
  function draw(ctx, lm1, lm2, theme, time, W, H, velocity) {
    // Resolve dynamic colors for safe usage down the line
    const safeTheme = {
      ...theme,
      primary: window.NeonAuraThemes.resolveColor(theme.primary, time),
      secondary: window.NeonAuraThemes.resolveColor(theme.secondary, time),
      glow: window.NeonAuraThemes.resolveColor(theme.glow, time)
    };

    // Mirror X coordinates for all 2-hand effects to align with mirrored camera feed
    const mlm1 = lm1.map(l => ({ ...l, x: 1 - l.x }));
    const mlm2 = lm2.map(l => ({ ...l, x: 1 - l.x }));

    drawInterHandBeam(ctx, mlm1, mlm2, safeTheme, time, W, H);
    drawFingerLasers(ctx, mlm1, mlm2, safeTheme, time, W, H);
    // const dist = drawMidpointShape(ctx, mlm1, mlm2, safeTheme, time, W, H, velocity);
    const pct  = drawDistanceMeter(ctx, mlm1, mlm2, safeTheme, W, H);
    drawPortal(ctx, mlm1, mlm2, safeTheme, time, W, H);
    return pct;
  }

  window.NeonAuraInterHand = { draw };

})();
