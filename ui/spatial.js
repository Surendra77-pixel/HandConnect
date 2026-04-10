// ui/spatial.js — Holographic Poke Interface (Phase 3)

(function () {

  const buttons = [];
  const POKE_THRESHOLD = 0.05; // 5% of screen duration/distance for a poke
  const HOVER_DURATION = 800;  // ms to trigger

  function init() {
    // Create some default holographic buttons
    buttons.push({
      id: 'theme_next',
      label: 'NEXT THEME',
      x: 0.1, y: 0.2, w: 0.15, h: 0.1,
      lastHoverTime: 0,
      active: false,
      color: '#00ffff'
    });
    buttons.push({
      id: 'clear_draw',
      label: 'CLEAR DRAW',
      x: 0.1, y: 0.35, w: 0.15, h: 0.1,
      lastHoverTime: 0,
      active: false,
      color: '#ffdd00'
    });
  }

  function update(handsData, time, W, H, onAction) {
    buttons.forEach(btn => {
      let isHovered = false;
      
      handsData.forEach(hand => {
        const finger = hand.landmarks[8]; // Index tip
        // Mirror finger X because canvas is mirrored
        const fx = 1 - finger.x;
        const fy = finger.y;

        if (fx > btn.x && fx < btn.x + btn.w && fy > btn.y && fy < btn.y + btn.h) {
          isHovered = true;
        }
      });

      if (isHovered) {
        if (btn.lastHoverTime === 0) btn.lastHoverTime = time;
        const progress = (time - btn.lastHoverTime) / HOVER_DURATION;
        if (progress >= 1) {
          if (!btn.active) {
            btn.active = true;
            if (onAction) onAction(btn.id);
          }
        }
      } else {
        btn.lastHoverTime = 0;
        btn.active = false;
      }
    });
  }

  function draw(ctx, theme, time, W, H) {
    buttons.forEach(btn => {
      const bx = btn.x * W;
      const by = btn.y * H;
      const bw = btn.w * W;
      const bh = btn.h * H;

      const progress = btn.lastHoverTime > 0 ? Math.min(1, (time - btn.lastHoverTime) / HOVER_DURATION) : 0;

      ctx.save();
      
      // Outer border
      ctx.strokeStyle = btn.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = btn.color;
      ctx.strokeRect(bx, by, bw, bh);

      // Loading fill
      if (progress > 0) {
        ctx.fillStyle = btn.color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(bx, by, bw * progress, bh);
      }

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.9;
      ctx.font = 'bold 12px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(btn.label, bx + bw/2, by + bh/2 + 5);

      // Simple glitch effect if active
      if (btn.active) {
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(bx - 2, by - 2, bw + 4, bh + 4);
      }

      ctx.restore();
    });
  }

  window.NeonAuraSpatial = { init, update, draw };

})();
