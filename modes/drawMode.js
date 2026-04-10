// modes/drawMode.js — Finger Painting Draw Mode (PRD v2.0, Feature #2)

(function () {

  let drawCanvas  = null;
  let drawCtx     = null;
  let active      = false;
  let lastPoint   = null;
  let brushSizes  = [2, 4, 8];
  let brushIdx    = 0;

  function init(W, H) {
    if (drawCanvas) return;
    drawCanvas        = document.createElement('canvas');
    drawCanvas.width  = W;
    drawCanvas.height = H;
    drawCtx           = drawCanvas.getContext('2d');
  }

  function resize(W, H) {
    if (!drawCanvas) return;
    // Preserve existing drawing on resize
    const tmp     = document.createElement('canvas');
    tmp.width = W; tmp.height = H;
    tmp.getContext('2d').drawImage(drawCanvas, 0, 0, W, H);
    drawCanvas.width  = W;
    drawCanvas.height = H;
    drawCtx.drawImage(tmp, 0, 0);
  }

  function setActive(val) {
    active = val;
    if (!val) lastPoint = null;
  }

  function isActive() { return active; }

  // Called every frame with the index fingertip landmark
  function handleFrame(indexTip, gesture, theme, W, H) {
    if (!active || !drawCtx) return;

    // Fade canvas slowly (neon graffiti wall effect)
    drawCtx.fillStyle = 'rgba(0,0,0,0.008)';
    drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

    if (gesture === 'Fist') {
      lastPoint = null;   // lift pen
      return;
    }
    if (gesture === 'Peace') {
      drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      lastPoint = null;
      return;
    }

    // Draw with index finger (Point gesture or any active gesture)
    if (gesture === 'Point' || gesture === 'None') {
      // Mirror the x-coordinate since canvas is mirrored
      const x = (1 - indexTip.x) * W;
      const y =  indexTip.y      * H;

      if (lastPoint) {
        drawCtx.save();
        drawCtx.beginPath();
        drawCtx.moveTo(lastPoint.x, lastPoint.y);
        drawCtx.lineTo(x, y);
        const color = window.NeonAuraThemes.resolveColor(theme.primary, Date.now());
        drawCtx.strokeStyle = typeof color === 'function' ? color() : color;
        drawCtx.lineWidth   = brushSizes[brushIdx];
        drawCtx.lineCap     = 'round';
        drawCtx.shadowBlur  = 15;
        drawCtx.shadowColor = theme.glow;
        drawCtx.stroke();
        drawCtx.restore();
      }
      lastPoint = { x, y };
    } else {
      lastPoint = null;
    }
  }

  function cycleBrush() {
    brushIdx = (brushIdx + 1) % brushSizes.length;
    return brushSizes[brushIdx];
  }

  function compositeAndFade(ctx, W, H) {
    if (!drawCanvas) return;
    ctx.save();
    ctx.drawImage(drawCanvas, 0, 0, W, H);
    ctx.restore();
  }

  function clear() {
    if (!drawCtx) return;
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  }

  function getCanvas() { return drawCanvas; }

  window.NeonAuraDrawMode = {
    init, resize, setActive, isActive,
    handleFrame, cycleBrush, clear,
    compositeAndFade, getCanvas
  };

})();
