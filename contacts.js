/* ============================================================
   Kibellan — Contacts page
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

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Let FormSubmit handle the actual POST — just give feedback
      const card = form.closest('.form-card');
      const btn  = form.querySelector('.btn-submit');

      // Basic validation
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      // Visual success feedback (FormSubmit will redirect or post)
      if (card) {
        setTimeout(() => card.classList.add('is-success'), 300);
      }
      // Form continues normally to FormSubmit
    });
  }

})();