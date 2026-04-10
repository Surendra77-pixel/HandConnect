// effects/handCircle.js — Hand Circle Gesture Effect for NEON AURA AR
//
// HOW IT WORKS:
//   • Track the palm center position over the last ~90 frames (~1.5s)
//   • When the trail forms a roughly closed loop (start ≈ end) AND the
//     path is roughly circular (variance from centroid is low), show a
//     glowing neon circle fitted to that path.
//   • The circle stays alive while the hand keeps moving in a loop.
//   • When the hand stops or opens flat, the circle fades out smoothly.

(function () {

  // Per-hand state
  const MAX_TRAIL   = 90;     // frames of position history
  const MIN_POINTS  = 40;     // need at least this many before checking
  const CLOSE_DIST  = 0.18;   // normalised distance threshold for loop closure
  const CIRCULARITY = 0.55;   // how "round" the path must be (0–1; higher = stricter)

  // State per hand (up to 2)
  const handState = [makeState(), makeState()];

  function makeState() {
    return {
      trail:      [],      // [{x, y}] normalised palm positions
      circle:     null,    // { cx, cy, r } in normalised coords — if detected
      alpha:      0,       // current display alpha (0–1)
      fadeDir:    0,       // +1 = fade in, -1 = fade out
      spin:       0,       // rotation offset for animated ring dashes
      detected:   false    // was circle seen last frame?
    };
  }

  // ─── Fit circle to a set of 2-D points (least-squares centre + avg radius)
  function fitCircle(points) {
    let cx = 0, cy = 0;
    points.forEach(p => { cx += p.x; cy += p.y; });
    cx /= points.length;
    cy /= points.length;

    let r = 0;
    points.forEach(p => { r += Math.hypot(p.x - cx, p.y - cy); });
    r /= points.length;

    return { cx, cy, r };
  }

  // ─── Measure how circular a path is (0 = line, 1 = perfect circle)
  function circularityScore(points, cx, cy, r) {
    if (r < 0.01) return 0;
    let err = 0;
    points.forEach(p => {
      const d = Math.hypot(p.x - cx, p.y - cy);
      err += Math.abs(d - r) / r;
    });
    return Math.max(0, 1 - err / points.length);
  }

  // ─── Update one hand's trail and detect circle ───────────────────────────
  function updateHand(handIdx, palmCenter) {
    const s = handState[handIdx];
    s.trail.push({ x: palmCenter.x, y: palmCenter.y });
    if (s.trail.length > MAX_TRAIL) s.trail.shift();

    if (s.trail.length < MIN_POINTS) {
      s.detected = false;
      return;
    }

    // Check loop closure: distance between first and last points
    const first = s.trail[0], last = s.trail[s.trail.length - 1];
    const closeDist = Math.hypot(last.x - first.x, last.y - first.y);

    if (closeDist > CLOSE_DIST) {
      s.detected = false;
      return;
    }

    // Fit a circle to the trail
    const { cx, cy, r } = fitCircle(s.trail);
    const score = circularityScore(s.trail, cx, cy, r);

    if (score >= CIRCULARITY && r > 0.05 && r < 0.45) {
      s.circle   = { cx, cy, r };
      s.detected = true;
    } else {
      s.detected = false;
    }
  }

  // ─── Clear a hand's trail (call when hand is lost) ───────────────────────
  function clearHand(handIdx) {
    handState[handIdx].trail   = [];
    handState[handIdx].detected = false;
  }

  // ─── Draw all active hand circles ────────────────────────────────────────
  function draw(ctx, theme, time, W, H) {
    for (const s of handState) {
      // Fade in / out
      if (s.detected) {
        s.alpha = Math.min(1, s.alpha + 0.06);
      } else {
        s.alpha = Math.max(0, s.alpha - 0.035);
      }

      if (s.alpha <= 0 || !s.circle) continue;

      const { cx, cy, r } = s.circle;
      const px = cx * W, py = cy * H, pr = r * Math.min(W, H);
      const primary = typeof theme.primary  === 'function' ? theme.primary(time * 0.001) : theme.primary;
      const pulse   = 1 + 0.08 * Math.sin(time * 0.005);

      s.spin += 0.018;

      ctx.save();
      ctx.globalAlpha = s.alpha;

      // ── Outer glow ring ──────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(px, py, pr * pulse * 1.12, 0, Math.PI * 2);
      ctx.strokeStyle = theme.glow;
      ctx.lineWidth   = 2;
      ctx.shadowBlur  = 30;
      ctx.shadowColor = theme.glow;
      ctx.globalAlpha = s.alpha * 0.35;
      ctx.stroke();

      // ── Main neon circle ─────────────────────────────────────────────
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(px, py, pr * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = primary;
      ctx.lineWidth   = 3;
      ctx.shadowBlur  = 24;
      ctx.shadowColor = primary;
      ctx.stroke();

      // ── Spinning dashed inner ring ────────────────────────────────────
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(s.spin);
      ctx.setLineDash([8, 12]);
      ctx.lineDashOffset = s.spin * 20;
      ctx.beginPath();
      ctx.arc(0, 0, pr * pulse * 0.78, 0, Math.PI * 2);
      ctx.strokeStyle = theme.secondary;
      ctx.lineWidth   = 1.5;
      ctx.shadowBlur  = 14;
      ctx.shadowColor = theme.secondary;
      ctx.globalAlpha = s.alpha * 0.6;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── Radial fill glow ─────────────────────────────────────────────
      const grad = ctx.createRadialGradient(px, py, 0, px, py, pr * pulse);
      grad.addColorStop(0,   theme.glow + '18');
      grad.addColorStop(0.6, theme.glow + '08');
      grad.addColorStop(1,   'transparent');
      ctx.fillStyle   = grad;
      ctx.globalAlpha = s.alpha * 0.7;
      ctx.beginPath();
      ctx.arc(px, py, pr * pulse, 0, Math.PI * 2);
      ctx.fill();

      // ── Small tick marks around the circle ──────────────────────────
      ctx.globalAlpha = s.alpha * 0.5;
      ctx.strokeStyle = primary;
      ctx.lineWidth   = 1.5;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = primary;
      const ticks = 12;
      for (let t = 0; t < ticks; t++) {
        const angle = (t / ticks) * Math.PI * 2 + s.spin;
        const inner = pr * pulse * 0.92;
        const outer = pr * pulse * 1.08;
        ctx.beginPath();
        ctx.moveTo(px + Math.cos(angle) * inner, py + Math.sin(angle) * inner);
        ctx.lineTo(px + Math.cos(angle) * outer, py + Math.sin(angle) * outer);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  window.NeonAuraHandCircle = { updateHand, clearHand, draw };

})();
