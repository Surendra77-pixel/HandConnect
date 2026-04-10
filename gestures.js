// gestures.js — Gesture Detection Module (PRD v1.0 + v2.0 expanded)

(function () {

  // Fingertip and base joint landmark indices
  const FINGERTIP_IDS  = [4, 8, 12, 16, 20];
  const FINGER_BASE    = [2, 5, 9, 13, 17];   // base joints for each finger

  // ── Distance helper ────────────────────────────────────────────────────────
  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
  }

  // ── Is finger extended? ────────────────────────────────────────────────────
  function isFingerUp(landmarks, tipIdx, baseIdx) {
    return landmarks[tipIdx].y < landmarks[baseIdx].y;
  }

  // ── Gesture Detection ──────────────────────────────────────────────────────
  function detectGesture(landmarks) {
    const thumbUp  = landmarks[4].y  < landmarks[3].y;  // thumb tip above thumb ip
    const indexUp  = isFingerUp(landmarks, 8,  6);
    const middleUp = isFingerUp(landmarks, 12, 10);
    const ringUp   = isFingerUp(landmarks, 16, 14);
    const pinkyUp  = isFingerUp(landmarks, 20, 18);

    const upCount = [thumbUp, indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;

    // Pinch: thumb tip and index tip close together
    const pinchDist = dist(landmarks[4], landmarks[8]);
    if (pinchDist < 0.05) return 'Pinch';

    // Open Hand / Spread: all 5 fingers up
    if (indexUp && middleUp && ringUp && pinkyUp && thumbUp) return 'Open';

    // Peace / V: index + middle only
    if (indexUp && middleUp && !ringUp && !pinkyUp) return 'Peace';

    // Point: index only
    if (indexUp && !middleUp && !ringUp && !pinkyUp) return 'Point';

    // Thumbs Up: thumb up, all other fingers down
    if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) return 'ThumbsUp';

    // Fist: all fingers curled
    if (!indexUp && !middleUp && !ringUp && !pinkyUp) return 'Fist';

    // Spread: check finger spread distance
    const spread = calculateSpread(landmarks);
    if (spread > 60 && upCount >= 4) return 'Spread';

    return 'None';
  }

  // ── Spread Percentage ──────────────────────────────────────────────────────
  function calculateSpread(landmarks) {
    const tips = FINGERTIP_IDS;
    let totalDist = 0;
    for (let i = 0; i < tips.length - 1; i++) {
      totalDist += dist(landmarks[tips[i]], landmarks[tips[i + 1]]);
    }
    const avg = totalDist / (tips.length - 1);
    return Math.min(100, Math.round(avg * 500));
  }

  // ── Palm Center ────────────────────────────────────────────────────────────
  function getPalmCenter(landmarks) {
    // Average of wrist (0) and base of each finger (5,9,13,17)
    const keys = [0, 5, 9, 13, 17];
    const x = keys.reduce((s, i) => s + landmarks[i].x, 0) / keys.length;
    const y = keys.reduce((s, i) => s + landmarks[i].y, 0) / keys.length;
    return { x, y };
  }

  function countRaisedFingers(landmarks) {
    const thumbUp  = landmarks[4].y  < landmarks[3].y;
    const indexUp  = isFingerUp(landmarks, 8,  6);
    const middleUp = isFingerUp(landmarks, 12, 10);
    const ringUp   = isFingerUp(landmarks, 16, 14);
    const pinkyUp  = isFingerUp(landmarks, 20, 18);
    return [thumbUp, indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;
  }

  window.NeonAuraGestures = { detectGesture, calculateSpread, getPalmCenter, countRaisedFingers };

})();
