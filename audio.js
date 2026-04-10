// audio.js — Web Audio API Engine (PRD v1.0 + v2.0)

(function () {

  let audioCtx    = null;
  let droneOsc    = null;
  let droneGain   = null;
  let droneActive = false;
  let muted       = false;
  let lastGesture = '';

  // ── Init (must be called on user gesture) ─────────────────────────────────
  function init() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // ── Resume (handles autoplay policy) ──────────────────────────────────────
  function resume() {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  // ── Drone ─────────────────────────────────────────────────────────────────
  function startDrone() {
    if (!audioCtx || droneActive) return;
    droneOsc  = audioCtx.createOscillator();
    droneGain = audioCtx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(110, audioCtx.currentTime);
    droneGain.gain.setValueAtTime(0, audioCtx.currentTime);
    droneOsc.connect(droneGain).connect(audioCtx.destination);
    droneOsc.start();
    droneActive = true;
    if (!muted) {
      droneGain.gain.setTargetAtTime(0.05, audioCtx.currentTime, 0.3);
    }
  }

  function stopDrone() {
    if (!droneActive || !droneGain) return;
    droneGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
    setTimeout(() => {
      try { droneOsc.stop(); } catch (_) {}
      droneActive = false;
      droneOsc = null; droneGain = null;
    }, 800);
  }

  // ── Update pitch/volume from spread % ─────────────────────────────────────
  function updateFromSpread(spread) {
    if (!droneActive || !droneOsc || muted) return;
    const freq = 100 + spread * 3;   // 100–400 Hz
    const vol  = spread / 300;       // 0–0.33
    droneOsc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.1);
    droneGain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.1);
  }

  // ── One-shot sound ─────────────────────────────────────────────────────────
  function playOneShot(frequency, type, duration, volume) {
    if (!audioCtx || muted) return;
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume || 0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  // ── Gesture-based sounds ───────────────────────────────────────────────────
  function onGestureChange(gesture) {
    if (gesture === lastGesture) return;
    lastGesture = gesture;

    switch (gesture) {
      case 'Fist':    playOneShot(60,  'sawtooth', 0.3, 0.3); break;
      case 'Pinch':   playOneShot(880, 'sine',     0.4, 0.2); break;
      case 'Peace':
        playOneShot(523, 'sine', 0.4, 0.15);
        setTimeout(() => playOneShot(659, 'sine', 0.4, 0.15), 120);
        break;
      case 'Open':
        playOneShot(440, 'sine', 0.3, 0.12);
        break;
    }
  }

  // ── Piano note ────────────────────────────────────────────────────────────
  function playNote(frequency) {
    if (!audioCtx || muted) return;
    const osc    = audioCtx.createOscillator();
    const gain   = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    osc.type    = 'sine';
    osc.frequency.value    = frequency;
    filter.type            = 'lowpass';
    filter.frequency.value = 2000;
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.connect(filter).connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  }

  // ── Mute toggle ───────────────────────────────────────────────────────────
  function toggleMute() {
    muted = !muted;
    if (droneGain) {
      droneGain.gain.setTargetAtTime(muted ? 0 : 0.05, audioCtx.currentTime, 0.2);
    }
    return muted;
  }

  function getAudioContext() { return audioCtx; }

  window.NeonAuraAudio = {
    init, resume, startDrone, stopDrone,
    updateFromSpread, onGestureChange, playNote,
    toggleMute, getAudioContext
  };

})();
