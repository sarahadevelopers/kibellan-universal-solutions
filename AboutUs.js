/* ============================================================
   Kibellan — About Us page
   ============================================================ */
(() => {
  'use strict';

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('menuToggle');
  const menu   = document.getElementById('navbarMenu');

  const setMenu = (open) => {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.innerHTML = open
      ? '<i class="fas fa-times" aria-hidden="true"></i>'
      : '<i class="fas fa-bars" aria-hidden="true"></i>';
    document.body.classList.toggle('menu-open', open);
  };

  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setMenu(!menu.classList.contains('is-open'));
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* ---------- Partnership form ---------- */
  const form = document.getElementById('partnershipForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      const card = form.closest('.form-card');
      const btn  = form.querySelector('.btn-submit');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }
      if (card) {
        setTimeout(() => card.classList.add('is-success'), 300);
      }
      // Form continues to FormSubmit
    });
  }

  /* ---------- Testimonials Swiper ---------- */
  if (window.Swiper) {
    new Swiper('.testimonial-swiper', {
      loop: true,
      grabCursor: true,
      spaceBetween: 20,
      autoplay: { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: {
        el: '.testimonial-swiper .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        0:    { slidesPerView: 1, spaceBetween: 16 },
        640:  { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      },
    });
  }

  /* ---------- Story stat counters ---------- */
  const stats = document.querySelectorAll('.story-stat-num[data-count]');
  if (stats.length) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutCubic for a smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    if (reduceMotion || !('IntersectionObserver' in window)) {
      // Set final values immediately — no animation
      stats.forEach((el) => {
        el.textContent = (el.dataset.count || 0) + (el.dataset.suffix || '');
      });
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      stats.forEach((el) => observer.observe(el));
    }
  }

})();