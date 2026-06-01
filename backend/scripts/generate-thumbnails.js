#!/usr/bin/env node
// ============================================================================
//  scripts/generate-thumbnails.js
//
//  Walks backend/uploads (recursively, including /seed) and creates a
//  "_thumb" variant for every image that doesn't already have one.
//
//  Usage:
//      node scripts/generate-thumbnails.js          # create only missing thumbs
//      node scripts/generate-thumbnails.js --force  # rebuild every thumbnail
//
//  Or via npm:
//      npm run thumbs
//      npm run thumbs -- --force
// ============================================================================
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const { generateThumbnail, isThumbPath, THUMBABLE, THUMB_MAX } = require('../src/lib/thumbnail');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const FORCE = process.argv.includes('--force');

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else out.push(full);
    }
    return out;
}

(async () => {
    if (!fs.existsSync(UPLOAD_DIR)) {
        console.error(`[thumbs] uploads directory not found: ${UPLOAD_DIR}`);
        process.exit(1);
    }

    console.log(`[thumbs] scanning ${UPLOAD_DIR}`);
    console.log(`[thumbs] max edge: ${THUMB_MAX}px  |  force: ${FORCE ? 'yes' : 'no'}\n`);

    const files = walk(UPLOAD_DIR);
    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!THUMBABLE.has(ext) || isThumbPath(file)) continue;

        const rel = path.relative(UPLOAD_DIR, file);
        try {
            const result = await generateThumbnail(file, { force: FORCE });
            if (result.ok && !result.skipped) {
                created++;
                console.log(`  ✓ ${path.relative(UPLOAD_DIR, result.thumbPath)}`);
            } else {
                skipped++;
            }
        } catch (err) {
            failed++;
            console.warn(`  ✗ ${rel} — ${err.message}`);
        }
    }

    console.log(`\n[thumbs] done: ${created} created, ${skipped} skipped, ${failed} failed.`);
    process.exit(failed > 0 ? 1 : 0);
})();
