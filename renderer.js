// renderer.js — Canvas Visual Effects Engine (PRD v1.0 + v2.0)

(function () {

  const { themes, resolveColor } = window.NeonAuraThemes;
  const { getPalmCenter }        = window.NeonAuraGestures;

  // Hand skeleton connections (MediaPipe 21-landmark model)
  const CONNECTIONS = [
    [0,1],[1,2],[2,3],[3,4],        // thumb
    [0,5],[5,6],[6,7],[7,8],        // index
    [0,9],[9,10],[10,11],[11,12],   // middle
    [0,13],[13,14],[14,15],[15,16], // ring
    [0,17],[17,18],[18,19],[19,20], // pinky
    [5,9],[9,13],[13,17]            // palm knuckles
  ];
  const FINGERTIP_IDS = [4, 8, 12, 16, 20];

  // ─── SKELETON ────────────────────────────────────────────────────────────
  function drawSkeleton(ctx, landmarks, theme, time, W, H) {
    const color = resolveColor(theme.primary, time);
    ctx.save();
    ctx.lineWidth   = 4.5; // Thicker lines
    ctx.strokeStyle = color;
    ctx.shadowBlur  = 18;
    ctx.shadowColor = theme.glow;
    ctx.beginPath();
    for (const [a, b] of CONNECTIONS) {
      // Mirror X so it aligns with mirrored video
      ctx.moveTo((1 - landmarks[a].x) * W, landmarks[a].y * H);
      ctx.lineTo((1 - landmarks[b].x) * W, landmarks[b].y * H);
    }
    ctx.stroke();
    ctx.restore();
  }

  // ─── LANDMARK NODES ───────────────────────────────────────────────────────
  function drawNodes(ctx, landmarks, theme, time, W, H, pulse) {
    const color = resolveColor(theme.primary, time);

    // 1. Batch non-tip nodes (huge performance gain)
    ctx.save();
    ctx.fillStyle   = color;
    ctx.globalAlpha = 0.75;
    ctx.shadowBlur  = 10;
    ctx.shadowColor = theme.glow;
    ctx.beginPath();
    for (let i = 0; i < landmarks.length; i++) {
      if (FINGERTIP_IDS.includes(i) || i === 0) continue;
      const x = (1 - landmarks[i].x) * W, y = landmarks[i].y * H;
      ctx.moveTo(x + 3.5, y);
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();

    // 2. Draw fingertips (radial gradients) and wrist
    for (let i = 0; i < landmarks.length; i++) {
      const lm  = landmarks[i];
      const x   = (1 - lm.x) * W, y = lm.y * H;
      const tip = FINGERTIP_IDS.includes(i);
      
      if (tip) {
        ctx.save();
        ctx.shadowBlur  = 28;
        ctx.shadowColor = theme.glow;
        const r = 7 + Math.sin((pulse || 0) + i * 0.5) * 2;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0,   '#ffffff');
        g.addColorStop(0.4, color);
        g.addColorStop(1,   'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (i === 0) {
        // Wrist anchor
        ctx.save();
        ctx.shadowBlur  = 10;
        ctx.shadowColor = theme.glow;
        ctx.strokeStyle = color;
        ctx.lineWidth   = 2;
        ctx.fillStyle   = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }
  }

  // ─── AURA HALO ────────────────────────────────────────────────────────────
  function drawAuraHalo(ctx, landmarks, theme, time, W, H, spread) {
    const c      = getPalmCenter(landmarks);
    const cx     = (1 - c.x) * W, cy = c.y * H;
    const base   = 40 + spread * 1.2;
    const pulse  = Math.sin(time * 0.004) * 0.3 + 0.7;
    const radius = base * pulse;

    ctx.save();
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    g.addColorStop(0,   theme.glow + '55');
    g.addColorStop(0.5, theme.glow + '22');
    g.addColorStop(1,   'transparent');
    ctx.fillStyle   = g;
    ctx.globalAlpha = 0.6 + Math.sin(time * 0.003) * 0.2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = theme.glow;
    ctx.lineWidth   = 1.5;
    ctx.globalAlpha = 0.25 * pulse;
    ctx.shadowBlur  = 20;
    ctx.shadowColor = theme.glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ─── ENERGY BEAMS (when spread > 70%) ─────────────────────────────────────
  function drawEnergyBeams(ctx, landmarks, theme, time, W, H) {
    const flicker = 0.7 + Math.sin(time * 0.02) * 0.2 + Math.random() * 0.1; // Brighter baseline
    ctx.save();
    ctx.strokeStyle = theme.glow;
    ctx.lineWidth   = 4.0; // Thicker beams
    ctx.globalAlpha = flicker;
    ctx.shadowBlur  = 15;
    ctx.shadowColor = theme.glow;
    
    ctx.beginPath();
    for (let a = 0; a < FINGERTIP_IDS.length; a++) {
      for (let b = a + 1; b < FINGERTIP_IDS.length; b++) {
        const la = landmarks[FINGERTIP_IDS[a]], lb = landmarks[FINGERTIP_IDS[b]];
        ctx.moveTo((1 - la.x) * W, la.y * H);
        ctx.lineTo((1 - lb.x) * W, lb.y * H);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  // ─── PARTICLE TRAIL EMITTER ───────────────────────────────────────────────
  function emitTrails(landmarks, theme, W, H, spread, time) {
    const count = 1 + Math.floor(spread / 30);
    for (const tipId of FINGERTIP_IDS) {
      for (let i = 0; i < count; i++) {
        if (Math.random() > 0.5) {
          const lm    = landmarks[tipId];
          const color = resolveColor(theme.particle, time);
          const col   = typeof color === 'function' ? color() : color;
          window.NeonAuraParticles.spawn((1 - lm.x) * W, lm.y * H, col);
        }
      }
    }
  }

  // ─── BACKGROUND PULSE ─────────────────────────────────────────────────────
  function drawBackgroundPulse(ctx, theme, W, H, time, handsCount) {
    if (!handsCount || !theme.background) return;
    const p = (Math.sin(time * 0.002) + 1) * 0.5;
    ctx.save();
    ctx.fillStyle   = theme.background;
    ctx.globalAlpha = p * 0.5;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // ─── FIST EXPLOSION ───────────────────────────────────────────────────────
  let prevGestures  = {};
  let fistCooldown  = 0;
  function handleFistExplosion(landmarks, gesture, handIdx, theme, W, H, time) {
    if (gesture === 'Fist' && prevGestures[handIdx] !== 'Fist' && fistCooldown <= 0) {
      const c     = getPalmCenter(landmarks);
      const color = resolveColor(theme.particle, time);
      const col   = typeof color === 'function' ? color() : color;
      window.NeonAuraParticles.spawnBurst((1 - c.x) * W, c.y * H, col, 40, 3);
      fistCooldown = 20;
    }
    prevGestures[handIdx] = gesture;
    if (fistCooldown > 0) fistCooldown--;
  }

  // ─── MAIN RENDER FRAME ────────────────────────────────────────────────────
  function renderFrame(ctx, videoEl, handsData, themeName, time, stats, W, H, mirrorMode) {
    const theme = themes[themeName] || themes.cyberpunk;
    const pulse = time * 0.005;

    // 1. CLEAR canvas
    ctx.clearRect(0, 0, W, H);

    // 2. SHADOW PUPPETS (PRD v3.0 #1)
    if (window.NeonAuraPuppets?.isActive()) {
      window.NeonAuraPuppets.draw(ctx, handsData, theme, W, H);
      return; 
    }

    // 5. BEAT DETECTION
    window.NeonAuraBeat?.update();

    // 5.2 TIME WARP ECHOES (PRD v3.0 #15)
    window.NeonAuraTimeWarp?.drawEchoes(ctx, handsData, theme, W, H);

    // 5. CAMERA FEED with "Object-Fit: Cover" logic
    if (videoEl && videoEl.readyState >= 2 && !window.NeonAuraConstellations?.isActive()) {
      ctx.save();
      // Mirroring
      ctx.translate(W, 0); ctx.scale(-1, 1);
      
      const vW = videoEl.videoWidth;
      const vH = videoEl.videoHeight;
      const vRatio = vW / vH;
      const cRatio = W / H;
      
      let dW, dH, dX, dY;
      if (vRatio > cRatio) {
        // Video is wider than canvas
        dW = H * vRatio;
        dH = H;
        dX = (W - dW) / 2;
        dY = 0;
      } else {
        // Video is taller than canvas
        dW = W;
        dH = W / vRatio;
        dX = 0;
        dY = (H - dH) / 2;
      }
      
      // Since we mirrored with translate(W,0) and scale(-1,1), we need to adjust dX
      // Actually, it's easier to draw at 0,0 and let the transform handle it, 
      // but we need to center the 'cover' crop.
      ctx.drawImage(videoEl, dX, dY, dW, dH);
      ctx.restore();
    }

    // 5.5 WEATHER (PRD v3.0 #12)
    if (window.NeonAuraWeather?.isActive()) {
      window.NeonAuraWeather.update(handsData, W, H);
      window.NeonAuraWeather.draw(ctx, theme, W, H);
    }

    // 6. KALEIDOSCOPE LOOP...
    // ...

    const kaleidoActive = window._kaleidoscopeActive || false;
    const segments = window._kaleidoSegments || 6;
    let distPct = null;
    
    if (kaleidoActive) {
      const cx = W / 2, cy = H / 2;
      const angleStep = (Math.PI * 2) / segments;
      for (let i = 0; i < segments; i++) {
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(angleStep * i);
        if (i % 2 === 1) ctx.scale(1, -1);
        ctx.translate(-cx, -cy);
        const d = drawFrameContent(ctx, handsData, theme, time, stats, W, H, mirrorMode, pulse);
        if (d !== null) distPct = d;
        ctx.restore();
      }
    } else {
      distPct = drawFrameContent(ctx, handsData, theme, time, stats, W, H, mirrorMode, pulse);
    }

    // 7. TOP-LEVEL OVERLAYS (Not rotated)
    window.NeonAuraPiano?.draw(ctx, theme, W, H);
    if (window.NeonAuraTimer) {
      window.NeonAuraTimer.update(time);
      window.NeonAuraTimer.draw(ctx, theme, W, H);
    }
    window.NeonAuraHUD?.draw(ctx, { ...stats, dist: distPct }, theme, W, H);

    // 12. ACCESSIBILITY OVERLAY (PRD v3.0 #16)
    window.NeonAuraAccess?.applyStyles(ctx, W, H);
  }

  function drawFrameContent(ctx, handsData, theme, time, stats, W, H, mirrorMode, pulse) {
    const beatInt = window.NeonAuraBeat?.getIntensity() || 0;

    // Draw Mode
    if (window.NeonAuraDrawMode?.isActive()) {
      window.NeonAuraDrawMode.compositeAndFade(ctx, W, H);
    }

    // Background Pulse
    drawBackgroundPulse(ctx, theme, W, H, time, handsData.length);

    // Per-Hand Effects
    for (let hi = 0; hi < handsData.length; hi++) {
      const { landmarks, gesture, spread } = handsData[hi];

      drawSkeleton(ctx, landmarks, theme, time, W, H);
      drawNodes(ctx, landmarks, theme, time, W, H, pulse);
      drawAuraHalo(ctx, landmarks, theme, time, W, H, spread * (1 + beatInt));
      emitTrails(landmarks, theme, W, H, spread, time);
      if (spread > 70) drawEnergyBeams(ctx, landmarks, theme, W, H);
      handleFistExplosion(landmarks, gesture, hi, theme, W, H, time);

      if (mirrorMode && window.NeonAuraMirror) {
        window.NeonAuraMirror.draw(ctx, landmarks, theme, time, W, H);
      }
    }

    // Inter-hand
    let calculatedDist = null;
    if (handsData.length === 2 && window.NeonAuraInterHand) {
      calculatedDist = window.NeonAuraInterHand.draw(
        ctx, handsData[0].landmarks, handsData[1].landmarks, theme, time, W, H, stats.velocity
      );
    }

    // UI & Advanced Effects
    window.NeonAuraMultiplayer?.drawUI(ctx, W, H);
    window.NeonAuraSpatial?.draw(ctx, theme, time, W, H);
    window.NeonAuraSpells?.draw(ctx, theme, time, W, H);

    // Battle, Drums, ASL (PRD v3.0 #7, #8, #10)
    if (window.NeonAuraBattle?.isActive()) {
      window.NeonAuraBattle.update(handsData);
      window.NeonAuraBattle.drawUI(ctx, W, H);
    }
    if (window.NeonAuraDrums?.isActive()) {
      window.NeonAuraDrums.update(handsData, W, H);
      window.NeonAuraDrums.draw(ctx, W, H);
    }
    if (window.NeonAuraASL?.isActive()) {
      window.NeonAuraASL.update(handsData);
      window.NeonAuraASL.drawUI(ctx, W, H);
    }

    if (window.NeonAuraFire) {
      window.NeonAuraFire.update(handsData, time, W, H);
      window.NeonAuraFire.draw(ctx, theme, W, H);
    }

    window.NeonAuraAR?.draw(ctx, handsData, theme, time, W, H);

    // Physics
    window.NeonAuraRipple?.update(ctx);
    window.NeonAuraParticles.update(ctx);

    // Gallery Overlay (PRD v3.0 #11)
    window.NeonAuraGallery?.draw(ctx, W, H);

    return calculatedDist;
  }

  // Expose raw draw helpers for mirror.js
  window.NeonAuraRenderer = { renderFrame, drawSkeleton, drawNodes };

})();
