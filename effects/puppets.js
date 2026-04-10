// effects/puppets.js — Hand Shadow Puppet Mode (PRD v3.0 Enhanced #1)

(function () {

  let active = false;

  function setActive(val) { active = val; }
  function isActive() { return active; }

  function draw(ctx, handsData, theme, W, H) {
    if (!active) return;

    // 1. Draw "Beige Wall" background
    ctx.save();
    ctx.fillStyle = '#e6d5b8'; // Warm beige wall
    ctx.fillRect(0, 0, W, H);
    
    // Subtle texture (noise/vignette)
    const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // 2. Draw Hand Silhouettes
    handsData.forEach(hand => {
      const landmarks = hand.landmarks;
      
      ctx.save();
      ctx.beginPath();
      
      // We need a path that outlines the hand.
      // A simple way is to use the knuckles and fingertips in order.
      // But for a true puppet feel, we'll draw thick blobs for knuckles and lines.
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(0,0,0,0.85)'; // Dark shadow
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      
      // Connections list (simplified for outline)
      const connections = [
        [0,1,2,3,4], // thumb
        [0,5,6,7,8], // index
        [0,9,10,11,12], // middle
        [0,13,14,15,16], // ring
        [0,17,18,19,20], // pinky
        [5,9,13,17,0] // palm
      ];

      ctx.lineWidth = 35; // Thick to fill gaps
      connections.forEach(path => {
        ctx.beginPath();
        path.forEach((idx, i) => {
          const x = (1 - landmarks[idx].x) * W;
          const y = landmarks[idx].y * H;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      // Fill the palm area more solidly
      ctx.beginPath();
      [0,5,9,13,17].forEach((idx, i) => {
          const x = (1 - landmarks[idx].x) * W;
          const y = landmarks[idx].y * H;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });
  }

  window.NeonAuraPuppets = { setActive, isActive, draw };

})();
