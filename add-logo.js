/* ============================================================
   add-logo.js
   Replaces the text-based header logo with images/logo.webp
   on every HTML page. Also updates the schema logo field.

   Usage:
     node add-logo.js --dry-run   → preview only
     node add-logo.js             → apply changes
   ============================================================ */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

const pages = [
  'index.html',
  'products.html',
  'AboutUs.html',
  'contacts.html',
  'compliance.html',
  'Partnerships.html',
  'universal-bloodlines.html',
  'high-flux-dialyzers.html',
  'heparin-injection.html',
  'av-fistula-needles.html',
  'wepox.html',
  'paediatric-dialyzers.html',
  'solucart-bicarbonate.html',
  'acid-concentrate.html',
  'citric-acid-disinfectant.html',
  'premapore-dressing.html',
  'surgical-tapes.html',
  'pharmaceuticals.html',
  'injectables.html'
];

/* ---------- Old logo patterns to replace in <header> ---------- */
// Matches the existing text-based logo anchor, whichever version
const oldLogoPatterns = [
  // Longest form: link + logo-icon div + logo-text div + small
  /<a\s+href="index\.html"\s+class="navbar-logo"[\s\S]*?<\/a>/g,
  /<a\s+href="\/"\s+class="navbar-logo"[\s\S]*?<\/a>/g,
  /<a\s+href="index\.html"\s+class="logo-link"[\s\S]*?<\/a>/g
];

const newHeaderLogo = `      <a href="index.html" class="navbar-logo" aria-label="Kibellan Universal Solutions — Home">
        <img
          src="images/logo.webp"
          alt="Kibellan Universal Solutions"
          class="navbar-logo-img"
          width="160"
          height="52"
        />
      </a>`;

/* ---------- Schema logo URL pattern ---------- */
// Matches "logo": { "@type": "ImageObject", "url": "...", ... }
const schemaLogoPattern = /"logo":\s*\{\s*"@type":\s*"ImageObject",\s*"url":\s*"[^"]*"(?:,\s*"width":\s*\d+)?(?:,\s*"height":\s*\d+)?\s*\}/g;

const newSchemaLogo = `"logo": {
          "@type": "ImageObject",
          "url": "https://kibellanuniversalsolutions.co.ke/images/logo.webp",
          "width": 512,
          "height": 512
        }`;

/* ---------- File processor ---------- */
function processFile(filename) {
  const filepath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filepath)) {
    console.log(`  ⚠  Skipped (not found): ${filename}`);
    return false;
  }

  let html = fs.readFileSync(filepath, 'utf8');
  const original = html;
  const changes = [];

  // 1. Swap header logo markup
  for (const pattern of oldLogoPatterns) {
    if (pattern.test(html)) {
      html = html.replace(pattern, newHeaderLogo);
      changes.push('header');
      break;
    }
  }

  // 2. Update schema logo URL
  if (schemaLogoPattern.test(html)) {
    html = html.replace(schemaLogoPattern, newSchemaLogo);
    changes.push('schema');
  }

  if (html === original) {
    console.log(`  ⚠  No match found: ${filename}`);
    return false;
  }

  if (DRY_RUN) {
    console.log(`  ◌  [DRY RUN] ${filename} → ${changes.join(' + ')}`);
    return true;
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`  ✓  ${filename} → ${changes.join(' + ')}`);
  return true;
}

/* ---------- Run ---------- */
console.log('');
console.log('Adding logo.webp to all pages...');
if (DRY_RUN) console.log('MODE: dry-run (no files will be written)');
console.log('');

let count = 0;
for (const page of pages) {
  try {
    if (processFile(page)) count++;
  } catch (err) {
    console.error(`  ✗  Error on ${page}: ${err.message}`);
  }
}

console.log('');
console.log(`Done. ${count} of ${pages.length} pages processed.`);
console.log('');