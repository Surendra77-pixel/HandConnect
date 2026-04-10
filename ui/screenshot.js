// ui/screenshot.js — Screenshot Capture & Gallery Support (PRD v2.0 + v3.0 #11)

(function () {

  function init() {
    // No specific initialization needed yet
  }

  function capture(videoEl, effectsCanvas, drawCanvas, W, H, callback) {
    const out    = document.createElement('canvas');
    out.width    = W;
    out.height   = H;
    const outCtx = out.getContext('2d');

    // Composite: video (mirrored) → drawing layer → effects layer
    outCtx.save();
    outCtx.translate(W, 0);
    outCtx.scale(-1, 1);
    if (videoEl && videoEl.readyState >= 2) {
      outCtx.drawImage(videoEl, 0, 0, W, H);
    }
    outCtx.restore();

    if (drawCanvas) outCtx.drawImage(drawCanvas, 0, 0, W, H);
    outCtx.drawImage(effectsCanvas, 0, 0, W, H);

    // Watermark
    outCtx.save();
    outCtx.fillStyle    = 'rgba(255,255,255,0.4)';
    outCtx.font         = '16px Orbitron, sans-serif';
    outCtx.textBaseline = 'bottom';
    outCtx.fillText('NEON AURA AR', 20, H - 16);
    outCtx.restore();

    const dataUrl = out.toDataURL('image/png');

    // Download
    const link      = document.createElement('a');
    link.download   = `neon-aura-${Date.now()}.png`;
    link.href       = dataUrl;
    link.click();

    // Trigger callback if provided (e.g. for Gallery)
    if (typeof callback === 'function') {
      callback(dataUrl);
    }

    // Screen flash
    const flash = document.getElementById('capture-flash');
    if (flash) {
      flash.style.opacity = '1';
      setTimeout(() => flash.style.opacity = '0', 200);
    }
  }

  window.NeonAuraScreenshot = { init, capture };

})();
