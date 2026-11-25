# Mark Oyster J — ECE & Hardware Engineering Portfolio

Personal portfolio website for **Mark Oyster J**, an Electronics and Communication Engineering (ECE) student and hardware engineer based in Chennai, India, showcasing FPGA systems, embedded firmware, VLSI/AI, IoT telemetry, and RF circuit projects.

Built with vanilla **HTML5**, **CSS3**, **JavaScript**, and **WebGL2**—no build step required.

---

## ✨ Features

- **Full-Page WebGL2 Aurora Background (`Aurora.js` / `Aurora.css`)**
  - Custom WebGL2 shader background with smooth multi-layer curtains (`#7c3aed`, `#ef4444`, `#8a5cff`), interactive pointer response, and `prefers-reduced-motion` support.
- **Switchable Theme (`Aurora` ↔ `Classic`)**
  - Toggle button in the footer (`#themeSwitchBtn`) switches between **Aurora Theme** (dark background with crisp white body text) and **Classic Theme** (`#FBF8CC` pale-yellow background with `#4c1d95` purple body text), persisted via `localStorage`.
- **Animated Gradient Titles (`GradientText.js` / `GradientText.css`)**
  - Flowing 7-color mesh gradient (`#5227FF`, `#FF9FFC`, `#B497CF`, `#40ffaa`, `#4079ff`, `#ffd93d`, `#ff6b6b`) with soft glow applied exclusively to headings and titles.
- **Interactive Dual-Photo Hero Portrait**
  - Smooth `0.5s` fade and subtle zoom transition between professional and candid portraits on hover (desktop) or tap/keyboard (mobile & accessibility), paired with a color-shifting `MARK OYSTER` indicator pill.
- **Project Showcase & Detail Modals**
  - Interactive project cards with full technical breakdowns, metrics, and a built-in Resume modal.
- **Scroll-Triggered Fade-In Animations**
  - Lightweight `IntersectionObserver` transitions across sections and cards.
- **Contact Section**
  - One-click email copy with toast notification, social links (Instagram, GitHub, LinkedIn), and an interactive message form.

---

## 📂 Project Structure

```text
PORTFOLIO/
├── index.html          # Main portfolio markup
├── style.css           # Core styles, responsive layout, Aurora & Classic themes
├── script.js           # Navigation, photo switcher, modals, scroll animations, theme toggle
├── Aurora.js           # Vanilla WebGL2 Aurora background engine
├── Aurora.css          # Aurora container & full-page background layer styles
├── Aurora.jsx          # React component reference for Aurora
├── GradientText.js     # Vanilla JS flowing gradient text animation engine
├── GradientText.css    # GradientText clip & glow styles
├── GradientText.jsx    # React component reference for GradientText
├── DESIGN.PO.txt       # Design tokens & layout reference
├── assets/             # Portfolio images & portraits
└── README.md           # Project documentation
```

---

## 🚀 Running Locally

Because this is a static site, no package installation or bundler is required:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/markoyster23/<your-repo-name>.git
   cd <your-repo-name>
   ```
2. **Open in a browser** directly via `index.html`, or run any local static server (for example, VS Code Live Server or Python):
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**, choose `main` (and `/ (root)`), and click **Save**.
4. Your portfolio will be live at `https://markoyster23.github.io/<your-repo-name>/`.

---

## 📬 Contact

- **Email:** [10328.markoyster@gmail.com](mailto:10328.markoyster@gmail.com)
- **GitHub:** [github.com/markoyster23](https://github.com/markoyster23)
- **LinkedIn:** [linkedin.com/in/mark-oyster-j-5266622b6](https://www.linkedin.com/in/mark-oyster-j-5266622b6/)
- **Instagram:** [instagram.com/markoyster23](https://www.instagram.com/markoyster23/)
