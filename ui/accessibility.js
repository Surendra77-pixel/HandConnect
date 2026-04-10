// ui/accessibility.js — Accessibility Mode (PRD v3.0 Enhanced #16)

(function () {

  let active = false;

  function setActive(val) { active = val; }
  function isActive() { return active; }

  function announce(text) {
    if (!active) return;
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1.2;
    window.speechSynthesis.speak(msg);
  }

  function applyStyles(ctx, W, H) {
    if (!active) return;
    
    // High Contrast Overlay
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, W, H);
    ctx.restore();
  }

  window.NeonAuraAccess = { setActive, isActive, announce, applyStyles };

})();
