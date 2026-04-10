// modes/drumMode.js — Virtual Drums (PRD v3.0 Enhanced #8)

(function () {

  let active = false;
  const pads = [
    { x: 0.25, y: 0.8, r: 60, hue: 0,   note: 100, label: 'KICK' },
    { x: 0.50, y: 0.8, r: 60, hue: 200, note: 250, label: 'SNARE' },
    { x: 0.75, y: 0.8, r: 60, hue: 300, note: 600, label: 'HI-HAT' }
  ];

  const padState = [0, 0, 0];

  function setActive(val) { active = val; }
  function isActive() { return active; }

  function update(handsData, W, H) {
    if (!active) return;

    for (let i = 0; i < padState.length; i++) {
        if (padState[i] > 0) padState[i] -= 0.1;
    }

    handsData.forEach(hand => {
      const indexTip = hand.landmarks[8];
      const tx = (1 - indexTip.x) * W, ty = indexTip.y * H;

      pads.forEach((pad, i) => {
        const px = pad.x * W, py = pad.y * H;
        const d = Math.sqrt((tx-px)**2 + (ty-py)**2);
        
        if (d < pad.r) {
          if (padState[i] <= 0) {
            padState[i] = 1.0;
            // Play sound
            if (window.NeonAuraAudio?.playNote) {
                window.NeonAuraAudio.playNote(pad.note);
            }
            // Burst particles
            window.NeonAuraParticles?.spawnBurst(px, py, `hsl(${pad.hue},100%,70%)`, 10);
          }
        }
      });
    });
  }

  function draw(ctx, W, H) {
    if (!active) return;

    pads.forEach((pad, i) => {
      const px = pad.x * W, py = pad.y * H;
      const s = padState[i];
      
      ctx.save();
      ctx.shadowBlur = 15 + s * 20;
      ctx.shadowColor = `hsl(${pad.hue},100%,50%)`;
      ctx.strokeStyle = `hsla(${pad.hue},100%,70%,${0.3 + s * 0.7})`;
      ctx.lineWidth = 4 + s * 4;
      ctx.fillStyle = `hsla(${pad.hue},100%,30%,0.2)`;
      
      ctx.beginPath();
      ctx.arc(px, py, pad.r + s * 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Space Mono';
      ctx.textAlign = 'center';
      ctx.fillText(pad.label, px, py + 5);
      ctx.restore();
    });
  }

  window.NeonAuraDrums = { setActive, isActive, update, draw };

})();
