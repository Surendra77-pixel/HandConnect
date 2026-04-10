<div align="center">

# 🌌 AURAWEAVE
### ULTIMATE EDITION v3.5

[![Live Preview](https://img.shields.io/badge/🚀_LIVE_PREVIEW-DEPLOYS_INSTANTLY-00ffff?style=for-the-badge&logo=github)](https://Surendra77-pixel.github.io/HandConnect)
[![Status](https://img.shields.io/badge/STATUS-PRODUCTION_READY-00ff00?style=for-the-badge)](https://github.com/Surendra77-pixel/HandConnect)
[![Build](https://img.shields.io/badge/BUILD-3.5.0--ULTIMATE-ff00ff?style=for-the-badge)](https://github.com/Surendra77-pixel/HandConnect)

**Touchless AR interactivity — Entirely in your browser.**

---

[**🚀 OPEN LIVE PREVIEW**](https://Surendra77-pixel.github.io/HandConnect)  │  [**📖 DOCUMENTATION**](#🎯-what-is-this)  │  [**🛠️ INSTALLATION**](#🚀-getting-started)

---

</div>

---

## 🎯 What Is This?

**NEON AURA AR** is a browser-based Augmented Reality experience that uses your device camera to track your hands in real time and transforms your movements into stunning neon visual effects, interactive music, games, and art — with **zero app install, zero backend, zero frameworks.**

Just open a URL → grant camera permission → put your hands up → experience AR.

> Built with **HTML + CSS + Vanilla JavaScript** only. The entire intelligence comes from Google's MediaPipe and 8 native Web APIs. No React. No Node. No cloud.

---

## ✨ 35 Features Across 3 Versions

### 🔵 Core Features (v1.0)
| Feature | Description |
|---|---|
| 📷 **Live Camera Feed** | Mirrored real-time camera stream on full-screen canvas |
| 🦴 **Hand Skeleton** | Glowing neon lines connecting all 21 hand landmarks |
| ✨ **Particle Trails** | Fingertip particle effects with fade-out (500-particle pool) |
| 🌐 **Aura Halo** | Radial glow around palm that scales with finger spread |
| 🤌 **Gesture Detection** | 7 gestures: Open, Fist, Peace, Point, Pinch, Spread, ThumbsUp |
| 🎨 **5 Themes** | Rainbow, Cyberpunk, Lava, Ocean, Galaxy |
| 🔊 **Audio Drone** | Pitch-reactive ambient sound tied to hand spread |
| 📊 **Live HUD** | Real-time FPS, hands detected, gesture, spread % |

### 🟣 Enhanced Features (v2.0)
| Feature | Description |
|---|---|
| 🔗 **Two-Hand Connection** | Wrist beam + fingertip web lines between both hands |
| ⚡ **Energy Ball** | Glowing orb grows between hands as they approach |
| 🌀 **Portal Vortex** | Rotating ellipse rings when hands nearly touch |
| 📏 **Distance Meter** | Live ruler showing distance between both hands |
| 🎹 **Finger Piano** | Each finger plays a musical note (C4–G5 scale) |
| ✍️ **Draw Mode** | Paint with index finger, clear with peace sign |
| 💥 **Velocity Explosion** | Fast hand movement = particle burst |
| 🌊 **Ripple Effect** | Pinch release spawns expanding glow rings |
| 🪞 **Mirror Mode** | Ghost copy of your hand on opposite side |
| 📸 **Screenshot** | Capture + download your AR moment as PNG |
| 🖥️ **Fullscreen** | True fullscreen via requestFullscreen API |
| 🤙 **Gesture Theme Switch** | Change themes with hand signs — no buttons needed |

### 🔴 Ultimate Features (v3.0)
| Feature | Description |
|---|---|
| 🐇 **Shadow Puppet** | Dramatic hand silhouette on amber wall background |
| 👥 **Multiplayer** | Split-screen for two players with score system |
| 🎵 **Music Sync** | Upload MP3 — effects pulse to the beat |
| 🔮 **Kaleidoscope** | 4/6/8-way symmetric mirror of your hand |
| ⭐ **Constellation** | Deep space starfield with hand constellation mapping |
| 🔥 **Fire Hands** | Realistic upward fire particles from fingertips |
| 🎮 **RPS Battle** | Rock-Paper-Scissors game vs AI |
| 🥁 **Virtual Drums** | Tap screen zones to trigger drum sounds |
| 🎲 **AR Objects** | Spinning cube / orb that sits on your palm |
| 🤟 **ASL Trainer** | Real-time American Sign Language letter detection |
| 🖼️ **Paint Gallery** | Save your drawings as thumbnail collection |
| 🌦️ **Weather Reactive** | Visual effects match your real-time local weather |
| ⏱️ **Gesture Timer** | Control a countdown timer using only hand gestures |
| 🌐 **Share Graffiti** | Share your art via 6-character share code |
| 🕰️ **Ghost Trail** | Fading ghost replay of your last 2 seconds |
| ♿ **Accessibility** | Voice readout, high contrast, reduced motion |
| 📹 **Video Recording** | Record and download your session as WebM |
| 📐 **Calibration** | Personalize gesture detection to your hand size |
| 🌙 **Dark/Light UI** | Switch between dark cyberpunk and clean light UI |
| 📖 **Tutorial** | Interactive onboarding guide for first-time users |

---

## 🛠️ 8 Web APIs Used — Zero External Dependencies

This project is a masterclass in native browser capabilities:

```
┌─────────────────────────────────────────────────────────────────┐
│                     8 WEB APIS IN ACTION                        │
├──────────────────────┬──────────────────────────────────────────┤
│  WebRTC              │  getUserMedia() — camera access          │
│  Canvas API          │  2D rendering, particles, effects        │
│  Web Audio API       │  Oscillators, beat detection, drums      │
│  MediaRecorder API   │  Record canvas stream as WebM video      │
│  Web Speech API      │  Read gesture names aloud (a11y)        │
│  Geolocation API     │  Fetch user location for weather        │
│  Fetch API           │  Weather data from open-meteo.com        │
│  localStorage API    │  Save gallery, share codes, settings    │
└──────────────────────┴──────────────────────────────────────────┘
```

**External Library Used: 1** — Google MediaPipe Hands (CDN only)

---

## 🧠 How It Works — The Full Architecture

### System Flow (Every Frame, 60 Times Per Second)

```
📷 Device Camera
       │
       ▼
┌─────────────────┐
│   tracker.js    │  ← MediaPipe Hands processes video frame
│   (EYES)        │    Returns 21 (x,y,z) landmarks per hand
└────────┬────────┘
         │  21 landmarks × 2 hands
         ▼
┌─────────────────┐
│  gestures.js    │  ← Analyzes landmark positions
│  (BRAIN)        │    Detects: Open/Fist/Peace/Point/Pinch
└────────┬────────┘    Calculates: spread%, velocity, distance
         │  gesture data + landmark positions
         ▼
┌─────────────────┐
│    app.js       │  ← Master controller
│   (HEART)       │    Coordinates all modules each frame
└────┬────────┬───┘    Routes data to renderer + audio + ui
     │        │
     ▼        ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│renderer  │  │ audio.js │  │  ui/     │  │ modes/   │
│.js       │  │ (VOICE)  │  │ (FACE)   │  │ effects/ │
│(HANDS)   │  │          │  │          │  │(SKILLS)  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
     │              │              │              │
     └──────────────┴──────────────┴──────────────┘
                          │
                          ▼
                   👁️ USER SEES IT
```

### MediaPipe Hand Landmarks

```
        8   12  16  20
        │    │   │   │
    4   7   11  15  19
    │   │    │   │   │
    3   6   10  14  18
    │   │    │   │   │
    2   5    9  13  17
     \  │    │   │  /
      \ │    │   │ /
       \│    │   │/
        1    │   │
         \   │  /
          \  │ /
           \ │/
            0  ← WRIST
```

Each number is a landmark with `x`, `y`, `z` coordinates. The gestures.js module reads these 21 points and infers what shape your hand is making.

---

## 🗂️ Full Project Structure

```
HandConnect/
│
├── 📄 index.html                   ← Single HTML entry point
├── 🎨 style.css                    ← All UI + overlay styling
├── 📖 README.md                    ← This file
│
├── 🧠 Core Modules
│   ├── app.js                      ← Master controller & render loop
│   ├── tracker.js                  ← MediaPipe setup & camera init
│   ├── renderer.js                 ← Canvas drawing engine
│   ├── gestures.js                 ← Gesture classification logic
│   ├── audio.js                    ← Web Audio drone engine
│   ├── themes.js                   ← 5 theme color definitions
│   └── particles.js                ← Object pool (500 particles)
│
├── ✨ effects/                      ← Visual effect modules
│   ├── interHand.js                ← Two-hand beam + web lines
│   ├── energyBall.js               ← Energy orb between hands
│   ├── portal.js                   ← Swirling portal vortex
│   ├── ripple.js                   ← Expanding ring waves
│   ├── explosion.js                ← Velocity particle burst
│   └── mirror.js                   ← Ghost mirror rendering
│
├── 🎮 modes/                       ← Interactive mode modules
│   ├── drawMode.js                 ← Finger paint on canvas
│   ├── pianoMode.js                ← Finger piano (C4–G5)
│   ├── drumsMode.js                ← Virtual drum pads
│   ├── puppetMode.js               ← Shadow puppet silhouette
│   ├── kaleidoMode.js              ← Kaleidoscope symmetry
│   ├── constellationMode.js        ← Star map overlay
│   ├── fireMode.js                 ← Fire particle hands
│   ├── arObjectMode.js             ← 3D objects on palm
│   └── multiplayerMode.js          ← Split-screen two player
│
├── 🎲 games/
│   ├── rpsGame.js                  ← Rock Paper Scissors vs AI
│   └── aslTrainer.js               ← Sign language detector
│
├── 🖥️ ui/                          ← Interface components
│   ├── hud.js                      ← Live stats bar
│   ├── toast.js                    ← Gesture notifications
│   ├── screenshot.js               ← PNG capture + download
│   ├── gallery.js                  ← Drawing thumbnail gallery
│   ├── tutorial.js                 ← First-time onboarding
│   ├── calibration.js              ← Hand size calibration
│   └── accessibility.js            ← A11y + voice mode
│
├── 🔧 utils/                       ← Utility modules
│   ├── recorder.js                 ← MediaRecorder WebM export
│   ├── weather.js                  ← open-meteo.com API fetch
│   ├── musicSync.js                ← AnalyserNode beat detection
│   ├── ghostTrail.js               ← Movement history replay
│   └── shareCode.js                ← localStorage share system
│
└── 📁 assets/
    └── favicon.ico
```

---

## 🎓 8 Skill Domains This Project Covers

### 1. 👁️ Computer Vision
- MediaPipe Hands neural network tracks **21 hand landmarks per hand**
- Supports **2 simultaneous hands** at **60 FPS**
- `(x, y, z)` 3D coordinates normalized to canvas space
- Custom gesture classifier built on landmark ratios
- Hand velocity calculation using position delta over 5 frames

### 2. 🎨 Real-Time Graphics Engineering
- HTML5 Canvas `2D Context` renders every frame
- `requestAnimationFrame` loop with delta-time tracking
- `ctx.shadowBlur` + `ctx.shadowColor` for GPU-accelerated glow
- Linear and radial gradients for smooth color transitions
- **Object Pool Pattern** — 500 pre-allocated particles reused every frame to eliminate garbage collection lag
- Bezier curve drawing for organic inter-hand connections

### 3. 🔊 Digital Signal Processing / Audio
- Web Audio API `OscillatorNode` for all sound synthesis
- `BiquadFilterNode` for tone shaping
- `AnalyserNode` with FFT for real-time beat detection
- Exponential gain ramp for natural note decay (finger piano)
- Synthesized drum sounds (kick, snare, hihat, tom, cymbal)
- Pitch modulation tied to hand spread percentage (0–400 Hz)

### 4. 🎮 Game Development
- Rock-Paper-Scissors state machine (idle → countdown → reveal → result)
- Multiplayer zone detection with score tracking
- Virtual drums with tap velocity detection
- ASL letter practice mode with match validation
- Gesture-based timer with arc progress rendering

### 5. 🖌️ UI/UX Design
- Dark cyberpunk aesthetic with neon color system
- CSS custom properties (`--ui-bg`, `--ui-text`, `--ui-accent`)
- Responsive layout for desktop + tablet + mobile
- Toast notification system for gesture feedback
- Interactive onboarding tutorial flow
- Theme switcher with 5 distinct color palettes
- Dark/light UI mode toggle

### 6. 🌐 API Integration
- `navigator.geolocation` → user coordinates
- `fetch()` → open-meteo.com free weather API
- Weather code → effect mapping (rain/snow/storm/sun)
- `localStorage` for gallery persistence + share codes
- Web Speech API `SpeechSynthesisUtterance` for voice readout

### 7. ⚡ Performance Engineering
- **Target: 60 FPS on all modern hardware**
- Particle pool eliminates heap allocations in render loop
- `devicePixelRatio` scaling for crisp retina rendering
- Early-exit rendering when no hands detected
- Canvas layer compositing (video + drawing + effects)
- Frame budget: every effect designed to complete in < 16ms

### 8. 🚀 DevOps & Deployment
- Zero build step — pure static files
- GitHub Pages CI/CD — auto-deploys on every `git push`
- Single URL shareable globally — no app store needed
- Camera permission fallback + error handling
- AudioContext resume on user gesture (browser autoplay policy)
- `localStorage` flag for first-visit tutorial detection

---

## 🚀 Getting Started

### Option 1 — Use Live Demo (Easiest)
👉 **[Click Here → github.com/Surendra77-pixel/HandConnect](https://github.com/Surendra77-pixel/HandConnect)**

1. Click **"Enter Experience"**
2. Allow camera permission
3. Put your hands in front of the camera
4. 🔥 You're in AR

### Option 2 — Run Locally
```bash
# Clone the repository
git clone https://github.com/Surendra77-pixel/HandConnect.git

# Navigate into it
cd HandConnect

# Open in browser (no build step needed!)
open index.html
# OR serve with any static server:
npx serve .
```

> ⚠️ Camera access requires HTTPS or localhost. Direct `file://` opening may not work in all browsers.

---

## 🤌 Gesture Reference

| Gesture | How To Do It | Effect |
|---|---|---|
| ✋ **Open Hand** | All 5 fingers spread wide | Full aura halo, Rainbow theme |
| ✊ **Fist** | Curl all fingers | Particle explosion burst |
| ✌️ **Peace** | Index + middle up | Cyberpunk theme |
| 👆 **Point** | Index finger only | Draw mode, Ocean theme |
| 🤏 **Pinch** | Thumb + index close | Ripple wave, Galaxy theme |
| 🤙 **Spread** | Max finger spread | Audio pitch rises, energy aura |
| 👍 **Thumbs Up** | Thumb up, others curled | Lava theme |

---

## 🎨 Theme Gallery

| Theme | Primary Color | Vibe |
|---|---|---|
| 🌈 Rainbow | Animated hue cycle | Joyful, energetic |
| ⚡ Cyberpunk | `#00ffff` / `#ff00ff` | Futuristic, electric |
| 🌋 Lava | `#ff4500` / `#ff8c00` | Intense, dramatic |
| 🌊 Ocean | `#00bfff` / `#7fffd4` | Calm, flowing |
| 🌌 Galaxy | `#9b59b6` / `#3498db` | Mysterious, cosmic |

---

## 📊 Project Stats

```
┌─────────────────────────────────┐
│         PROJECT METRICS         │
├─────────────────┬───────────────┤
│ Total Features  │      35       │
│ JS Modules      │      30+      │
│ Lines of Code   │   ~5,000      │
│ Web APIs Used   │       8       │
│ Frameworks      │       0       │
│ Backend         │       0       │
│ Build Tools     │       0       │
│ Ext. Libraries  │       1       │
│ Target FPS      │      60       │
│ Hands Tracked   │       2       │
│ Landmarks/Hand  │      21       │
│ Gestures        │       7       │
│ Themes          │       5       │
└─────────────────┴───────────────┘
```

---

---

## 🏗️ How Each Layer Works Together

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 1 — INPUT (tracker.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MediaPipe reads camera frames at 60fps
Outputs 21 (x,y,z) landmarks per hand
Passes raw data up to app.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 2 — INTELLIGENCE (gestures.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Receives 21 landmarks
Computes: finger states (up/down)
Calculates: spread %, velocity, palm center
Classifies: current gesture name
Passes enriched data to app.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 3 — COORDINATION (app.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Master render loop runs every frame
Routes landmark + gesture data to:
→ renderer.js  (what to draw)
→ audio.js     (what to play)
→ ui/hud.js    (what to display)
→ active mode  (draw/piano/drums etc)
→ effects/     (which effects to run)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 4 — OUTPUT (renderer.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Clears canvas each frame
Draws: video feed (mirrored)
Draws: hand skeleton + landmark nodes
Draws: aura halo + particle trails
Draws: active effects (ripple/portal/fire)
Draws: inter-hand connections (2 hands)
Composites all canvas layers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 5 — INTERACTIVE MODES (v3.0 Ultimate)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 RPS Battle: Close both fists to start countdown. Show Hand sign to play!
🎹 Piano: Tip of each finger corresponds to a note (C Major scale).
🥁 Virtual Drums: Tap the color pads at the bottom of the screen.
🤟 ASL Trainer: Match the letter shown in the holographic box.
🌦️ Weather: Automatically syncs visuals to your local wind/rain data.
```

---

## 🚀 Live Preview & Deployment

### Ready for GitHub Pages
This project is configured for **instant deployment**. To host your own live preview:

1.  **Fork/Clone** this repository.
2.  Go to your Repository **Settings** > **Pages**.
3.  Set **Source** to `Deploy from a branch` and select `main`.
4.  Your site will be live at `https://[your-username].github.io/HandConnect/` in seconds!

> [!IMPORTANT]
> **HTTPS is required**: Modern browsers require a secure connection to access the camera. GitHub Pages provides this by default.

---

## 🤌 Ultimate Feature Usage Guide

| Mode | How to Activate | How to Interact |
|---|---|---|
| **🎨 Draw** | Click "DRAW" in sidebar | Use **Point** sign (index finger) to paint. Clear with **Peace** sign. |
| **🎹 Piano** | Click "PIANO" in sidebar | Each fingertip generates a sound. Spread fingers for pitch bends. |
| **🐉 Shadow** | Click "PUPPET" in sidebar | Transforms your hand into a 2D shadow silhouette on a glowing wall. |
| **🌌 Constellation**| Click "STARS" in sidebar | Connects your fingertips with galactic star-lines in deep space. |
| **🎮 RPS Battle** | Click "BATTLE" in sidebar | Wait for the 3-second timer, then show Rock (Fist), Paper (Open), or Scissors (Peace). |
| **🤟 ASL Trainer** | Click "ASL" in sidebar | Mimic the letter shown in the top-right holographic interface. |
| **🌦️ Weather** | Click "WEATHER" in sidebar | Uses your GPS to adapt effects (Snow particles for cold, Thunder for storms). |
| **📸 Gallery** | Click "GALLERY" in sidebar | View all your saved snapshots from the current session. |

---

## 📜 License

MIT License — free to use, modify, and distribute for any purpose.

---

## 🙌 Author

Built with ❤️ by **Manthan**
[GitHub Profile](https://github.com/Surendra77-pixel)

<div align="center">

**Project Status: Ready for Production**
**Build: 3.5.0-Ultimate**

</div>
