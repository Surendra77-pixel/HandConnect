// themes.js — 5 Visual Themes (PRD v1.0 spec)

(function () {

  const themes = {
    rainbow: {
      name:       'Rainbow',
      primary:    (t) => `hsl(${(t * 0.05) % 360}, 100%, 60%)`,
      secondary:  '#ffffff',
      glow:       '#ff88ff',
      particle:   () => `hsl(${Math.random() * 360}, 100%, 70%)`,
      hudColor:   '#ff88ff',
      background: 'rgba(255, 100, 200, 0.02)'
    },

    cyberpunk: {
      name:       'Cyberpunk',
      primary:    '#00ffff',
      secondary:  '#ff00ff',
      glow:       '#00ffff',
      particle:   '#ff00ff',
      hudColor:   '#00ffff',
      background: 'rgba(0, 255, 255, 0.03)'
    },

    lava: {
      name:       'Lava',
      primary:    '#ff4500',
      secondary:  '#ff8c00',
      glow:       '#ff4500',
      particle:   '#ffcc00',
      hudColor:   '#ff8c00',
      background: 'rgba(255, 69, 0, 0.04)'
    },

    ocean: {
      name:       'Ocean',
      primary:    '#00bfff',
      secondary:  '#006994',
      glow:       '#00e5ff',
      particle:   '#7fffd4',
      hudColor:   '#00e5ff',
      background: 'rgba(0, 191, 255, 0.03)'
    },

    galaxy: {
      name:       'Galaxy',
      primary:    '#9b59b6',
      secondary:  '#3498db',
      glow:       '#e056fd',
      particle:   '#ffffff',
      hudColor:   '#e056fd',
      background: 'rgba(155, 89, 182, 0.03)'
    },
    ultimate: {
      name:       'Ultimate',
      primary:    '#ffd700',
      secondary:  '#ffffff',
      glow:       '#fff5b1',
      particle:   () => Math.random() > 0.5 ? '#ffffff' : '#ffd700',
      hudColor:   '#ffd700',
      background: 'rgba(255, 215, 0, 0.04)'
    }
  };

  // Resolve animated or static color at a given time value
  function resolveColor(colorVal, time) {
    if (typeof colorVal === 'function') return colorVal(time);
    return colorVal;
  }

  window.NeonAuraThemes = { themes, resolveColor };

})();
