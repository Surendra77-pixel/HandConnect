// app.js v3.0 — Core Application Logic (PRD v1.0 + v2.0 + v3.0 Ultimate)

(function () {
  'use strict';

  // ─── STATE ────────────────────────────────────────────────────────────────
  const state = {
    started:          false,
    currentTheme:     'cyberpunk',
    handsData:        [],
    fps:              0,
    lastFrameTime:    performance.now(),
    frameCount:       0,
    fpsTimer:         0,
    time:             0,
    mirrorMode:       false,
    pianoMode:        false,
    drawMode:         false,
    kaleidoActive:    false,
    gestureCooldown:  0,
    wasPinching:      [false, false]
  };

  const GESTURE_THEME_MAP = {
    'Open':     'rainbow',
    'Spread':   'rainbow',
    'Peace':    'cyberpunk',
    'ThumbsUp': 'lava',
    'Point':    'ocean',
    'Pinch':    'galaxy'
  };

  // ─── DOM REFS ─────────────────────────────────────────────────────────────
  const splash      = document.getElementById('splash');
  const enterBtn    = document.getElementById('enterBtn');
  const retryBtn    = document.getElementById('retryBtn');
  const errorMsg    = document.getElementById('errorMsg');
  const arScreen    = document.getElementById('arScreen');
  const videoEl     = document.getElementById('video');
  const canvas      = document.getElementById('canvas');
  const ctx         = canvas.getContext('2d');
  const loadingEl   = document.getElementById('loading');
  const muteBtn     = document.getElementById('muteBtn');
  const mirrorBtn   = document.getElementById('mirrorBtn');
  const pianoBtn    = document.getElementById('pianoBtn');
  const drawBtn     = document.getElementById('drawBtn');
  const kaleidoBtn  = document.getElementById('kaleidoBtn');
  const fireBtn     = document.getElementById('fireBtn');
  const puppetBtn   = document.getElementById('puppetBtn');
  const multiBtn    = document.getElementById('multiBtn');
  const constBtn    = document.getElementById('constBtn');
  const battleBtn   = document.getElementById('battleBtn');
  const drumBtn     = document.getElementById('drumBtn');
  const aslBtn      = document.getElementById('aslBtn');
  const galleryBtn  = document.getElementById('galleryBtn');
  const weatherBtn  = document.getElementById('weatherBtn');
  const timeBtn     = document.getElementById('timeBtn');
  const accessBtn   = document.getElementById('accessBtn');
  const captureBtn  = document.getElementById('captureBtn');
  const fsBtn       = document.getElementById('fsBtn');
  const themePills  = document.querySelectorAll('.theme-pill');

  let currentVelocity = 0;

  // ─── CANVAS RESIZE ────────────────────────────────────────────────────────
  function resizeCanvas() {
    canvas.width        = window.innerWidth;
    canvas.height       = window.innerHeight;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    window.NeonAuraDrawMode?.resize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', resizeCanvas);

  // ─── THEME SWITCHING ──────────────────────────────────────────────────────
  function setTheme(name) {
    if (!window.NeonAuraThemes.themes[name]) return;
    state.currentTheme = name;
    themePills.forEach(p => {
      p.classList.toggle('active', p.dataset.theme === name);
      p.setAttribute('aria-pressed', String(p.dataset.theme === name));
    });
    const theme = window.NeonAuraThemes.themes[name];
    document.documentElement.style.setProperty('--hud-color', theme.hudColor);
  }

  themePills.forEach(pill => pill.addEventListener('click', () => setTheme(pill.dataset.theme)));

  // ─── MEDIAPIPE RESULTS ────────────────────────────────────────────────────
  function onHandResults(results) {
    const { detectGesture, calculateSpread, getPalmCenter } = window.NeonAuraGestures;
    state.handsData = [];

    if (results.multiHandLandmarks?.length > 0) {
      results.multiHandLandmarks.forEach(landmarks => {
        const gesture = detectGesture(landmarks);
        const spread  = calculateSpread(landmarks);
        state.handsData.push({ landmarks, gesture, spread });
      });

      // Process up to two hands
      for (let i = 0; i < state.handsData.length; i++) {
        const hand = state.handsData[i];
        
        // Multi-hand audio & effects
        if (i === 0) {
          window.NeonAuraAudio.startDrone();
          if (!state.pianoMode) {
              window.NeonAuraAudio.updateFromSpread(hand.spread);
              window.NeonAuraAudio.onGestureChange(hand.gesture);
          }
          handleGestureThemeSwitch(hand.gesture, state.time);
        }

        handlePinchRelease(i, hand.gesture, hand.landmarks);

        // Draw mode
        if (i === 0 && state.drawMode && window.NeonAuraDrawMode) {
          window.NeonAuraDrawMode.handleFrame(
            hand.landmarks[8], hand.gesture,
            window.NeonAuraThemes.themes[state.currentTheme],
            window.innerWidth, window.innerHeight
          );
          if (hand.gesture === 'Pinch' && !state.wasPinching[0]) {
            const sz = window.NeonAuraDrawMode.cycleBrush();
            window.NeonAuraToast?.show(`Brush: ${sz}px`, '#ffdd00');
          }
        }

        // Velocity explosion
        if (window.NeonAuraExplosion) {
          const W = window.innerWidth, H = window.innerHeight;
          const vel = window.NeonAuraExplosion.calculateVelocity(hand.landmarks, i, W, H);
          if (i === 0) currentVelocity = vel;
          const palm = getPalmCenter(hand.landmarks);
          window.NeonAuraExplosion.checkAndExplode(
            hand.landmarks, i, (1 - palm.x) * W, palm.y * H, vel,
            window.NeonAuraThemes.themes[state.currentTheme]
          );
        }

        // Accessibility (only announce on change)
        if (hand.gesture !== 'None' && hand.gesture !== (state.lastAnnounced?.[i])) {
            window.NeonAuraAccess?.announce(`Hand ${i+1}: ${hand.gesture}`);
            if (!state.lastAnnounced) state.lastAnnounced = {};
            state.lastAnnounced[i] = hand.gesture;
        }
      }

      if (state.pianoMode && window.NeonAuraPiano) {
        window.NeonAuraPiano.processHands(state.handsData, window.innerWidth, window.innerHeight);
      }

      handleTimerGestures(state.handsData[0]);

    } else {
      window.NeonAuraAudio.stopDrone();
      window.NeonAuraExplosion?.resetHistory(0);
      window.NeonAuraExplosion?.resetHistory(1);
      currentVelocity = 0;
    }
  }

  function handleGestureThemeSwitch(gesture, currentTime) {
    if (currentTime < state.gestureCooldown) return;
    const newTheme = GESTURE_THEME_MAP[gesture];
    if (newTheme && newTheme !== state.currentTheme) {
      setTheme(newTheme);
      const theme = window.NeonAuraThemes.themes[newTheme];
      window.NeonAuraToast?.show(`🎨 ${newTheme.toUpperCase()}`, theme.hudColor);
      state.gestureCooldown = currentTime + 2000;
    }
  }

  function handlePinchRelease(handIdx, gesture, landmarks) {
    if (state.wasPinching[handIdx] && gesture !== 'Pinch') {
      const theme = window.NeonAuraThemes.themes[state.currentTheme];
      const tip   = landmarks[8];
      const W = window.innerWidth, H = window.innerHeight;
      const rx = (1 - tip.x) * W;
      const ry = tip.y * H;
      const color = window.NeonAuraThemes.resolveColor(theme.primary, state.time);
      const col   = typeof color === 'function' ? color() : color;
      window.NeonAuraRipple?.spawnTripleRipple(rx, ry, col, theme.glow);
    }
    state.wasPinching[handIdx] = (gesture === 'Pinch');
  }

  let timerGestureTime = 0;
  let lastFingerCount = -1;

  function handleTimerGestures(hand) {
    if (!hand || !window.NeonAuraTimer) return;
    const fCount = window.NeonAuraGestures.countRaisedFingers(hand.landmarks);
    
    if (hand.gesture === 'Fist') {
      if (timerGestureTime === 0) timerGestureTime = state.time;
      if (state.time - timerGestureTime > 1500) { 
        window.NeonAuraTimer.toggle();
        timerGestureTime = state.time + 1000; 
      }
    } else if (fCount > 0 && fCount <= 5) {
      if (fCount !== lastFingerCount) {
        lastFingerCount = fCount;
        timerGestureTime = state.time;
      } else if (state.time - timerGestureTime > 1500) {
        window.NeonAuraTimer.setMinutes(fCount);
        window.NeonAuraToast?.show(`⏳ Timer: ${fCount} min`, '#ffffff');
        timerGestureTime = state.time + 1000;
      }
    } else {
      timerGestureTime = 0;
      lastFingerCount = -1;
    }
  }

  // ─── RENDER LOOP ──────────────────────────────────────────────────────────
  function renderLoop(timestamp) {
    if (!state.started) return;

    const slowFactor = window.NeonAuraTimeWarp?.getFactor() || 1.0;
    const delta = (timestamp - state.lastFrameTime) * slowFactor;
    state.lastFrameTime = timestamp;
    state.time += delta;

    state.frameCount++;
    state.fpsTimer += (timestamp - state.lastFrameTime); // Actual clock for FPS
    if (state.fpsTimer >= 500) {
      state.fps        = Math.round(state.frameCount * 1000 / state.fpsTimer);
      state.frameCount = 0;
      state.fpsTimer   = 0;
    }

    const W = window.innerWidth, H = window.innerHeight;
    const stats = {
      handsDetected: state.handsData.length,
      fps:           state.fps,
      gesture:       state.handsData[0]?.gesture || 'None',
      spread:        state.handsData[0]?.spread  || 0,
      velocity:      currentVelocity,
      mode:          state.drawMode ? 'DRAW' : state.pianoMode ? 'PIANO' : 'NORMAL'
    };

    window.NeonAuraRenderer.renderFrame(ctx, videoEl, state.handsData, state.currentTheme, state.time, stats, W, H, state.mirrorMode);

    window.NeonAuraSpatial?.update(state.handsData, state.time, W, H, (actionId) => {
      if (actionId === 'theme_next') {
        const themeKeys = Object.keys(window.NeonAuraThemes.themes);
        const nextKey = themeKeys[(themeKeys.indexOf(state.currentTheme) + 1) % themeKeys.length];
        setTheme(nextKey);
      } else if (actionId === 'clear_draw') {
        window.NeonAuraDrawMode?.clear();
      }
    });

    window.NeonAuraSpells?.update(state.handsData, state.time, W, H);
    window._updateGestureBadge?.(stats.gesture);
    requestAnimationFrame(renderLoop);
  }

  // ─── START EXPERIENCE ─────────────────────────────────────────────────────
  async function startExperience() {
    enterBtn.disabled = true;
    if (loadingEl) loadingEl.style.display = 'flex';

    try {
      if (window.NeonAuraScreenshot?.init) window.NeonAuraScreenshot.init();
      if (window.NeonAuraParticles?.init) window.NeonAuraParticles.init(60);
      if (window.NeonAuraConstellations?.init) window.NeonAuraConstellations.init(canvas.width, canvas.height);
      
      try {
        const audioCtx = window.NeonAuraAudio.getAudioContext();
        window.NeonAuraBeat?.init(audioCtx);
        window.NeonAuraBeat?.setActive(true);
      } catch(e) {}

      window.NeonAuraAudio.init();
      window.NeonAuraAudio.resume();

      await window.NeonAuraTracker.init(videoEl, onHandResults);
      
      // 🚀 START!
      if (loadingEl) loadingEl.style.display = 'none';
      splash.style.display   = 'none';
      arScreen.style.display = 'block';
      resizeCanvas();

      window.NeonAuraDrawMode?.init(window.innerWidth, window.innerHeight);
      window.NeonAuraGallery?.init();
      window.NeonAuraSpatial?.init();

      state.started = true;
      requestAnimationFrame(renderLoop);
    } catch (err) {
      console.error(err);
      enterBtn.disabled = false;
    }
  }

  // ─── BUTTONS ──────────────────────────────────────────────────────────────
  muteBtn?.addEventListener('click', () => {
    const isMuted = window.NeonAuraAudio.toggleMute();
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
  });

  mirrorBtn?.addEventListener('click', () => {
    state.mirrorMode = !state.mirrorMode;
    mirrorBtn.classList.toggle('active', state.mirrorMode);
  });

  pianoBtn?.addEventListener('click', () => {
    state.pianoMode = !state.pianoMode;
    window.NeonAuraPiano?.setActive(state.pianoMode);
    pianoBtn.classList.toggle('active', state.pianoMode);
    if (state.pianoMode) { state.drawMode = false; window.NeonAuraDrawMode?.setActive(false); drawBtn?.classList.remove('active'); }
  });

  drawBtn?.addEventListener('click', () => {
    state.drawMode = !state.drawMode;
    window.NeonAuraDrawMode?.setActive(state.drawMode);
    drawBtn.classList.toggle('active', state.drawMode);
    if (state.drawMode) { state.pianoMode = false; window.NeonAuraPiano?.setActive(false); pianoBtn?.classList.remove('active'); }
  });

  kaleidoBtn?.addEventListener('click', () => {
    state.kaleidoActive = !state.kaleidoActive;
    window._kaleidoscopeActive = state.kaleidoActive;
    window._kaleidoSegments = 6;
    kaleidoBtn.classList.toggle('active', state.kaleidoActive);
  });

  fireBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraFire.isActive();
    window.NeonAuraFire.setActive(active);
    fireBtn.classList.toggle('active', active);
  });

  puppetBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraPuppets.isActive();
    window.NeonAuraPuppets.setActive(active);
    puppetBtn.classList.toggle('active', active);
  });

  multiBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraMultiplayer.isActive();
    window.NeonAuraMultiplayer.setActive(active);
    multiBtn.classList.toggle('active', active);
  });

  constBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraConstellations.isActive();
    window.NeonAuraConstellations.setActive(active);
    constBtn.classList.toggle('active', active);
  });

  battleBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraBattle.isActive();
    window.NeonAuraBattle.setActive(active);
    battleBtn.classList.toggle('active', active);
  });

  drumBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraDrums.isActive();
    window.NeonAuraDrums.setActive(active);
    drumBtn.classList.toggle('active', active);
  });

  aslBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraASL.isActive();
    window.NeonAuraASL.setActive(active);
    aslBtn.classList.toggle('active', active);
  });

  galleryBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraGallery.isActive();
    window.NeonAuraGallery.setActive(active);
    galleryBtn.classList.toggle('active', active);
  });

  weatherBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraWeather.isActive();
    window.NeonAuraWeather.setActive(active);
    weatherBtn.classList.toggle('active', active);
  });

  timeBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraTimeWarp.isActive();
    window.NeonAuraTimeWarp.setActive(active);
    timeBtn.classList.toggle('active', active);
  });

  accessBtn?.addEventListener('click', () => {
    const active = !window.NeonAuraAccess.isActive();
    window.NeonAuraAccess.setActive(active);
    accessBtn.classList.toggle('active', active);
  });

  captureBtn?.addEventListener('click', () => {
    window.NeonAuraScreenshot?.capture(videoEl, canvas, window.NeonAuraDrawMode?.getCanvas(), window.innerWidth, window.innerHeight, (dataUrl) => {
        window.NeonAuraGallery?.saveImage(dataUrl);
    });
  });

  fsBtn?.addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });

  enterBtn.addEventListener('click', startExperience);
  retryBtn?.addEventListener('click', () => { errorMsg.style.display = 'none'; startExperience(); });

  // ─── SPLASH ANIMATION ─────────────────────────────────────────────────────
  (function () {
    const sc = document.getElementById('splashCanvas');
    if (!sc) return;
    const sctx = sc.getContext('2d');
    function sizeIt() { sc.width = window.innerWidth; sc.height = window.innerHeight; }
    sizeIt();
    window.addEventListener('resize', sizeIt);
    const dots = Array.from({ length: 50 }, () => ({ x: Math.random() * sc.width, y: Math.random() * sc.height, vx: Math.random() - 0.5, vy: Math.random() - 0.5 }));
    (function loop() {
      if (state.started) return;
      sctx.clearRect(0,0,sc.width,sc.height);
      dots.forEach(d => { d.x=(d.x+d.vx+sc.width)%sc.width; d.y=(d.y+d.vy+sc.height)%sc.height; sctx.fillStyle='rgba(0,255,255,0.2)'; sctx.beginPath(); sctx.arc(d.x,d.y,2,0,Math.PI*2); sctx.fill(); });
      requestAnimationFrame(loop);
    })();
  })();

})();
