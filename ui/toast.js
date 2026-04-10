// ui/toast.js — Gesture Toast Notification (PRD v2.0, Feature #4)

(function () {

  let toastEl = null;
  let timer   = null;

  function _ensureElement() {
    if (toastEl) return;
    toastEl = document.createElement('div');
    toastEl.id = 'gesture-toast';
    toastEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      background: rgba(0,0,0,0.75);
      border: 1px solid currentColor;
      border-radius: 50px;
      padding: 12px 32px;
      font-family: 'Orbitron', monospace;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #00ffff;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.25s ease;
      z-index: 9999;
      white-space: nowrap;
      backdrop-filter: blur(6px);
    `;
    document.body.appendChild(toastEl);
  }

  function show(message, color) {
    _ensureElement();
    toastEl.textContent     = message;
    toastEl.style.color     = color || '#00ffff';
    toastEl.style.borderColor = color || '#00ffff';
    toastEl.style.boxShadow = `0 0 20px ${color || '#00ffff'}88`;
    toastEl.style.opacity   = '1';
    toastEl.style.transform = 'translate(-50%, -50%) scale(1)';
    clearTimeout(timer);
    timer = setTimeout(() => {
      toastEl.style.opacity   = '0';
      toastEl.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }, 1500);
  }

  window.NeonAuraToast = { show };

})();
