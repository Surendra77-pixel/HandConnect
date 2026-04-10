// effects/mirror.js — Mirror Mode Ghost Hand (PRD v2.0, Feature #10)

(function () {

  function draw(ctx, landmarks, theme, time, W, H) {
    const { drawSkeleton, drawNodes } = window.NeonAuraRenderer;
    const mirrored = landmarks.map(lm => ({ x: 1 - lm.x, y: lm.y, z: lm.z || 0 }));
    ctx.save();
    ctx.globalAlpha = 0.35;
    drawSkeleton(ctx, mirrored, theme, time, W, H);
    drawNodes(ctx, mirrored, theme, time, W, H, time * 0.005);
    ctx.restore();
  }

  window.NeonAuraMirror = { draw };

})();
