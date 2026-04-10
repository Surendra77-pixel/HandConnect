// modes/pianoMode.js — Finger Piano Mode (PRD v2.0, Feature #1)

(function () {

  const NOTE_FREQUENCIES = {
    4:   261.63,  // C4 — Left Thumb
    8:   293.66,  // D4 — Left Index
    12:  329.63,  // E4 — Left Middle
    16:  349.23,  // F4 — Left Ring
    20:  392.00,  // G4 — Left Pinky
    104: 523.25,  // C5 — Right Thumb
    108: 587.33,  // D5 — Right Index
    112: 659.25,  // E5 — Right Middle
    116: 698.46,  // F5 — Right Ring
    120: 784.00,  // G5 — Right Pinky
  };

  const NOTE_NAMES = {
    4:'C4', 8:'D4', 12:'E4', 16:'F4', 20:'G4',
    104:'C5', 108:'D5', 112:'E5', 116:'F5', 120:'G5'
  };

  let active       = false;
  let triggerY     = 0.65;   // trigger line at 65% down the screen
  let lastAbove    = {};     // track which fingers were above trigger last frame
  let noteFlashes  = [];     // { name, x, y, alpha }

  function setActive(val) {
    active = val;
    if (!val) { lastAbove = {}; noteFlashes = []; }
  }

  function isActive() { return active; }

  function processHands(handsData, W, H) {
    if (!active) return;

    const trigPx = triggerY * H;
    const tips   = [4, 8, 12, 16, 20];

    handsData.forEach((hand, handOffset) => {
      const { landmarks } = hand;
      tips.forEach((tipIdx, fi) => {
        const key    = handOffset * 100 + tipIdx;
        const noteId = fi === 0 && handOffset === 0 ? 4 :
                       fi === 1 && handOffset === 0 ? 8 :
                       fi === 2 && handOffset === 0 ? 12 :
                       fi === 3 && handOffset === 0 ? 16 :
                       fi === 4 && handOffset === 0 ? 20 :
                       fi === 0 && handOffset === 1 ? 104 :
                       fi === 1 && handOffset === 1 ? 108 :
                       fi === 2 && handOffset === 1 ? 112 :
                       fi === 3 && handOffset === 1 ? 116 : 120;

        const lm     = landmarks[tipIdx];
        // Mirror x
        const px     = (1 - lm.x) * W;
        const py     = lm.y * H;
        const above  = py < trigPx;

        // Finger crossed trigger line from above → play note
        if (!above && lastAbove[key]) {
          window.NeonAuraAudio.playNote(NOTE_FREQUENCIES[noteId]);
          noteFlashes.push({ name: NOTE_NAMES[noteId], x: px, y: trigPx, alpha: 1 });
        }
        lastAbove[key] = above;
      });
    });
  }

  function draw(ctx, theme, W, H) {
    if (!active) return;

    const trigPx = triggerY * H;

    // Draw trigger line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, trigPx); ctx.lineTo(W, trigPx);
    ctx.strokeStyle = theme.secondary;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([10, 8]);
    ctx.shadowBlur  = 10;
    ctx.shadowColor = theme.glow;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Label
    ctx.save();
    ctx.fillStyle   = theme.primary;
    ctx.globalAlpha = 0.6;
    ctx.font        = '12px Space Mono, monospace';
    ctx.textAlign   = 'left';
    ctx.fillText('🎹 PIANO TRIGGER', 12, trigPx - 8);
    ctx.restore();

    // Note flashes
    for (let i = noteFlashes.length - 1; i >= 0; i--) {
      const f = noteFlashes[i];
      f.alpha -= 0.03;
      if (f.alpha <= 0) { noteFlashes.splice(i, 1); continue; }

      ctx.save();
      ctx.fillStyle   = theme.glow;
      ctx.globalAlpha = f.alpha;
      ctx.font        = 'bold 22px Orbitron, monospace';
      ctx.textAlign   = 'center';
      ctx.shadowBlur  = 20;
      ctx.shadowColor = theme.glow;
      ctx.fillText(f.name, f.x, f.y - 20 * (1 - f.alpha));
      ctx.restore();
    }
  }

  window.NeonAuraPiano = { setActive, isActive, processHands, draw };

})();
