/**
 * Mark Oyster J — Personal Portfolio Interactive Scripts
 * Adheres to DESIGN.PO.txt interaction states & dynamic features
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // 2. Interactive Profile Photo Tap Switcher (Mobile & Keyboard Accessibility)
  const profileContainer = document.getElementById('profileContainer');
  if (profileContainer) {
    // Tap / Click interaction for mobile devices & tablets
    profileContainer.addEventListener('click', (e) => {
      profileContainer.classList.toggle('active-real');
    });

    // Keyboard interaction (Enter or Space)
    profileContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        profileContainer.classList.toggle('active-real');
      }
    });

    // When mouse leaves on desktop, remove active-real state to seamlessly revert to Professional photo
    profileContainer.addEventListener('mouseleave', () => {
      profileContainer.classList.remove('active-real');
    });
  }

  // 3. Cinematic Scroll-Triggered Fade-In Transitions (IntersectionObserver)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const animTargets = document.querySelectorAll(
      '.section-heading-wrapper, .about-intro-box, .timeline-entry, .extra-card, .work-intro-box, .project-card, .skills-lead, .skill-category-card, .contact-card-frame, .contact-details-col'
    );

    animTargets.forEach((el) => {
      el.classList.add('fade-in-on-scroll');
      
      // Subtle stagger delay for child items in grids
      if (el.classList.contains('project-card') || el.classList.contains('skill-category-card') || el.classList.contains('extra-card')) {
        const parent = el.parentElement;
        if (parent) {
          const index = Array.from(parent.children).indexOf(el);
          if (index % 2 === 1) {
            el.classList.add('stagger-2');
          } else {
            el.classList.add('stagger-1');
          }
        }
      }
    });

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    animTargets.forEach(el => scrollObserver.observe(el));
  }

  // 4. Active Section Highlighting on Scroll
  const sections = document.querySelectorAll('section[id], header[id="top"]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current || (current === 'hero' && href === 'top')) {
        link.classList.add('active');
      }
    });
  });

  // 3. Resume Button Interaction (Figma Pressed State & Modal View)
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('mousedown', () => {
      resumeBtn.classList.add('pressed');
    });
    resumeBtn.addEventListener('mouseup', () => {
      resumeBtn.classList.remove('pressed');
    });
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  // 4. Modal System (Project Details & Resume)
  const modalBackdrop = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(contentHtml) {
    if (modalBackdrop && modalContent) {
      modalContent.innerHTML = contentHtml;
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Project In-Depth Data
  const projectData = {
    noc: {
      title: 'Real-Time Collision Avoidance Network-on-Chip (NoC)',
      subtitle: 'FPGA Hardware Acceleration on PYNQ-Z2 &middot; 4-Core 2&times;2 Mesh',
      tags: ['Vitis HLS', 'Vivado', 'PYNQ-Z2', 'C++', 'Python', 'HC-SR04 Ultrasonic'],
      overview: 'Engineered during a high-stakes 24-hour hackathon, this hardware accelerator realizes a real-time obstacle detection and emergency vehicle braking pipeline mapped directly onto a 2&times;2 Network-on-Chip FPGA fabric.',
      highlights: [
        '<strong>100 MHz Timing Closure:</strong> Successfully achieved complete timing closure on Xilinx Zynq-7000 SoC architecture with zero failing setup or hold endpoints.',
        '<strong>Adaptive QoS Packet Priority:</strong> Implemented packet-switched routing arbitration where emergency obstacle proximity messages preempt standard telemetry data.',
        '<strong>Sensor-to-Actuator Loop:</strong> HC-SR04 pulse timing, moving-average distance filtering, and danger threshold classifier run concurrently in hardware cores, producing instantaneous SAFE, CAUTION, and EMERGENCY STOP commands.',
        '<strong>Hardware-Software Co-Design:</strong> High-level synthesis (Vitis HLS) C++ cores interfaced via AXI4-Stream interconnected with Python control overlay on ARM Cortex-A9.'
      ],
      metrics: 'Latency: < 0.8 ms &middot; Clock: 100 MHz &middot; Slices Utilized: 68% on Zynq-7000'
    },
    iot: {
      title: 'IoT Smart Production Monitoring & Predictive Maintenance',
      subtitle: 'Industrial Machine Health & Vibration Telemetry &middot; Edge Anomaly Detection',
      tags: ['ESP32', 'MQTT', 'Python', 'Jupyter', 'Tableau', 'Time Series CNN'],
      overview: 'An industrial 4.0 monitoring ecosystem capturing multi-axis vibration, surface thermal gradients, and motor current draws to preemptively isolate bearing anomalies and mechanical fatigue.',
      highlights: [
        '<strong>Edge Data Acquisition:</strong> High-sampling ESP32 firmware interfaced with accelerometer, thermocouple, and current transformer sensors.',
        '<strong>Lightweight Anomaly Classification:</strong> Deployed a 1D Convolutional Neural Network trained on mechanical vibration waveforms to classify normal operation vs. imbalance and bearing deterioration.',
        '<strong>MQTT Telemetry Pipeline:</strong> Publish-subscribe broker infrastructure streaming live machine status into interactive Tableau dashboards and Python analytics notebooks.',
        '<strong>Operational Impact:</strong> Projected to decrease unscheduled industrial machine downtime by 35% through early stage condition alerts.'
      ],
      metrics: 'Sampling Rate: 1 kHz &middot; Transmission: MQTT over TLS &middot; Anomaly Precision: 94.2%'
    },
    ecg: {
      title: 'Low-Power VLSI ECG Res-ViT Arrhythmia Detection',
      subtitle: 'Dilated Residual CNN + Vision Transformer for Ultra-Low Power Edge Silicon',
      tags: ['TensorFlow', 'Keras', 'Scikit-Learn', 'Flask', 'Bayesian Optimization'],
      overview: 'A biomedical machine learning pipeline engineered specifically with low computational footprint requirements for eventual VLSI hardware integration and wearable health monitors.',
      highlights: [
        '<strong>Hybrid Res-ViT Architecture:</strong> Synergizes 1D dilated residual convolutional layers for local QRS complex morphological extraction with Vision Transformer self-attention for long-range rhythm dependency.',
        '<strong>Multi-Class Clinical Classification:</strong> Differentiates between Normal Sinus Rhythm (NSR), Arrhythmia (ARR), and Congestive Heart Failure (CHF) on standard 128 Hz ECG lead recordings.',
        '<strong>Bayesian Hyperparameter Tuning:</strong> Optimized filter counts, dilation rates, and transformer attention heads using Keras Tuner with Stratified 5-Fold Cross-Validation.',
        '<strong>Hardware Target:</strong> Quantization-aware training targeting 8-bit integer fixed-point DSP slices for wearable FPGA/ASIC acceleration.'
      ],
      metrics: 'Dataset: PhysioNet MIT-BIH &middot; F1-Score: 98.4% &middot; Precision: 98.7%'
    },
    fm: {
      title: '3-Stage Long-Range RF FM Transmitter',
      subtitle: 'Audio Preamplifier, RF Oscillator & Class-C Power Amplifier',
      tags: ['LTspice', 'MATLAB', 'RF Analog', 'LC Tank Oscillator', 'Antenna Matching'],
      overview: 'Comprehensive analog radio-frequency hardware design project focused on signal integrity, tank tuning, carrier stability, and power efficiency across VHF frequencies.',
      highlights: [
        '<strong>3-Stage Architecture:</strong> Audio preamplifier for microphonic signal conditioning, LC tank oscillator with varactor tuning for clean frequency modulation, and a resonant Class-C power amplifier stage.',
        '<strong>Harmonic & Spurious Suppression:</strong> Pi-network low-pass filtering and impedance matching network between driver stage and 50-ohm dipole antenna.',
        '<strong>Rigorous SPICE Simulation:</strong> Conducted transient, AC frequency sweep, and Monte Carlo tolerance simulations in LTspice, validating carrier frequency stability within +/- 5 kHz.',
        '<strong>Transmission Distance:</strong> Designed to achieve an effective radiated power supporting a wireless broadcast range of up to 1 kilometer.'
      ],
      metrics: 'Carrier Frequency: 88–108 MHz VHF &middot; Range: Up to 1 km &middot; Efficiency: > 65% Class-C'
    }
  };

  // Attach click listener to Project Cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectKey = card.getAttribute('data-project');
      const data = projectData[projectKey];
      if (data) {
        const modalHtml = `
          <div class="modal-project-view">
            <span class="modal-tag">Hardware Engineering Spotlight</span>
            <h2 class="modal-title">${data.title}</h2>
            <p class="modal-subtitle">${data.subtitle}</p>
            <div class="modal-tags">
              ${data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            
            <hr class="modal-divider">

            <div class="modal-section">
              <h3>System Overview</h3>
              <p>${data.overview}</p>
            </div>

            <div class="modal-section">
              <h3>Key Engineering Implementations</h3>
              <ul class="modal-highlights">
                ${data.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>

            <div class="modal-metrics-box">
              <strong>Key Performance Metrics:</strong>
              <p>${data.metrics}</p>
            </div>
          </div>
        `;
        openModal(modalHtml);
      }
    });
  });

  // Resume Modal Builder
  function openResumeModal() {
    const resumeHtml = `
      <div class="modal-resume-view">
        <div class="resume-header">
          <h2 class="resume-name">Mark Oyster J</h2>
          <p class="resume-contact">Chennai, India &middot; <a href="mailto:10328.markoyster@gmail.com" style="color: inherit; text-decoration: underline;">10328.markoyster@gmail.com</a> &middot; +91 96290 53736</p>
          <p class="resume-contact" style="margin-top: 2px;"><a href="https://github.com/markoyster23" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">github.com/markoyster23</a> &middot; <a href="https://www.linkedin.com/in/mark-oyster-j-5266622b6/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">linkedin.com/in/mark-oyster-j</a></p>
          <p class="resume-objective">Electronics & Communication Engineering &middot; Saveetha Engineering College (CGPA 7.91)</p>
        </div>

        <hr class="modal-divider">

        <div class="resume-block">
          <h3 class="resume-heading">Core Competencies</h3>
          <p><strong>Hardware & VLSI:</strong> FPGA Architecture (PYNQ-Z2), Vitis HLS, Vivado, Cadence Virtuoso, LTspice, KiCAD, Altium Designer, PCB Stackup Design, Timing Closure.</p>
          <p><strong>Firmware & Protocols:</strong> Embedded C, Python 3, UART/USART, SPI, I2C, CAN Bus, MQTT, LoRa, Arduino, ESP32.</p>
          <p><strong>Software & Cloud:</strong> AWS EC2/S3, GCP, Docker, Git, TensorFlow, Scikit-learn, Tableau, Cisco Packet Tracer.</p>
        </div>

        <div class="resume-block">
          <h3 class="resume-heading">Work Experience</h3>
          <div class="resume-item">
            <div class="resume-item-header">
              <strong>Inplant Trainee &mdash; Code Bind Technologies</strong>
              <span>Jun&ndash;Aug 2024</span>
            </div>
            <p>Integrated embedded hardware, wrote C firmware for microcontroller-based IoT prototypes, executed sensor validation, and collaborated on hardware-in-the-loop testing.</p>
          </div>
        </div>

        <div class="resume-block">
          <h3 class="resume-heading">Education</h3>
          <div class="resume-item">
            <div class="resume-item-header">
              <strong>B.E. Electronics and Communication Engineering &mdash; Saveetha Engineering College</strong>
              <span>2023&ndash;2027</span>
            </div>
            <p>CGPA: <strong>7.91</strong> &middot; Focus in VLSI, Digital Signal Processing, Embedded Systems</p>
          </div>
          <div class="resume-item">
            <div class="resume-item-header">
              <strong>Higher Secondary Certificate (XII) &mdash; Don Bosco Mat. Hr. Sec. School</strong>
              <span>2022&ndash;2023</span>
            </div>
            <p>Percentage: <strong>87.7%</strong></p>
          </div>
        </div>

        <div class="resume-actions">
          <button class="resume-print-btn" onclick="window.print()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print / Save as PDF
          </button>
        </div>
      </div>
    `;
    openModal(resumeHtml);
  }

  // 5. Copy Email to Clipboard with Toast
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message) {
    if (toastNotification && toastMessage) {
      toastMessage.textContent = message;
      toastNotification.classList.add('visible');
      setTimeout(() => {
        toastNotification.classList.remove('visible');
      }, 3000);
    }
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = '10328.markoyster@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email copied to clipboard!');
        }).catch(() => {
          showToast('Email: 10328.markoyster@gmail.com');
        });
      } else {
        showToast('Email: 10328.markoyster@gmail.com');
      }
    });
  }

  // 6. Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const message = document.getElementById('messageBody').value;

      // Construct mailto link as fallback & prompt feedback
      const mailtoLink = `mailto:10328.markoyster@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
      
      if (formStatus) {
        formStatus.textContent = 'Opening your email client... Thank you!';
        formStatus.className = 'form-status success';
      }

      window.location.href = mailtoLink;
      showToast('Opening default email client...');
      contactForm.reset();

      setTimeout(() => {
        if (formStatus) formStatus.textContent = '';
      }, 5000);
    });
  }

  // 7. Update Footer Year dynamically
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 8. Background Theme Switcher (Aurora <-> Classic)
  const themeSwitchBtn = document.getElementById('themeSwitchBtn');
  const themeSwitchLabel = document.getElementById('themeSwitchLabel');
  const auroraBgEl = document.getElementById('auroraBg');

  function applyTheme(theme) {
    const isAurora = theme === 'aurora';
    document.body.classList.toggle('theme-aurora', isAurora);
    document.documentElement.classList.toggle('theme-aurora-root', isAurora);
    if (themeSwitchLabel) {
      themeSwitchLabel.textContent = isAurora ? 'Classic Theme' : 'Aurora Theme';
    }
    if (auroraBgEl && auroraBgEl._auroraControl) {
      auroraBgEl._auroraControl.setPaused(!isAurora);
    }
  }

  const savedTheme = localStorage.getItem('portfolio-theme') || 'aurora';
  applyTheme(savedTheme);

  if (themeSwitchBtn) {
    themeSwitchBtn.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('theme-aurora') ? 'classic' : 'aurora';
      localStorage.setItem('portfolio-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }
});
