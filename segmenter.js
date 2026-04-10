// segmenter.js — MediaPipe Selfie Segmentation (v3.0 Phase 1)

(function () {

  let segmenterInstance = null;
  let onResultsCB       = null;
  let isTracking       = false;
  let frameInFlight     = false;
  let lastVideoTime     = -1;
  let lastProcessedTime = 0;

  async function init(videoEl, onResults) {
    onResultsCB = onResults;

    segmenterInstance = new SelfieSegmentation({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${f}`
    });

    segmenterInstance.setOptions({
      modelSelection: 1, // 0 = general (faster), 1 = landscape (better accuracy)
    });

    segmenterInstance.onResults(results => {
      frameInFlight = false;
      lastProcessedTime = Date.now();
      if (onResultsCB) onResultsCB(results);
    });

    isTracking = true;

    async function trackFrame() {
      if (!isTracking) return;

      // Watchdog
      if (frameInFlight && (Date.now() - lastProcessedTime > 500)) {
        frameInFlight = false;
      }

      if (!frameInFlight && videoEl.readyState >= 2 && videoEl.currentTime !== lastVideoTime) {
        lastVideoTime = videoEl.currentTime;
        frameInFlight = true;
        lastProcessedTime = Date.now();
        
        try {
          await segmenterInstance.send({ image: videoEl });
        } catch (e) {
          frameInFlight = false;
        }
      }

      requestAnimationFrame(trackFrame);
    }

    trackFrame();
  }

  function setEnabled(val) {
    isTracking = !!val;
    if (!val) frameInFlight = false;
  }

  window.NeonAuraSegmenter = { init, setEnabled };

})();
