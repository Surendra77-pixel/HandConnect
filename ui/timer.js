// ui/timer.js — Gesture-based Timer Control (PRD v3.0 Enhanced #13)

(function () {

  let duration = 0;
  let remaining = 0;
  let running = false;
  let lastUpdateTime = 0;

  function setMinutes(m) {
    duration = m * 60;
    remaining = duration;
    running = false;
  }

  function toggle() {
    running = !running;
    if (running) lastUpdateTime = Date.now();
  }

  function reset() {
    remaining = duration;
    running = false;
  }

  function update(time) {
    if (!running || remaining <= 0) return;
    
    const now = Date.now();
    const dt = (now - lastUpdateTime) / 1000;
    remaining -= dt;
    lastUpdateTime = now;

    if (remaining <= 0) {
      remaining = 0;
      running = false;
      window.NeonAuraToast?.show('⌛ TIMER FINISHED!', '#ff4444');
      if (window.NeonAuraAudio?.playNote) window.NeonAuraAudio.playNote(440);
    }
  }

  function draw(ctx, theme, W, H) {
    if (duration === 0) return;

    const pct = remaining / duration;
    const cx = W / 2, cy = 100;
    const color = pct > 0.2 ? theme.primary : '#ff4444';

    ctx.save();
    
    // Ring
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 45, -Math.PI/2, -Math.PI/2 + pct * Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.stroke();

    // Time Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Orbitron';
    ctx.textAlign = 'center';
    const m = Math.floor(remaining / 60);
    const s = Math.floor(remaining % 60);
    ctx.fillText(`${m}:${s.toString().padStart(2, '0')}`, cx, cy + 10);

    ctx.restore();
  }

  window.NeonAuraTimer = { setMinutes, toggle, reset, update, draw };

})();
