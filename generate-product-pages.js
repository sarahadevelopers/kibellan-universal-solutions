/* ============================================================
   generate-product-pages.js
   Builds one SEO-optimized HTML file per product.

   Usage:  node generate-product-pages.js
   ============================================================ */

const fs = require('fs');
const path = require('path');
const products = require('./products-data.js');

const SITE = 'https://kibellanuniversalsolutions.co.ke';
const WHATSAPP = '254704498509';
const OUT_DIR = path.join(__dirname);

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildPage(p) {
  const waMsg = encodeURIComponent(
    `Hello Kibellan Universal Solutions, I'm interested in ${p.name}. Please share availability and pricing.`
  );
  const waLink = `https://wa.me/${WHATSAPP}?text=${waMsg}`;

  const specRows = p.specs
    .map(([k, v]) => `            <tr><th>${escape(k)}</th><td>${escape(v)}</td></tr>`)
    .join('\n');

  const highlights = p.highlights.map(h => `          <li>${escape(h)}</li>`).join('\n');
  const storage    = p.usage.storage.map(s => `          <li>${escape(s)}</li>`).join('\n');
  const disposal   = p.usage.disposal.map(s => `          <li>${escape(s)}</li>`).join('\n');

  const related = products
    .filter(x => x.slug !== p.slug && x.categoryAnchor === p.categoryAnchor)
    .slice(0, 3);

  const relatedCards = related.map(r => `
        <article class="product-card">
          <div class="product-image">
            <img src="${r.image}" alt="${escape(r.name)}" loading="lazy" style="width:100%;height:100%;object-fit:contain;padding:12px;" />
          </div>
          <div class="product-details">
            <h4>${escape(r.name)}</h4>
            <p class="product-desc">${escape(r.lede.slice(0, 110))}…</p>
            <div class="product-actions">
              <a href="${r.slug}.html" class="btn-product-view">View Product</a>
              <a href="${r.slug}.html#product-enquiry" class="btn-product-quote">Request Quote</a>
            </div>
          </div>
        </article>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${escape(p.metaTitle)}</title>
  <meta name="description" content="${escape(p.metaDescription)}" />
  <meta name="keywords" content="${escape(p.keywords)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${SITE}/${p.slug}.html" />

  <meta property="og:type" content="product" />
  <meta property="og:title" content="${escape(p.metaTitle)}" />
  <meta property="og:description" content="${escape(p.metaDescription)}" />
  <meta property="og:url" content="${SITE}/${p.slug}.html" />
  <meta property="og:image" content="${p.image}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escape(p.metaTitle)}" />
  <meta name="twitter:description" content="${escape(p.metaDescription)}" />

  <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="product.css" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${escape(p.name)}",
    "image": "${p.image}",
    "description": "${escape(p.metaDescription)}",
    "sku": "${p.sku}",
    "brand": { "@type": "Brand", "name": "Kibellan Universal Solutions" },
    "category": "${escape(p.category)}",
    "offers": {
      "@type": "Offer",
      "url": "${SITE}/${p.slug}.html",
      "priceCurrency": "KES",
      "price": "${p.price}",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Kibellan Universal Solutions" }
    }
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE}/" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "${SITE}/products.html" },
      { "@type": "ListItem", "position": 3, "name": "${escape(p.category)}", "item": "${SITE}/products.html#${p.categoryAnchor}" },
      { "@type": "ListItem", "position": 4, "name": "${escape(p.name)}", "item": "${SITE}/${p.slug}.html" }
    ]
  }
  </script>
</head>

<body>

  <header class="site-header">
    <div class="navbar-container">
      <a href="index.html" class="navbar-logo"><span>Kibellan</span><small>Universal Solutions</small></a>
      <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primaryMenu">
        <i class="fas fa-bars" aria-hidden="true"></i>
      </button>
      <nav class="navbar-menu" aria-label="Primary">
        <ul class="nav-list" id="primaryMenu">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="AboutUs.html" class="nav-link">About Us</a></li>
          <li class="nav-item-dropdown">
            <a href="products.html" class="nav-link active">Products <i class="fas fa-chevron-down dropdown-icon" aria-hidden="true"></i></a>
            <ul class="dropdown-menu">
              <li><a href="products.html#dialysis">Dialysis Consumables</a></li>
              <li><a href="products.html#renal-care">Renal Equipment Care</a></li>
              <li><a href="products.html#medical-logistics">Medical Logistics</a></li>
            </ul>
          </li>
          <li><a href="compliance.html" class="nav-link">Compliance</a></li>
        </ul>
      </nav>
      <div class="navbar-actions">
        <a href="#product-enquiry" class="btn-nav-cta">Request a Quote</a>
      </div>
    </div>
  </header>

  <nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container-wrapper">
      <ol class="breadcrumb-list">
        <li><a href="index.html">Home</a></li>
        <li><a href="products.html">Products</a></li>
        <li><a href="products.html#${p.categoryAnchor}">${escape(p.category)}</a></li>
        <li aria-current="page">${escape(p.name)}</li>
      </ol>
    </div>
  </nav>

  <section class="product-hero">
    <div class="product-hero-inner">
      <div class="product-hero-visual">
        <div class="product-hero-image">
          <img src="${p.image}" alt="${escape(p.name)} — Kibellan Universal Solutions" />
        </div>
      </div>

      <div class="product-hero-copy">
        <span class="eyebrow">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--accent-teal);display:inline-block;"></span>
          ${escape(p.category)}
        </span>
        <h1>${escape(p.name)}</h1>
        <p class="product-lede">${escape(p.lede)}</p>

        <div class="product-price-row">
          <span class="product-price-current">Ksh ${p.price.toLocaleString()}</span>
          <span class="product-price-unit">/ ${escape(p.unit)}</span>
          <span class="product-stock-badge">In Stock</span>
        </div>

        <div class="product-cta-row">
          <div class="product-qty" role="group" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" data-qty="dec">−</button>
            <input type="number" value="1" min="1" max="9999" aria-label="Quantity" />
            <button type="button" aria-label="Increase quantity" data-qty="inc">+</button>
          </div>
          <a class="btn-order-whatsapp" href="${waLink}" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Order on WhatsApp
          </a>
          <a href="#product-enquiry" class="btn-order-primary">Request a Quote</a>
        </div>

        <div class="product-trust">
          <div class="product-trust-item">
            <i class="fas fa-shield-halved" aria-hidden="true"></i>
            <div><strong>Certified Quality</strong>Sourced from trusted manufacturers</div>
          </div>
          <div class="product-trust-item">
            <i class="fas fa-truck-fast" aria-hidden="true"></i>
            <div><strong>Kenya-wide Delivery</strong>Fast, reliable dispatch</div>
          </div>
          <div class="product-trust-item">
            <i class="fas fa-file-invoice" aria-hidden="true"></i>
            <div><strong>Bulk Pricing</strong>Institutional discounts</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="product-details-section">
    <div class="product-details-inner">
      <div class="product-tabs" role="tablist">
        <button class="product-tab active" role="tab" aria-selected="true" data-tab="overview">Overview</button>
        <button class="product-tab" role="tab" aria-selected="false" data-tab="specs">Specifications</button>
        <button class="product-tab" role="tab" aria-selected="false" data-tab="usage">Usage &amp; Handling</button>
      </div>

      <div class="product-tab-panel active" id="tab-overview" role="tabpanel">
        <h2>Product Overview</h2>
        <p>${escape(p.lede)}</p>
        <h3>Key Highlights</h3>
        <ul>
${highlights}
        </ul>
      </div>

      <div class="product-tab-panel" id="tab-specs" role="tabpanel">
        <h2>Specifications</h2>
        <table class="spec-table">
          <tbody>
${specRows}
            <tr><th>SKU</th><td>${escape(p.sku)}</td></tr>
            <tr><th>Availability</th><td>In Stock — Nationwide delivery</td></tr>
          </tbody>
        </table>
      </div>

      <div class="product-tab-panel" id="tab-usage" role="tabpanel">
        <h2>Usage &amp; Handling</h2>
        <h3>Storage</h3>
        <ul>
${storage}
        </ul>
        <h3>Disposal</h3>
        <ul>
${disposal}
        </ul>
      </div>
    </div>
  </section>

  ${relatedCards ? `
  <section class="related-products">
    <div class="related-inner">
      <div class="related-header">
        <h2>Related Products</h2>
        <p>Other products from the same category.</p>
      </div>
      <div class="product-grid">
${relatedCards}
      </div>
    </div>
  </section>` : ''}

  <section id="product-enquiry" class="procurement-section">
    <div class="form-card">
      <h3>Request a Quote — ${escape(p.name)}</h3>
      <p>Tell us your quantity and delivery location. Our team responds with availability, batch pricing and lead times within 24 hours.</p>
      <form action="#" method="POST" novalidate>
        <input type="hidden" name="product" value="${escape(p.name)}" />
        <div class="form-grid">
          <input type="text" name="fullName" placeholder="Full Name" required />
          <input type="text" name="institution" placeholder="Institution / Hospital Name" required />
          <input type="email" name="email" placeholder="Institutional Email Address" required />
          <input type="tel" name="phone" placeholder="Phone / WhatsApp" required />
          <input type="number" name="quantity" placeholder="Quantity Required" min="1" />
          <input type="text" name="location" placeholder="Delivery Location" />
        </div>
        <textarea name="details" rows="4" placeholder="Additional notes — batch sizes, timelines, or special requirements..."></textarea>
        <button type="submit" class="btn-submit">Submit Quote Request</button>
      </form>
    </div>
  </section>

  <section class="product-cta-band">
    <div class="product-cta-band-inner">
      <h2>Need ${escape(p.name)} for your facility?</h2>
      <p>Order in bulk from Kibellan Universal Solutions — trusted by hospitals, dialysis centres and clinics across Kenya.</p>
      <div class="product-cta-band-actions">
        <a href="#product-enquiry" class="btn-cta-light">Request a Quote</a>
        <a class="btn-cta-outline" href="${waLink}" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp Our Team
        </a>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="footer-top">
      <div class="footer-container main-footer-grid">
        <div class="footer-col brand-col">
          <a href="index.html" class="footer-logo"><span>Kibellan</span><small>Universal Solutions</small></a>
          <p class="footer-about">Trusted clinical supply chains and high-quality renal consumables since 2015.</p>
          <div class="compliance-badges">
            <span class="badge-tag"><i class="fas fa-check-circle"></i> ISO Certified Facility</span>
            <span class="badge-tag"><i class="fas fa-shield-alt"></i> CE Compliant Batches</span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Navigation</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home Profile</a></li>
            <li><a href="AboutUs.html">Our Corporate Story</a></li>
            <li><a href="products.html">Commercial Catalogue</a></li>
            <li><a href="compliance.html">Quality &amp; Compliance</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Product Pipelines</h4>
          <ul class="footer-links">
            <li><a href="products.html#dialysis">Dialysis Consumables</a></li>
            <li><a href="high-flux-dialyzers.html">Hollow Fiber Dialyzers</a></li>
            <li><a href="av-fistula-needles.html">AV Fistula Needle Sets</a></li>
            <li><a href="products.html#renal-care">Renal Equipment Care</a></li>
          </ul>
        </div>
        <div class="footer-col contact-col">
          <h4>Institutional Inquiries</h4>
          <p class="contact-info-item"><i class="fas fa-envelope"></i> <a href="mailto:info@kibellanuniversalsolutions.co.ke">info@kibellanuniversalsolutions.co.ke</a></p>
          <p class="contact-info-item"><i class="fas fa-phone-alt"></i> <a href="tel:+254723562484">+254 723 562 484</a></p>
          <p class="contact-info-item"><i class="fas fa-map-marker-alt"></i> <span>Nairobi, Kenya</span></p>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-container bottom-flex">
        <p class="copyright-text">&copy; <span id="year"></span> Kibellan Universal Solutions. All rights reserved.</p>
        <p class="credit">Designed &amp; developed by <a href="https://sarahadevelopers.co.ke" target="_blank" rel="noopener">Saraha Developers</a></p>
        <div class="legal-disclaimer">
          <p><strong>Disclaimer:</strong> All dialysis consumables and renal products are distributed strictly in compliance with global medical manufacturing regulations. Institutional sourcing requires valid clinical verification certificates.</p>
        </div>
      </div>
    </div>
  </footer>

  <a class="sticky-wa" href="${waLink}" target="_blank" rel="noopener" aria-label="Chat with Kibellan on WhatsApp">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>Chat with us</span>
  </a>

  <script>
    document.getElementById('year').textContent = new Date().getFullYear();

    (function () {
      const toggle = document.getElementById('menuToggle');
      const menu = document.getElementById('primaryMenu');
      if (!toggle || !menu) return;
      toggle.addEventListener('click', function () {
        const open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      });
    })();

    (function () {
      document.querySelectorAll('.product-qty').forEach(function (group) {
        const input = group.querySelector('input');
        group.querySelectorAll('button').forEach(function (btn) {
          btn.addEventListener('click', function () {
            const current = parseInt(input.value, 10) || 1;
            input.value = btn.dataset.qty === 'inc' ? current + 1 : Math.max(1, current - 1);
          });
        });
      });
    })();

    (function () {
      const tabs = document.querySelectorAll('.product-tab');
      const panels = document.querySelectorAll('.product-tab-panel');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
          panels.forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          const target = document.getElementById('tab-' + tab.dataset.tab);
          if (target) target.classList.add('active');
        });
      });
    })();
  </script>
</body>
</html>
`;
}

/* ---- Run the build ---- */
let count = 0;
for (const p of products) {
  const html = buildPage(p);
  const file = path.join(OUT_DIR, `${p.slug}.html`);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`✓ Built ${p.slug}.html`);
  count++;
}
console.log(`\nDone. Generated ${count} product pages.`);