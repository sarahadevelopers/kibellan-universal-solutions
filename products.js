/* ============================================================
   Kibellan — Products page
   ============================================================ */
(() => {
  'use strict';

  const WA_NUMBER   = '254704498509';      // WhatsApp only
  const CALL_NUMBER = '+254112450228';     // Voice only

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu — robust toggle ---------- */
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

    // Close when resizing back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* ---------- Filtering ---------- */
  const grid         = document.getElementById('productsGrid');
  const cards        = grid ? Array.from(grid.querySelectorAll('.product-card')) : [];
  const categoryBtns = Array.from(document.querySelectorAll('.category-btn'));
  const searchInput  = document.getElementById('searchInput');
  const resultsCount = document.getElementById('resultsCount');
  const emptyState   = document.getElementById('emptyState');
  const resetBtn     = document.getElementById('resetFilters');

  const state = { category: 'all', search: '' };

  const updateVisible = () => {
    let visible = 0;
    const q = state.search.trim().toLowerCase();

    cards.forEach(card => {
      const cat  = (card.dataset.category || '').toLowerCase();
      const name = (card.dataset.name || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();

      const catMatch    = state.category === 'all' || cat === state.category.toLowerCase();
      const searchMatch = !q || name.includes(q) || desc.includes(q);
      const show        = catMatch && searchMatch;

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (resultsCount) {
      resultsCount.innerHTML = `Showing <strong>${visible}</strong> product${visible === 1 ? '' : 's'}`;
    }
    if (emptyState) emptyState.hidden = visible !== 0;
  };

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      state.category = btn.dataset.category || 'all';
      updateVisible();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.search = searchInput.value;
      updateVisible();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.category = 'all';
      state.search = '';
      if (searchInput) searchInput.value = '';
      categoryBtns.forEach(b => {
        const on = b.dataset.category === 'all';
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      updateVisible();
    });
  }

  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => {
      const t = link.dataset.filterLink;
      const b = categoryBtns.find(x => x.dataset.category === t);
      if (b) {
        b.click();
        document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Modal ---------- */
  const modal         = document.getElementById('modal');
  const modalImg      = document.getElementById('modalImg');
  const modalTitle    = document.getElementById('modalTitle');
  const modalDesc     = document.getElementById('modalDesc');
  const modalPrice    = document.getElementById('modalPrice');
  const modalUnit     = document.getElementById('modalUnit');
  const modalCategory = document.getElementById('modalCategory');
  const modalWhats    = document.getElementById('modalWhats');
  const modalCall     = document.getElementById('modalCall');
  const modalClose    = document.getElementById('modalClose');

  let lastFocused = null;

  const openModal = (card) => {
    if (!modal) return;
    lastFocused = document.activeElement;

    const name  = card.dataset.name  || card.querySelector('h3')?.textContent || 'Product';
    const desc  = card.dataset.desc  || card.querySelector('p')?.textContent  || '';
    const price = card.dataset.price || '';
    const unit  = card.dataset.unit  || '';
    const cat   = card.querySelector('.product-category')?.textContent || '';
    const img   = card.querySelector('img')?.src || '';

    if (modalImg)      { modalImg.src = img; modalImg.alt = name; }
    if (modalTitle)    modalTitle.textContent    = name;
    if (modalDesc)     modalDesc.textContent     = desc;
    if (modalPrice)    modalPrice.textContent    = price;
    if (modalUnit)     modalUnit.textContent     = unit ? `/ ${unit}` : '';
    if (modalCategory) modalCategory.textContent = cat;

    if (modalWhats) {
      modalWhats.onclick = () => {
        const msg = encodeURIComponent(
          `Hello Kibellan Universal Solutions, I'd like a quote for: ${name} (${price}${unit ? ' / ' + unit : ''}).`
        );
        window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
      };
    }
    if (modalCall) {
      modalCall.href = `tel:${CALL_NUMBER}`;
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused?.focus) lastFocused.focus();
  };

  /* ---------- Card click & keyboard handlers ---------- */
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Let real links through — image, title, and "View full details"
      if (e.target.closest('a')) return;

      // "Order Now" button still opens the modal
      if (e.target.closest('.btn-quote')) {
        e.stopPropagation();
      }

      openModal(card);
    });

    card.addEventListener('keydown', (e) => {
      // Only open modal when the card itself is focused, not a link inside it
      if (e.target === card && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  if (modal && modalClose) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  /* ---------- Testimonial Swiper ---------- */
  if (window.Swiper) {
    new Swiper('.testimonial-swiper', {
      loop: true,
      grabCursor: true,
      spaceBetween: 20,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
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

  /* ---------- Init ---------- */
  updateVisible();
})();