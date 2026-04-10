// effects/arObjects.js — Augmented Reality 3D-ish Objects (PRD v3.0 Enhanced #9)

(function () {

  let active = false;
  let type   = 'cube';

  function setActive(val) { active = val; }
  function setType(t)    { type = t; }

  function draw(ctx, handsData, theme, time, W, H) {
    if (!active) return;

    handsData.forEach(hand => {
      const palm = window.NeonAuraGestures.getPalmCenter(hand.landmarks);
      const px = (1 - palm.x) * W;
      const py = palm.y * H;
      const size = 60 + hand.spread * 0.5;

      if (type === 'cube') {
        drawCube(ctx, px, py, size, theme, time);
      }
    });
  }

  function drawCube(ctx, x, y, size, theme, time) {
    const angle = time * 0.001;
    const vertices = [
      [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
      [-1,-1, 1], [1,-1, 1], [1,1, 1], [-1,1, 1]
    ].map(([vx, vy, vz]) => {
      // Rotation Y
      let rx = vx * Math.cos(angle) - vz * Math.sin(angle);
      let rz = vx * Math.sin(angle) + vz * Math.cos(angle);
      // Rotation X
      let ry = vy * Math.cos(angle * 0.5) - rz * Math.sin(angle * 0.5);
      rz = vy * Math.sin(angle * 0.5) + rz * Math.cos(angle * 0.5);

      const s = size / (3 + rz);
      return { x: x + rx * s, y: y + ry * s };
    });

    const faces = [
      [0,1,2,3], [4,5,6,7], [0,1,5,4], [2,3,7,6], [0,3,7,4], [1,2,6,5]
    ];

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = theme.primary;
    ctx.shadowBlur = 15;
    ctx.shadowColor = theme.glow;

    faces.forEach((face, idx) => {
      ctx.beginPath();
      face.forEach((vi, i) => {
        const v = vertices[vi];
        if (i === 0) ctx.moveTo(v.x, v.y); else ctx.lineTo(v.x, v.y);
      });
      ctx.closePath();
      ctx.globalAlpha = 0.4 + Math.sin(time * 0.002 + idx) * 0.2;
      ctx.stroke();
    });
    ctx.restore();
  }

  window.NeonAuraAR = { setActive, setType, draw };

})();
