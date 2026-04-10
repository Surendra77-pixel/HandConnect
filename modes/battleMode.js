// modes/battleMode.js — Gesture Battle (RPS) (PRD v3.0 Enhanced #7)

(function () {

  let active = false;
  let cooldown = 0;
  let p1Lock = null, p2Lock = null;
  let lockTime = 0;

  function setActive(val) { 
    active = val; 
    p1Lock = p2Lock = null;
  }
  function isActive() { return active; }

  function update(handsData) {
    if (!active || cooldown > 0) {
      if (cooldown > 0) cooldown--;
      return;
    }

    if (handsData.length === 2) {
      const g1 = handsData[0].gesture;
      const g2 = handsData[1].gesture;

      if (g1 !== 'None' && g2 !== 'None' && g1 !== 'Point' && g2 !== 'Point') {
        if (lockTime === 0) lockTime = Date.now();
        if (Date.now() - lockTime > 1500) { // Lock results after 1.5s
          determineWinner(g1, g2);
          cooldown = 180; // 3s pause
          lockTime = 0;
        }
      } else {
        lockTime = 0;
      }
    } else {
      lockTime = 0;
    }
  }

  function determineWinner(g1, g2) {
    const map = { Fist: 'ROCK', Open: 'PAPER', Peace: 'SCISSORS' };
    const r1 = map[g1], r2 = map[g2];
    
    if (!r1 || !r2) return;

    let res = "";
    if (r1 === r2) res = "🤝 TIE!";
    else if ((r1 === 'ROCK' && r2 === 'SCISSORS') || 
             (r1 === 'PAPER' && r2 === 'ROCK') || 
             (r1 === 'SCISSORS' && r2 === 'PAPER')) {
      res = "👈 LEFT PLAYER WINS!";
    } else {
      res = "👉 RIGHT PLAYER WINS!";
    }

    window.NeonAuraToast?.show(res, '#ff00ff');
    if (window.NeonAuraAudio?.playNote) window.NeonAuraAudio.playNote(523); // High C
  }

  function drawUI(ctx, W, H) {
    if (!active) return;
    if (lockTime > 0) {
        const elapsed = (Date.now() - lockTime);
        const pct = Math.min(1, elapsed / 1500);
        ctx.save();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(W/2, H/2, 50, -Math.PI/2, -Math.PI/2 + pct * Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
  }

  window.NeonAuraBattle = { setActive, isActive, update, drawUI };

})();
