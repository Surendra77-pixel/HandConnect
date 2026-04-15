# 🖐️ HANDCONNECT: Ultimate AR Hand-Tracking Experience

![AURAWEAVE — Advanced Hand Tracking](https://img.shields.io/badge/Status-Ultimate_Edition-blueviolet?style=for-the-badge)
![Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-yellow?style=for-the-badge)
![MediaPipe](https://img.shields.io/badge/Tracking-MediaPipe-00ffff?style=for-the-badge)

**HandConnect** is a cutting-edge, real-time augmented reality experience that transforms your hands into interactive digital controllers. Built with high-performance vanilla JavaScript and Google's MediaPipe, it offers a zero-latency, futuristic interface featuring multi-mode navigation, responsive audio, and stunning glassmorphism aesthetics.

---

## 🚀 Key Features

### 🎮 Interactive Modes
- **🎹 Piano Mode**: A spatial finger-piano that triggers notes based on fingertip collisions.
- **✍️ Draw Mode**: Create neon light-paintings in 3D space with pinch-and-drag gestures.
- **⚔️ Battle Mode**: A competitive gesture-clash mode for two players (or two hands!).
- **🥁 Drum Mode**: Virtual air-drums that respond to rapid hand movements.
- **🤟 ASL Trainer**: Real-time American Sign Language recognition and feedback.
- **⏳ Time Warp**: Slow down the visual flow of time with specialized kinetic gestures.

### 🌌 Visual Effects Engine
- **🔥 Fire Hands**: Real-time particle-based flame simulation attached to the palm.
- **✨ Constellations**: Bridge your fingers to create glowing star-map connections.
- **🔮 Kaleidoscope**: Multiply your moves through a 6-segment recursive mirror engine.
- **🌧️ Weather Mode**: Summon localized rain and storm effects controlled by hand height.
- **🐇 Puppets**: Transform your hand silhouette into dynamic shadow creatures.

### 🛠️ Advanced Tools
- **🖼️ Neon Gallery**: Capture snapshots of your light-paintings and save them to a local museum.
- **👥 Multiplayer**: Split-screen competitive logic with independent scoring.
- **📸 Screenshot Engine**: High-resolution composite capture combining camera + effects + canvas.
- **♿ Accessibility**: Real-time gesture-to-speech announcement system.

---

## 🛠️ Tech Stack & Tools

- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Tracking Engine**: [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) for robust 21-point landmark detection.
- **Rendering**: Canvas 2D API with high-performance bloom, glow, and alpha-compositing filters.
- **Audio**: Web Audio API for reactive drones and synthesized note triggering.
- **UI Design**: Modern Glassmorphism using `backdrop-filter` and advanced CSS variables.
- **Responsive**: Custom orientation-aware layout engine (optimized for Desktop, Mobile Portrait, and Mobile Landscape).

---

## 📁 Project Structure

```text
HandConnect/
├── 📂 audio/          # Sythesized audio loops and beat detection
├── 📂 effects/        # Core AR visual effect modules (Fire, Spells, Mirror, etc.)
├── 📂 modes/          # High-level interaction logic (Piano, Draw, ASL, Battle)
├── 📂 ui/             # Glassmorphic interface components (Gallery, HUD, Toast)
├── 📜 app.js          # Main application lifecycle and state management
├── 📜 style.css        # Advanced mobile-responsive design system
├── 📜 renderer.js     # High-performance canvas rendering engine
├── 📜 tracker.js      # MediaPipe initialization and frame watchdog
├── 📜 gestures.js     # Gesture recognition and kinematic calculation
├── 📜 themes.js       # Dynamic color and aesthetic palette configurations
├── 📜 index.html      # Primary entry point and loading sequence
└── 📜 README.md       # Project documentation
```

---

## 📖 How it Works

1. **Initialization**: The `tracker.js` module requests camera access and initializes the MediaPipe worker.
2. **Recognition**: Each frame is analyzed for 21-joint coordinates. `gestures.js` calculates spreads, palm angles, and velocity to identify 7+ distinct signs (Fist, Peace, Pinch, etc.).
3. **Synthesis**: The `app.js` state machine determines which mode is active and routes hand data to the appropriate `effects/` or `modes/` module.
4. **Rendering**: `renderer.js` clears and redraws the entire scene at 60 FPS, applying "Object-Fit: Cover" logic to ensure the camera feed remains distortion-free on any device.

---

## 📱 Experience Anywhere

HandConnect is fully optimized for:
- **Desktop**: Experience with a side-bar "Power User" interface.
- **Mobile Portrait**: Intuitive bottom-sheet controls for one-handed operation.
- **Mobile Landscape**: Adaptive vertical side-scroll menu for maximum AR visibility.

---

## 🔗 Connect & Links-

- **GitHub Repository**: [HandConnect on GitHub](https://github.com/Surendra77-pixel/HandConnect)
- **Developer LinkedIn**: [Surendra on LinkedIn](https://www.linkedin.com/in/surendra-pixel/)
- **Live Preview**: [Launch Experience](https://surendra77-pixel.github.io/HandConnect/)

---

### Buildby Surendra
*Redefining Touchless Interaction.*
