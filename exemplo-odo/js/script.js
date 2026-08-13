/* ==========================================================================
   AURUM ODONTOLOGIA PREMIUM — SCRIPT
   Vanilla JS ES6+ — zero dependencies (icons via Lucide CDN)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- ICONS ---------- */
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader?.classList.add('is-hidden');
    }, 600);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => preloader?.classList.add('is-hidden'), 2500);

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- SMART HEADER ON SCROLL ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const SCROLL_THRESHOLD = 40;

  const onScroll = () => {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    header?.classList.toggle('is-scrolled', scrolled);
    backToTop?.classList.toggle('is-visible', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- MOBILE NAV ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  const closeMobileNav = () => {
    navToggle?.classList.remove('is-active');
    mobileNav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(!!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- CURSOR GLOW (desktop only) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (min-width: 900px)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });
  }

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay');
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- BEFORE / AFTER DRAGGABLE SLIDER ---------- */
  const baSlider = document.getElementById('baSlider');
  const baBefore = document.getElementById('baBefore');
  const baHandle = document.getElementById('baHandle');

  if (baSlider && baBefore && baHandle) {
    let isDragging = false;

    const setBeforeWidth = (percentage) => {
      const clamped = Math.min(96, Math.max(4, percentage));
      baBefore.style.width = `${clamped}%`;
      baHandle.style.left = `${clamped}%`;
      const img = baBefore.querySelector('img');
      if (img) img.style.width = `${baSlider.offsetWidth}px`;
    };

    const updateFromClientX = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      const percentage = ((clientX - rect.left) / rect.width) * 100;
      setBeforeWidth(percentage);
    };

    // Mouse events
    baHandle.addEventListener('mousedown', () => { isDragging = true; });
    baSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateFromClientX(e.clientX);
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateFromClientX(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch events
    baSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateFromClientX(e.touches[0].clientX);
    }, { passive: true });
    baSlider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateFromClientX(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });

    // Keep the "before" image sized correctly on resize
    window.addEventListener('resize', () => {
      const img = baBefore.querySelector('img');
      if (img) img.style.width = `${baSlider.offsetWidth}px`;
    });

    // Init
    setBeforeWidth(52);
    window.addEventListener('load', () => setBeforeWidth(52));

    /* --- Before/After case switcher (demo content swap) --- */
    const cases = {
      1: {
        before: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
        after: 'https://images.unsplash.com/photo-1581585504478-7ebc6ee18a3a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Lentes de contato dental — 6 unidades, técnica ultraconservadora'
      },
      2: {
        before: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80',
        after: 'https://images.unsplash.com/photo-1621898026509-64d76f1c5c31?auto=format&fit=crop&w=1200&q=80',
        caption: 'Invisalign — realinhamento total em 11 meses'
      },
      3: {
        before: 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?auto=format&fit=crop&w=1200&q=80',
        after: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80',
        caption: 'Harmonização facial — protocolo integrado ao sorriso'
      }
    };

    const baNavBtns = document.querySelectorAll('.ba-nav-btn');
    const baCaption = document.querySelector('.ba-caption');
    const afterImg = document.querySelector('.ba-after img');
    const beforeImg = document.querySelector('.ba-before img');

    baNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        baNavBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const caseData = cases[btn.dataset.case];
        if (!caseData) return;

        // Subtle cross-fade
        [afterImg, beforeImg].forEach(img => img && (img.style.opacity = '0'));
        setTimeout(() => {
          if (afterImg) afterImg.src = caseData.after;
          if (beforeImg) beforeImg.src = caseData.before;
          if (baCaption) baCaption.textContent = caseData.caption;
          [afterImg, beforeImg].forEach(img => img && (img.style.opacity = '1'));
          setBeforeWidth(52);
        }, 200);
      });
    });

    [afterImg, beforeImg].forEach(img => {
      if (img) img.style.transition = 'opacity .35s ease';
    });
  }

  /* ---------- TESTIMONIALS CAROUSEL ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (track && dotsWrap) {
    const slides = Array.from(track.children);
    let current = 0;
    let autoplayId = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function nextSlide() { goTo(current + 1); }
    function prevSlide() { goTo(current - 1); }

    nextBtn?.addEventListener('click', () => { nextSlide(); restartAutoplay(); });
    prevBtn?.addEventListener('click', () => { prevSlide(); restartAutoplay(); });

    function startAutoplay() {
      autoplayId = setInterval(nextSlide, 6000);
    }
    function restartAutoplay() {
      clearInterval(autoplayId);
      startAutoplay();
    }
    startAutoplay();

    // Pause on hover/focus
    const slider = document.querySelector('.testimonial-slider');
    slider?.addEventListener('mouseenter', () => clearInterval(autoplayId));
    slider?.addEventListener('mouseleave', startAutoplay);

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? prevSlide() : nextSlide();
        restartAutoplay();
      }
    }, { passive: true });
  }

  /* ---------- FAQ ACCORDION ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    // Set initial max-height for the item that starts open
    if (item.classList.contains('is-open') && answer) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }

    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items (single-open accordion)
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      if (answer) {
        answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
      }
    });
  });

  // Recalculate open FAQ height on resize (responsive text reflow)
  window.addEventListener('resize', () => {
    const openItem = document.querySelector('.faq-item.is-open .faq-answer');
    if (openItem) openItem.style.maxHeight = openItem.scrollHeight + 'px';
  });

  /* ---------- SMOOTH ANCHOR SCROLL (accounts for fixed header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 84;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      closeMobileNav();
    });
  });

});
