// ui/multiplayer.js — Split-screen Multiplayer Mode (PRD v3.0 Enhanced #2)

(function () {

  let active = false;
  const players = {
    left:  { score: 0, gesture: 'None', theme: 'cyberpunk', color: '#00ffff' },
    right: { score: 0, gesture: 'None', theme: 'lava',      color: '#ff4500' }
  };

  function setActive(val) { active = val; }
  function isActive() { return active; }

  function update(handsData) {
    if (!active) return;
    
    players.left.gesture = 'None';
    players.right.gesture = 'None';

    handsData.forEach(hand => {
      const wristX = 1 - hand.landmarks[0].x; // Mirrored X
      const side = wristX < 0.5 ? 'left' : 'right';
      players[side].gesture = hand.gesture;
      
      // Basic scoring logic
      if (hand.gesture !== 'None') {
        players[side].score += 0.05;
      }
    });

    // Check for "Clash" (both hands near center with same gesture)
    if (handsData.length === 2) {
      const g1 = handsData[0].gesture, g2 = handsData[1].gesture;
      const x1 = (1 - handsData[0].landmarks[0].x);
      const x2 = (1 - handsData[1].landmarks[0].x);
      if (g1 === g2 && g1 !== 'None' && Math.abs(x1 - x2) < 0.2) {
        players.left.score += 1;
        players.right.score += 1;
      }
    }
  }

  function drawUI(ctx, W, H) {
    if (!active) return;

    // Center divider
    ctx.save();
    ctx.setLineDash([10, 15]);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W/2, 0);
    ctx.lineTo(W/2, H);
    ctx.stroke();

    // Scores
    ctx.font = 'bold 36px Orbitron';
    ctx.textAlign = 'center';
    
    ctx.fillStyle = players.left.color;
    ctx.fillText(Math.floor(players.left.score), W * 0.25, 80);
    ctx.font = '12px Space Mono';
    ctx.fillText(players.left.gesture, W * 0.25, 100);

    ctx.font = 'bold 36px Orbitron';
    ctx.fillStyle = players.right.color;
    ctx.fillText(Math.floor(players.right.score), W * 0.75, 80);
    ctx.font = '12px Space Mono';
    ctx.fillText(players.right.gesture, W * 0.75, 100);

    ctx.restore();
  }

  window.NeonAuraMultiplayer = { setActive, isActive, update, drawUI };

})();
