/* ============================================================
   update-related-sections.js
   Replaces the "Used Together" section on each product page
   with the premium .related-section layout.

   Usage:
     node update-related-sections.js             → apply changes
     node update-related-sections.js --dry-run   → preview only
   ============================================================ */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

/* ============================================================
   1. Full product catalogue — display data for related cards
   ============================================================ */
const products = {
  'universal-bloodlines': {
    name: 'Universal Bloodlines',
    slug: 'universal-bloodlines.html',
    category: 'Dialysis Consumables',
    price: 'Ksh 450',
    image: 'https://media.istockphoto.com/id/466824118/photo/peritoneal-dialysis-dialysis.webp?a=1&b=1&s=612x612&w=0&k=20&c=2A18xNDJx2la7HznJHg2_wKOKTk1G2m5X6a6sf3oo6g=',
    fallback: null
  },
  'high-flux-dialyzers': {
    name: 'High Flux Dialyzers',
    slug: 'high-flux-dialyzers.html',
    category: 'Dialysis Consumables',
    price: 'Ksh 1,300',
    image: 'https://cpimg.tistatic.com/11171648/b/4/Dora-Dialyzer-13P..jpg',
    fallback: null
  },
  'heparin-injection': {
    name: 'Heparin Injection 5000iu/ml',
    slug: 'heparin-injection.html',
    category: 'Renal Medicines',
    price: 'Ksh 400',
    image: 'images/heparin-injection.jpg',
    fallback: 'https://media.istockphoto.com/id/157318221/photo/syringe-and-vials-with-medicine.webp?a=1&b=1&s=612x612&w=0&k=20&c=aWjr9Qr4ziioIcnxlosGy24KrBEdRxVI_cfrGysrBIA='
  },
  'av-fistula-needles': {
    name: 'A/V Fistula Needles G16',
    slug: 'av-fistula-needles.html',
    category: 'Dialysis Consumables',
    price: 'Ksh 140',
    image: 'images/av-fistula-needles.jpg',
    fallback: 'https://cpimg.tistatic.com/11171648/b/4/Dora-Dialyzer-13P..jpg'
  },
  'wepox': {
    name: 'Wepox 4000iu Injection',
    slug: 'wepox.html',
    category: 'Renal Medicines',
    price: 'Ksh 750',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9xSEpyPuqJjmW_O5DtV-Bw3QZkNuAI-goww&s',
    fallback: null
  },
  'paediatric-dialyzers': {
    name: 'Paediatric Dialyzers 1.4m²',
    slug: 'paediatric-dialyzers.html',
    category: 'Dialysis Consumables',
    price: 'Ksh 1,400',
    image: 'https://cpimg.tistatic.com/11171648/b/4/Dora-Dialyzer-13P..jpg',
    fallback: null
  },
  'solucart-bicarbonate': {
    name: 'Solucart Bicarbonate 720G',
    slug: 'solucart-bicarbonate.html',
    category: 'Dialysis Consumables',
    price: 'Ksh 450',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSHPy9UQxpwEONRCyt1CgfEST9gknM5CYgww&s',
    fallback: null
  },
  'acid-concentrate': {
    name: 'Acid Concentrate 5 Litres',
    slug: 'acid-concentrate.html',
    category: 'Dialysis Concentrates',
    price: 'Ksh 500',
    image: 'images/acid-concentrate.jpg',
    fallback: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9xSEpyPuqJjmW_O5DtV-Bw3QZkNuAI-goww&s'
  },
  'citric-acid-disinfectant': {
    name: 'Citric Acid Disinfectant 5L',
    slug: 'citric-acid-disinfectant.html',
    category: 'Renal Equipment Care',
    price: 'Ksh 5,000',
    image: 'images/citric-acid-disinfectant.jpg',
    fallback: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSHPy9UQxpwEONRCyt1CgfEST9gknM5CYgww&s'
  },
  'premapore-dressing': {
    name: 'Premapore Dressing 10×25cm',
    slug: 'premapore-dressing.html',
    category: 'Wound Care',
    price: 'Ksh 90',
    image: 'images/premapore-dressing.jpg',
    fallback: 'https://media.istockphoto.com/id/1225254344/photo/several-disposable-medical-face-masks-and-a-pair-of-latex-gloves.webp?a=1&b=1&s=612x612&w=0&k=20&c=OGZQ5LF__m1nTGAXi0OkR1EpHi7UET9EgMq5b8atciQ='
  },
  'surgical-tapes': {
    name: 'Surgical Tapes',
    slug: 'surgical-tapes.html',
    category: 'Consumables',
    price: 'Ksh 90',
    image: 'images/surgical-tapes.jpg',
    fallback: 'https://media.istockphoto.com/id/1225254344/photo/several-disposable-medical-face-masks-and-a-pair-of-latex-gloves.webp?a=1&b=1&s=612x612&w=0&k=20&c=OGZQ5LF__m1nTGAXi0OkR1EpHi7UET9EgMq5b8atciQ='
  },
  'pharmaceuticals': {
    name: 'Pharmaceuticals',
    slug: 'pharmaceuticals.html',
    category: 'Medicines',
    price: 'Request Quote',
    image: 'https://images.unsplash.com/photo-1617881770125-6fb0d039ecde?w=800&auto=format&fit=crop&q=60',
    fallback: null
  },
  'injectables': {
    name: 'Injectables',
    slug: 'injectables.html',
    category: 'Medicines',
    price: 'Request Quote',
    image: 'https://media.istockphoto.com/id/157318221/photo/syringe-and-vials-with-medicine.webp?a=1&b=1&s=612x612&w=0&k=20&c=aWjr9Qr4ziioIcnxlosGy24KrBEdRxVI_cfrGysrBIA=',
    fallback: null
  }
};

/* ============================================================
   2. Related-products mapping per page
   ============================================================ */
const relatedMap = {
  'universal-bloodlines.html': {
    heading: 'Commonly ordered with bloodlines',
    items: ['high-flux-dialyzers', 'av-fistula-needles', 'heparin-injection']
  },
  'high-flux-dialyzers.html': {
    heading: 'Commonly ordered with dialyzers',
    items: ['universal-bloodlines', 'heparin-injection', 'paediatric-dialyzers']
  },
  'heparin-injection.html': {
    heading: 'Commonly ordered with heparin',
    items: ['universal-bloodlines', 'high-flux-dialyzers', 'av-fistula-needles']
  },
  'av-fistula-needles.html': {
    heading: 'Commonly ordered with fistula needles',
    items: ['universal-bloodlines', 'premapore-dressing', 'heparin-injection']
  },
  'wepox.html': {
    heading: 'Commonly ordered with Wepox',
    items: ['heparin-injection', 'universal-bloodlines', 'high-flux-dialyzers']
  },
  'paediatric-dialyzers.html': {
    heading: 'Commonly ordered with paediatric dialyzers',
    items: ['universal-bloodlines', 'heparin-injection', 'av-fistula-needles']
  },
  'solucart-bicarbonate.html': {
    heading: 'Commonly ordered with bicarbonate',
    items: ['acid-concentrate', 'universal-bloodlines', 'high-flux-dialyzers']
  },
  'acid-concentrate.html': {
    heading: 'Commonly ordered with acid concentrate',
    items: ['solucart-bicarbonate', 'citric-acid-disinfectant', 'universal-bloodlines']
  },
  'citric-acid-disinfectant.html': {
    heading: 'Commonly ordered with disinfectant',
    items: ['acid-concentrate', 'solucart-bicarbonate', 'high-flux-dialyzers']
  },
  'premapore-dressing.html': {
    heading: 'Commonly ordered with Premapore',
    items: ['av-fistula-needles', 'surgical-tapes', 'universal-bloodlines']
  },
  'surgical-tapes.html': {
    heading: 'Commonly ordered with surgical tapes',
    items: ['premapore-dressing', 'av-fistula-needles', 'universal-bloodlines']
  },
  'pharmaceuticals.html': {
    heading: 'Commonly ordered with pharmaceuticals',
    items: ['heparin-injection', 'wepox', 'injectables']
  },
  'injectables.html': {
    heading: 'Commonly ordered with injectables',
    items: ['heparin-injection', 'wepox', 'pharmaceuticals']
  }
};

/* ============================================================
   3. HTML builders
   ============================================================ */
const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function buildRelatedCard(productKey) {
  const p = products[productKey];
  if (!p) throw new Error(`Unknown product key: ${productKey}`);

  const imgAttrs = p.fallback
    ? `src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.src='${p.fallback}'"`
    : `src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy"`;

  return `        <a href="${p.slug}" class="related-card" aria-label="View ${escapeHtml(p.name)}">
          <div class="related-thumb">
            <img ${imgAttrs}>
          </div>
          <div class="related-body">
            <span class="related-category">${escapeHtml(p.category)}</span>
            <h3>${escapeHtml(p.name)}</h3>
            <div class="related-meta">
              <span class="related-price">${escapeHtml(p.price)}</span>
              <span class="related-arrow">
                View <i class="fas fa-arrow-right" aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </a>`;
}

function buildRelatedSection(heading, productKeys) {
  const cards = productKeys.map(buildRelatedCard).join('\n\n');

  return `  <!-- ============ RELATED PRODUCTS — PREMIUM ============ -->
  <section class="related-section" aria-labelledby="relatedHeading">
    <div class="container-wrapper">

      <div class="related-header">
        <span class="section-tag">Used Together</span>
        <h2 id="relatedHeading">${escapeHtml(heading)}</h2>
        <p>Other renal and dialysis supplies frequently purchased alongside this product.</p>
      </div>

      <div class="related-grid">

${cards}

      </div>

    </div>
  </section>`;
}

/* ============================================================
   4. File processing
   ============================================================ */
function processFile(filename) {
  const filepath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filepath)) {
    console.log(`  ⚠  Skipped (file not found): ${filename}`);
    return false;
  }

  const config = relatedMap[filename];
  if (!config) {
    console.log(`  ⚠  Skipped (no mapping): ${filename}`);
    return false;
  }

  let html = fs.readFileSync(filepath, 'utf8');

  // Match either the OLD section (with or without preceding comment)
  // We do NOT match the NEW .related-section — that's already premium.
  const patterns = [
    /<!--\s*=+\s*RELATED\s*=+\s*-->\s*<section class="related-products"[\s\S]*?<\/section>/,
    /<section class="related-products"[\s\S]*?<\/section>/
  ];

  let match = null;
  for (const re of patterns) {
    match = html.match(re);
    if (match) break;
  }

  if (!match) {
    if (html.includes('class="related-section"')) {
      console.log(`  ✓  Already updated: ${filename}`);
    } else {
      console.log(`  ⚠  Skipped (no related-products section found): ${filename}`);
    }
    return false;
  }

  const newSection = buildRelatedSection(config.heading, config.items);
  html = html.replace(match[0], newSection);

  if (DRY_RUN) {
    console.log(`  ◌  [DRY RUN] Would update: ${filename}`);
    return true;
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`  ✓  Updated: ${filename}`);
  return true;
}

/* ============================================================
   5. Run
   ============================================================ */
console.log('');
console.log('Rebuilding premium "Used Together" sections...');
if (DRY_RUN) console.log('MODE: dry-run (no files will be written)');
console.log('');

const files = Object.keys(relatedMap);
let count = 0;

files.forEach(f => {
  try {
    if (processFile(f)) count++;
  } catch (err) {
    console.error(`  ✗  Error on ${f}: ${err.message}`);
  }
});

console.log('');
console.log(`Done. ${count} of ${files.length} pages processed.`);
console.log('');