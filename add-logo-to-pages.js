/* ============================================================
   add-logo-to-pages.js
   Replaces the text-based logo in the site header with the
   actual logo image on all 18 HTML pages.

   Usage:
     node add-logo-to-pages.js --dry-run   → preview only
     node add-logo-to-pages.js             → apply changes
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

/* ---------- Old and new logo markup ---------- */

// Matches: <a href="index.html" class="navbar-logo" ...> ... </a>
// The ... captures existing children (spans, small, etc.)
const oldLogoPatterns = [
  // Match with closing anchor, various internal structures
  /<a\s+href="index\.html"\s+class="navbar-logo"[\s\S]*?<\/a>/g,
  /<a\s+href="\/"\s+class="navbar-logo"[\s\S]*?<\/a>/g
];

const newLogoMarkup = `      <a href="index.html" class="navbar-logo" aria-label="Kibellan Universal Solutions — Home">
        <img src="images/logo-header.webp" alt="Kibellan Universal Solutions" class="navbar-logo-img" />
      </a>`;

/* ---------- Schema logo field pattern ---------- */
const schemaLogoPattern = /"logo":\s*\{\s*"@type":\s*"ImageObject",\s*"url":\s*"[^"]*",?\s*"width":\s*512,?\s*"height":\s*512\s*\}/g;

function processFile(filename) {
  const filepath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filepath)) {
    console.log(`  ⚠  Skipped (not found): ${filename}`);
    return false;
  }

  let html = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  // 1. Replace the header logo markup
  for (const pattern of oldLogoPatterns) {
    if (pattern.test(html)) {
      html = html.replace(pattern, newLogoMarkup);
      changed = true;
      break;
    }
  }

  // 2. Update schema logo URL to point to the actual file
  // (only for pages that reference /images/logo.png)
  const newSchemaLogo = `"logo": {
          "@type": "ImageObject",
          "url": "https://kibellanuniversalsolutions.co.ke/images/logo.webp",
          "width": 512,
          "height": 512
        }`;
  const schemaBefore = html;
  html = html.replace(schemaLogoPattern, newSchemaLogo);
  if (html !== schemaBefore) changed = true;

  if (!changed) {
    console.log(`  ⚠  No changes needed (or pattern not found): ${filename}`);
    return false;
  }

  if (DRY_RUN) {
    console.log(`  ◌  [DRY RUN] Would update: ${filename}`);
    return true;
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`  ✓  Updated: ${filename}`);
  return true;
}

/* ---------- Run ---------- */
console.log('');
console.log('Adding logo to site headers + schema...');
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