/* =========================================================
   BRASA — main.js
   Lenis smooth scroll + GSAP/ScrollTrigger + interações
   ========================================================= */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || window.matchMedia('(max-width: 900px)').matches;

  document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion);

  /* =========================================================
     1. LENIS SMOOTH SCROLL + GSAP TICKER BRIDGE
     ========================================================= */
  let lenis;

  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
      normalizeWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Keep in-page anchor links working with Lenis
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: -20, duration: 1.3 });
          closeMobileMenu();
        }
      });
    });
  }

  /* =========================================================
     2. LOADER / INTRO SEQUENCE
     ========================================================= */
  function runIntro() {
    const loader = document.getElementById('loader');
    const fill = document.querySelector('.loader-fill');
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: heroTimeline
    });

    if (fill) {
      tl.to(fill, { width: '100%', duration: 1.0, ease: 'power2.inOut' }, 0);
    }
    if (loader) {
      tl.to(loader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        delay: 0.15
      }, 0.9);
      tl.set(loader, { display: 'none' });
    }
  }

  function heroTimeline() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero .reveal-char', {
      y: '0%',
      opacity: 1,
      duration: 1.1,
      stagger: 0.055
    }, 0);

    document.querySelectorAll('.hero .reveal-up').forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0);
      tl.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
      }, 0.35 + delay);
    });

    gsap.to('.hero-bg img', {
      scale: 1,
      duration: 2.4,
      ease: 'power2.out'
    });
  }

  /* =========================================================
     3. SCROLLTRIGGER REVEALS (headers, text, cards)
     ========================================================= */
  function initScrollReveals() {
    gsap.utils.toArray('.reveal-up:not(.hero .reveal-up)').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    gsap.utils.toArray('.reveal-scale').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        delay: (i % 3) * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  /* =========================================================
     4. PARALLAX — hero + conceito media
     ========================================================= */
  function initParallax() {
    if (isTouch) return;

    gsap.to('.hero-bg img', {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.utils.toArray('[data-parallax-y]').forEach((el) => {
      const distance = parseFloat(el.dataset.parallaxY || 0);
      gsap.to(el, {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    });
  }

  /* =========================================================
     5. EMBER DIVIDER — draw-on-scroll signature element
     ========================================================= */
  function initEmberDividers() {
    gsap.utils.toArray('[data-ember-divider] path').forEach((path) => {
      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: path,
          start: 'top 95%',
          end: 'top 45%',
          scrub: 0.5
        }
      });
    });
  }

  /* =========================================================
     6. NAVBAR — background on scroll
     ========================================================= */
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => {
        header.classList.toggle('is-scrolled', self.scroll() > 60);
      }
    });
  }

  /* =========================================================
     7. MOBILE MENU
     ========================================================= */
  const toggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (!mobileMenu || !mobileMenu.classList.contains('is-open')) return;
    mobileMenu.classList.remove('is-open');
    toggleBtn.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initMobileMenu() {
    if (!toggleBtn || !mobileMenu) return;

    toggleBtn.addEventListener('click', () => {
      const willOpen = !mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open', willOpen);
      toggleBtn.classList.toggle('is-open', willOpen);
      toggleBtn.setAttribute('aria-expanded', String(willOpen));
      mobileMenu.setAttribute('aria-hidden', String(!willOpen));
      document.body.style.overflow = willOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileMenu));
  }

  /* =========================================================
     8. CUSTOM CURSOR — reactive + magnetic buttons
     ========================================================= */
  function initCursor() {
    if (isTouch || prefersReducedMotion) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    const dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: dotPos.x, y: dotPos.y };
    const mouse = { x: dotPos.x, y: dotPos.y };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    gsap.ticker.add(() => {
      dotPos.x += (mouse.x - dotPos.x) * 0.9;
      dotPos.y += (mouse.y - dotPos.y) * 0.9;
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;

      dot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
    });

    document.querySelectorAll('a, button, .magnetic').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* =========================================================
     9. MAGNETIC BUTTONS
     ========================================================= */
  function initMagnetic() {
    if (isTouch || prefersReducedMotion) return;

    document.querySelectorAll('.magnetic').forEach((el) => {
      const strength = parseFloat(el.dataset.magneticStrength || 0.4);
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo(relX * strength);
        yTo(relY * strength);
      });

      el.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* =========================================================
     10. MENU TABS (Entradas / Principais / Sobremesas / Drinks)
     ========================================================= */
  function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');
    const indicator = document.querySelector('.menu-tab-indicator');
    if (!tabs.length) return;

    function positionIndicator(tab) {
      if (!indicator) return;
      indicator.style.left = tab.offsetLeft + 'px';
      indicator.style.width = tab.offsetWidth + 'px';
    }

    function playPanelIn(panel) {
      const items = panel.querySelectorAll('.menu-item');
      gsap.fromTo(items,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out'
        }
      );
    }

    function activateTab(tab) {
      const target = tab.dataset.tab;

      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      panels.forEach((p) => {
        const match = p.dataset.panel === target;
        p.classList.toggle('is-active', match);
        p.hidden = !match;
        if (match) playPanelIn(p);
      });

      positionIndicator(tab);
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab));
    });

    window.addEventListener('resize', () => {
      const active = document.querySelector('.menu-tab.is-active');
      if (active) positionIndicator(active);
    });

    // Initial state
    const initial = document.querySelector('.menu-tab.is-active') || tabs[0];
    requestAnimationFrame(() => positionIndicator(initial));

    // Reveal first panel items when menu section enters view
    ScrollTrigger.create({
      trigger: '.menu-section',
      start: 'top 70%',
      once: true,
      onEnter: () => playPanelIn(document.querySelector('.menu-panel.is-active'))
    });
  }

  /* =========================================================
     11. GALLERY STAGGER
     ========================================================= */
  function initGalleryReveal() {
    gsap.from('.gallery-item', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: 'top 82%'
      }
    });
  }

  /* =========================================================
     12. RESERVATION FORM (front-end only)
     ========================================================= */
  function initReservaForm() {
    const form = document.getElementById('reserva-form');
    if (!form) return;

    const dataInput = form.querySelector('#data');
    if (dataInput) {
      const today = new Date().toISOString().split('T')[0];
      dataInput.setAttribute('min', today);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      form.classList.add('is-success');
      gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });

      setTimeout(() => {
        form.reset();
        form.classList.remove('is-success');
      }, 3200);
    });
  }

  /* =========================================================
     13. LUCIDE ICONS
     ========================================================= */
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    } else {
      window.addEventListener('load', () => {
        if (window.lucide) window.lucide.createIcons();
      });
    }
  }

  /* =========================================================
     INIT
     ========================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    initLenis();
    initHeaderScroll();
    initMobileMenu();
    initCursor();
    initMagnetic();
    initMenuTabs();
    initGalleryReveal();
    initScrollReveals();
    initParallax();
    initEmberDividers();
    initReservaForm();
    initIcons();

    runIntro();

    ScrollTrigger.refresh();
  });
})();
