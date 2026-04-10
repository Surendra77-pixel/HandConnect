// tracker.js — MediaPipe Hand Tracking (Custom HTML5 Camera Loop Fix)

(function () {

  let handsInstance = null;
  let onResultsCB   = null;
  let isTracking    = false;
  let videoStream   = null;

  let lastVideoTime = -1;
  let frameInFlight = false;
  let lastProcessedTime = Date.now();

  async function init(videoEl, onResults) {
    onResultsCB = onResults;

    // 1. Initialize MediaPipe Hands
    handsInstance = new Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
    });

    handsInstance.setOptions({
      maxNumHands:          2,
      modelComplexity:      1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence:  0.5
    });

    handsInstance.onResults(results => {
      frameInFlight = false;
      lastProcessedTime = Date.now();
      if (onResultsCB) onResultsCB(results);
    });

    // 2. Start HTML5 Camera manually (replaces buggy @mediapipe/camera_utils)
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });
      videoEl.srcObject = videoStream;
      await videoEl.play();
      console.log('[NeonAura] Camera stream started successfully.');
    } catch (err) {
      console.error('[NeonAura] Camera permission denied or failed:', err);
      throw err;
    }

    isTracking = true;

    // 3. Custom unified tracking loop
    async function trackFrame() {
      if (!isTracking) return;

      // Watchdog: If frame lock is stuck for > 500ms, unlock it
      if (frameInFlight && (Date.now() - lastProcessedTime > 500)) {
        frameInFlight = false;
      }

      // Only send a frame if we are not busy and the video has newly decoded data
      if (!frameInFlight && videoEl.readyState >= 2 && videoEl.currentTime !== lastVideoTime) {
        lastVideoTime = videoEl.currentTime;
        frameInFlight = true;
        lastProcessedTime = Date.now();
        
        try {
          // Send timestamp to help MediaPipe drop stale frames internally
          await handsInstance.send({ image: videoEl });
        } catch (e) {
          frameInFlight = false;
          console.warn('[NeonAura] MediaPipe send frame error:', e);
        }
      }

      // Use requestAnimationFrame for smooth, non-blocking polling tied to monitor refresh
      requestAnimationFrame(trackFrame);
    }

    // Kick off loop
    trackFrame();
  }

  function stop() {
    isTracking = false;
    if (videoStream) {
      videoStream.getTracks().forEach(t => t.stop());
      videoStream = null;
    }
  }

  window.NeonAuraTracker = { init, stop };

})();
