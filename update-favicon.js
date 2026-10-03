/* ============================================================
   update-favicon.js
   Updates the favicon <link> tags on all HTML pages to point
   at images/favicon.webp

   Usage:
     node update-favicon.js --dry-run   → preview only
     node update-favicon.js             → apply changes
   ============================================================ */

const fs   = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

/* ---------- New favicon block ---------- */
const NEW_FAVICON_BLOCK = `  <link rel="icon" type="image/webp" href="images/favicon.webp" />
  <link rel="apple-touch-icon" href="images/favicon.webp" />`;

/* ---------- Patterns that match any existing favicon setup ---------- */
/* We remove EVERY <link> line whose rel is icon / apple-touch-icon /
   shortcut icon / manifest — then insert the new block.                */
const FAVICON_LINE_RE = /^\s*<link\s+[^>]*\brel=["'](?:icon|shortcut icon|apple-touch-icon|apple-touch-icon-precomposed|mask-icon|manifest)["'][^>]*\/?>\s*\r?\n?/gim;

/* Fallback: also catch comment blocks the generator style uses */
const OLD_COMMENT_RE = /<!--\s*=+\s*FAVICONS?[\s\S]*?-->\s*\r?\n?/gi;

function processFile(filename) {
  const filepath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filepath)) {
    console.log(`  ⚠  Skipped (not found): ${filename}`);
    return false;
  }

  let html = fs.readFileSync(filepath, 'utf8');
  const original = html;
  let removedCount = 0;

  // 1. Strip any existing comment banner above favicons
  html = html.replace(OLD_COMMENT_RE, '');

  // 2. Remove every existing favicon/manifest/apple-touch link
  html = html.replace(FAVICON_LINE_RE, () => {
    removedCount++;
    return '';
  });

  // 3. If the file has no favicon at all now, or we removed at least one,
  //    insert the new block just before </head> (with a comment)
  if (removedCount > 0) {
    // Find closing </head> and insert before it
    const insert = `\n  <!-- Favicon -->\n${NEW_FAVICON_BLOCK}\n`;
    html = html.replace(/<\/head>/i, `${insert}</head>`);
  } else {
    // No prior favicon found — still insert one before </head>
    if (/<\/head>/i.test(html)) {
      const insert = `\n  <!-- Favicon -->\n${NEW_FAVICON_BLOCK}\n`;
      html = html.replace(/<\/head>/i, `${insert}</head>`);
      removedCount = -1; // signal that we added without removing
    }
  }

  if (html === original) {
    console.log(`  ⚠  No </head> found — skipped: ${filename}`);
    return false;
  }

  if (DRY_RUN) {
    const verb = removedCount > 0
      ? `replaced ${removedCount} link(s)`
      : `added new favicon`;
    console.log(`  ◌  [DRY RUN] ${filename} → ${verb}`);
    return true;
  }

  fs.writeFileSync(filepath, html, 'utf8');
  const verb = removedCount > 0
    ? `replaced ${removedCount} link(s)`
    : `added new favicon`;
  console.log(`  ✓  ${filename} → ${verb}`);
  return true;
}

/* ---------- Find all HTML files in project root ---------- */
const htmlFiles = fs
  .readdirSync(process.cwd())
  .filter((f) => f.endsWith('.html') && !f.includes('.bak'));

console.log('');
console.log('Updating favicon links across all HTML pages...');
if (DRY_RUN) console.log('MODE: dry-run (no files will be written)');
console.log('');

let count = 0;
for (const file of htmlFiles) {
  try {
    if (processFile(file)) count++;
  } catch (err) {
    console.error(`  ✗  Error on ${file}: ${err.message}`);
  }
}

console.log('');
console.log(`Done. ${count} of ${htmlFiles.length} pages processed.`);
console.log('');