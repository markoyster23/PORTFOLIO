/**
 * React Bits — GradientText Component (Vanilla JS Implementation)
 * https://reactbits.dev
 *
 * Replicates the exact rendering and animation logic from the React Bits component:
 * - 'flow' variant with radial ellipse blobs and continuous mesh motion
 * - 'linear' and 'conic' variants
 * - Interactive pointer tracking with spring physics & stiffness
 * - Smooth requestAnimationFrame loop
 * - IntersectionObserver viewport optimization
 * - Accessibility: prefers-reduced-motion check
 */

(function () {
  'use strict';

  const VARIANTS = ['linear', 'flow', 'conic'];
  const ANGLES = { horizontal: 90, vertical: 180, diagonal: 135 };
  const TAU = Math.PI * 2;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function initGradientTextElement(root) {
    if (!root || root.dataset.gtInitialized === 'true') return;
    root.dataset.gtInitialized = 'true';

    // Parse configuration from attributes or defaults
    // Updated 7-color palette: ["#5227FF", "#FF9FFC", "#B497CF", "#40ffaa", "#4079ff", "#ffd93d", "#ff6b6b"]
    let colors = ["#5227FF", "#FF9FFC", "#B497CF", "#40ffaa", "#4079ff", "#ffd93d", "#ff6b6b"];
    if (root.dataset.colors) {
      try {
        colors = JSON.parse(root.dataset.colors);
      } catch (e) {
        colors = root.dataset.colors.split(',').map((c) => c.trim());
      }
    }
    const palette = colors.length > 1 ? colors : [colors[0] || '#ffffff', colors[0] || '#ffffff'];

    const animationSpeed = parseFloat(root.dataset.animationSpeed) || 8;
    const variant = root.dataset.variant || 'flow';
    const angle = parseFloat(root.dataset.angle) || 90;
    const direction = root.dataset.direction;
    const scale = clamp(parseFloat(root.dataset.scale) || 3, 1, 6);
    const yoyo = root.dataset.yoyo !== 'false';
    const glow = root.dataset.glow !== undefined ? parseFloat(root.dataset.glow) : 0.4;
    const pauseOnHover = root.dataset.pauseOnHover === 'true';
    const followPointer = root.dataset.followPointer !== 'false';

    const settings = {
      colors: palette,
      speed: Math.max(0.2, animationSpeed),
      variant: VARIANTS.includes(variant) ? variant : 'flow',
      angle: direction ? (ANGLES[direction] ?? angle) : angle,
      scale: scale,
      yoyo: yoyo,
      pauseOnHover: pauseOnHover,
      followPointer: followPointer
    };

    root.style.setProperty('--gt-glow', clamp(glow, 0, 1));
    root.style.setProperty('--gt-border', (root.dataset.borderWidth || '1.5') + 'px');

    // Structural elements (.gradient-text__inner & .gradient-text__content)
    let inner = root.querySelector('.gradient-text__inner');
    let content = root.querySelector('.gradient-text__content');

    if (!inner) {
      inner = document.createElement('span');
      inner.className = 'gradient-text__inner';
      while (root.firstChild) {
        inner.appendChild(root.firstChild);
      }
      root.appendChild(inner);
    }

    if (!content) {
      content = document.createElement('span');
      content.className = 'gradient-text__content';
      while (inner.firstChild) {
        content.appendChild(inner.firstChild);
      }
      inner.appendChild(content);
    }

    // Glow element for luminous bloom without duplicate text in layout
    let glowEl = inner.querySelector('.gradient-text__glow');
    if (glow > 0 && !glowEl) {
      glowEl = document.createElement('span');
      glowEl.className = 'gradient-text__glow';
      glowEl.setAttribute('aria-hidden', 'true');
      glowEl.innerHTML = content.innerHTML;
      inner.appendChild(glowEl);
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = {
      time: 0,
      inside: false,
      visible: true,
      x: 0.5,
      y: 0.5,
      px: 0.5,
      py: 0.5,
      vx: 0,
      vy: 0,
      pull: 0
    };

    let raf = 0;
    let last = performance.now();
    let alive = true;

    const paint = () => {
      const s = settings;
      const list = s.colors;
      const cycle = state.time / s.speed;
      let image;

      if (s.variant === 'flow') {
        const blobs = list.map((color, i) => {
          const spin = cycle * TAU;
          const rate = 0.55 + ((i * 0.618) % 1) * 0.5;
          let x = 50 + 44 * Math.sin(spin * rate + i * 2.1);
          let y = 50 + 40 * Math.sin(spin * (rate * 0.83 + 0.21) + i * 1.3);
          if (i === 0) {
            x += (state.px * 100 - x) * state.pull;
            y += (state.py * 100 - y) * state.pull;
          }
          return `radial-gradient(ellipse ${(22 + 12 * s.scale).toFixed(1)}% ${(60 + 30 * s.scale).toFixed(1)}% at ${x.toFixed(2)}% ${y.toFixed(2)}%, ${color} 0%, transparent 100%)`;
        });
        image = `${blobs.join(', ')}, linear-gradient(${s.angle}deg, ${list.join(', ')})`;
      } else if (s.variant === 'conic') {
        const sway = s.yoyo ? Math.sin(cycle * Math.PI) * 50 : cycle * 360;
        const cx = 50 + (state.px * 100 - 50) * state.pull;
        const cy = 260 + (state.py * 100 - 260) * state.pull;
        image = `repeating-conic-gradient(from ${(sway - 30).toFixed(2)}deg at ${cx.toFixed(2)}% ${cy.toFixed(2)}%, ${[...list, list[0]].map((color, i) => `${color} ${((i / list.length) * 60 * (3 / s.scale)).toFixed(2)}deg`).join(', ')})`;
      } else {
        const loop = [...list, list[0]];
        const period = 100 * s.scale;
        let offset;
        if (s.yoyo) {
          const swing = cycle % 2;
          const t = swing < 1 ? swing : 2 - swing;
          offset = (0.5 - Math.cos(Math.PI * t) / 2) * (period - 100);
        } else {
          offset = (cycle % 1) * period;
        }
        offset += (state.px - 0.5) * period * 0.5 * state.pull;
        const stops = loop.map((color, i) => `${color} ${((i / (loop.length - 1)) * period - offset).toFixed(2)}%`);
        image = `repeating-linear-gradient(${s.angle}deg, ${stops.join(', ')})`;
      }

      root.style.setProperty('--gt-gradient', image);
    };

    const tick = (now) => {
      raf = 0;
      if (!alive) return;
      const s = settings;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      const paused = reduce || (s.pauseOnHover && state.inside);
      if (!paused) state.time += dt;

      const target = s.followPointer && state.inside ? 1 : 0;
      state.pull += (target - state.pull) * (1 - Math.exp(-dt * 6));
      const stiffness = 160;
      state.vx += ((state.x - state.px) * stiffness - state.vx * 2 * Math.sqrt(stiffness)) * dt;
      state.vy += ((state.y - state.py) * stiffness - state.vy * 2 * Math.sqrt(stiffness)) * dt;
      state.px += state.vx * dt;
      state.py += state.vy * dt;

      paint();

      const settling = Math.abs(state.pull - target) > 0.001 || Math.abs(state.vx) + Math.abs(state.vy) > 0.001;
      if (!state.visible || (paused && !settling)) return;
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const locate = (event) => {
      const rect = root.getBoundingClientRect();
      state.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      state.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    };

    const onEnter = (event) => {
      locate(event);
      if (!state.inside) {
        state.px = state.x;
        state.py = state.y;
      }
      state.inside = true;
      wake();
    };

    const onMove = (event) => {
      locate(event);
      wake();
    };

    const onLeave = () => {
      state.inside = false;
      wake();
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        state.visible = entries.some((entry) => entry.isIntersecting);
        if (state.visible) wake();
      });
      observer.observe(root);
    } else {
      state.visible = true;
    }

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);

    paint();
    wake();
  }

  function initAllGradientTexts() {
    const elements = document.querySelectorAll('.gradient-text');
    elements.forEach(initGradientTextElement);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllGradientTexts);
  } else {
    initAllGradientTexts();
  }

  window.initGradientText = initAllGradientTexts;
})();
