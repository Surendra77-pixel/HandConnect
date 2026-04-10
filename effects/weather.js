// effects/weather.js — Weather Reactive Mode (PRD v3.0 Enhanced #12)

(function () {

  let active = false;
  let type   = 'rain'; // rain, snow, storm
  const drops = [];

  function setActive(val) { 
    active = val; 
    if (active) init();
  }
  function isActive() { return active; }

  function init() {
    drops.length = 0;
    for (let i = 0; i < 100; i++) {
        drops.push({
            x: Math.random() * 1920,
            y: Math.random() * 1080,
            v: 5 + Math.random() * 10,
            l: 10 + Math.random() * 20
        });
    }
  }

  function update(handsData, W, H) {
    if (!active) return;

    // Type shift based on time or random
    if (Math.random() > 0.995) type = ['rain', 'snow', 'storm'][Math.floor(Math.random()*3)];

    drops.forEach(d => {
        d.y += d.v;
        if (d.y > H) {
            d.y = -d.l;
            d.x = Math.random() * W;
        }

        // Hand interaction: push drops away or block
        handsData.forEach(hand => {
            const pc = window.NeonAuraGestures.getPalmCenter(hand.landmarks);
            const hx = (1 - pc.x) * W, hy = pc.y * H;
            const dist = Math.hypot(d.x - hx, d.y - hy);
            if (dist < 100) {
                d.x += (d.x - hx) * 0.1;
                d.y -= 5; // upward bounce
            }
        });
    });
  }

  function draw(ctx, theme, W, H) {
    if (!active) return;

    ctx.save();
    if (type === 'rain') {
        ctx.strokeStyle = 'rgba(100,200,255,0.4)';
        ctx.lineWidth = 1;
        drops.forEach(d => {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x, d.y + d.l);
            ctx.stroke();
        });
    } else if (type === 'snow') {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        drops.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    } else if (type === 'storm') {
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        if (Math.random() > 0.98) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(0,0,W,H);
        }
        drops.forEach(d => {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x + 2, d.y + d.l * 1.5);
            ctx.stroke();
        });
    }
    ctx.restore();
  }

  window.NeonAuraWeather = { setActive, isActive, update, draw };

})();
