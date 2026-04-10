// ui/gallery.js — Hand Paint Gallery (PRD v3.0 Enhanced #11)

(function () {

  let active = false;
  let items = [];

  function init() {
    try {
      const saved = localStorage.getItem('auraweave_gallery');
      if (saved) items = JSON.parse(saved);
    } catch(e) {}
  }

  function saveImage(dataUrl) {
    items.unshift({ id: Date.now(), src: dataUrl });
    if (items.length > 8) items.pop();
    localStorage.setItem('auraweave_gallery', JSON.stringify(items));
    window.NeonAuraToast?.show('🖼️ Saved to Gallery', '#fff');
  }

  function setActive(val) { active = val; }
  function isActive() { return active; }

  function draw(ctx, W, H) {
    if (!active || items.length === 0) return;

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#ff33aa';
    ctx.font = 'bold 32px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('NEON GALLERY', W/2, 80);

    const cols = W < 600 ? 2 : 4;
    const padding = W < 600 ? 20 : 40;
    const size = (W - padding * (cols + 1)) / cols;

    const imgCache = {};

    items.forEach((item, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = padding + c * (size + padding);
        const y = 150 + r * (size * 0.8 + padding);

        ctx.fillStyle = '#111';
        ctx.fillRect(x, y, size, size * 0.6);
        ctx.strokeStyle = '#ff33aa';
        ctx.strokeRect(x, y, size, size * 0.6);

        if (!imgCache[item.src]) {
            const img = new Image();
            img.src = item.src;
            imgCache[item.src] = img;
        }
        
        const img = imgCache[item.src];
        if (img.complete) {
            ctx.drawImage(img, x, y, size, size * 0.6);
        } else {
            ctx.fillStyle = '#444';
            ctx.fillText('LOADING...', x + size/2, y + size * 0.3);
        }

        ctx.fillStyle = '#fff';
        ctx.font = '10px Space Mono';
        ctx.fillText('SNAPSHOT ' + (i+1), x + size/2, y + size * 0.6 + 15);
    });

    ctx.restore();
  }

  window.NeonAuraGallery = { init, saveImage, setActive, isActive, draw };

})();
