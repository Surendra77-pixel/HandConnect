// modes/aslTrainer.js — ASL Alphabet Trainer (PRD v3.0 Enhanced #10)

(function () {

  let active = false;
  const alphabet = [
    { letter: 'A', gesture: 'Fist' },
    { letter: 'B', gesture: 'Open' },
    { letter: 'V', gesture: 'Peace' },
    { letter: 'D', gesture: 'Point' },
    { letter: 'Y', gesture: 'ThumbsUp' }
  ];
  let targetIdx = 0;
  let score = 0;
  let matchStartTime = 0;

  function setActive(val) { 
    active = val; 
    targetIdx = 0;
    score = 0;
  }
  function isActive() { return active; }

  function update(handsData) {
    if (!active || handsData.length === 0) return;
    
    const target = alphabet[targetIdx];
    const hand = handsData[0];

    if (hand.gesture === target.gesture) {
      if (matchStartTime === 0) matchStartTime = Date.now();
      if (Date.now() - matchStartTime > 1200) {
        score++;
        targetIdx = (targetIdx + 1) % alphabet.length;
        matchStartTime = 0;
        window.NeonAuraToast?.show(`✅ Correct! Next: ${alphabet[targetIdx].letter}`, '#00ff00');
        if (window.NeonAuraAudio?.playNote) window.NeonAuraAudio.playNote(880);
      }
    } else {
      matchStartTime = 0;
    }
  }

  function drawUI(ctx, W, H) {
    if (!active) return;
    
    const target = alphabet[targetIdx];

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.roundRect(W - 220, 150, 200, 150, 20);
    ctx.fill();

    ctx.fillStyle = '#ff88ff';
    ctx.font = 'bold 14px Space Mono';
    ctx.fillText('ASL TRAINER', W - 210, 180);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(target.letter, W - 120, 250);

    if (matchStartTime > 0) {
        const pct = Math.min(1, (Date.now() - matchStartTime) / 1200);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(W - 120, 230, 60, -Math.PI/2, -Math.PI/2 + pct * Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
  }

  window.NeonAuraASL = { setActive, isActive, update, drawUI };

})();
