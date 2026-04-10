// audio/beat.js — Beat Detection & Music Sync (PRD v3.0 Enhanced #3)

(function () {

  let analyser = null;
  let dataArray = null;
  let audioContext = null;
  let active = false;
  let currentIntensity = 0;

  function init(ctx) {
    audioContext = ctx;
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  function connectStream(source) {
    source.connect(analyser);
  }

  function update() {
    if (!analyser || !active) return 0;
    analyser.getByteFrequencyData(dataArray);
    
    // Bass energy (low frequencies)
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += dataArray[i];
    }
    currentIntensity = sum / 10 / 255; // 0 - 1
    return currentIntensity;
  }

  function getIntensity() { return currentIntensity; }
  function setActive(val) { active = val; }
  function isActive() { return active; }

  window.NeonAuraBeat = { init, connectStream, update, getIntensity, setActive, isActive };

})();
