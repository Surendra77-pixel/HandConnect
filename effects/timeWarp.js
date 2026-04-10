// effects/timeWarp.js — Slow-Motion / Time Warp (PRD v3.0 Enhanced #15)

(function () {

  let active = false;
  let factor = 1.0;
  const history = [];

  function setActive(val) { 
    active = val; 
    factor = active ? 0.3 : 1.0;
  }
  function isActive() { return active; }

  // Draw ghostly "echoes" of the hands from previous frames
  function drawEchoes(ctx, handsData, theme, W, H) {
    if (!active) return;

    // Capture current state
    if (handsData.length > 0) {
        history.unshift(JSON.parse(JSON.stringify(handsData)));
        if (history.length > 15) history.pop();
    }

    ctx.save();
    history.forEach((data, i) => {
        const opacity = (1 - i / history.length) * 0.3;
        ctx.globalAlpha = opacity;
        data.forEach(hand => {
            window.NeonAuraRenderer.drawSkeleton(ctx, hand.landmarks, theme, Date.now(), W, H);
        });
    });
    ctx.restore();
  }

  window.NeonAuraTimeWarp = { setActive, isActive, drawEchoes, getFactor: () => factor };

})();
