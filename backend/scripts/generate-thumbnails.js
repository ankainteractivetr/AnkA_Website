#!/usr/bin/env node
// Creates the "_thumb" copy of every image under backend/uploads (subfolders included) that has none yet.
//   npm run thumbs              only the missing thumbnails
//   npm run thumbs -- --force   rebuild every thumbnail
import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { ThumbnailSettings } from '../src/infrastructure/config/ThumbnailSettings.js';
import { JimpThumbnailGenerator } from '../src/infrastructure/images/JimpThumbnailGenerator.js';
import { ThumbnailBatch } from '../src/infrastructure/images/ThumbnailBatch.js';

const UPLOADS_DIR = fileURLToPath(new URL('../uploads', import.meta.url));
const force = process.argv.includes('--force');
const settings = ThumbnailSettings.from(process.env);

console.log(`[thumbs] scanning ${UPLOADS_DIR}\n[thumbs] max edge: ${settings.maxEdge}px  |  force: ${force ? 'yes' : 'no'}\n`);
new ThumbnailBatch(new JimpThumbnailGenerator(settings)).run(UPLOADS_DIR, { force }).then(({ created, skipped, failed }) =>
{
  console.log(`\n[thumbs] done: ${created} created, ${skipped} skipped, ${failed} failed.`);
  process.exitCode = failed > 0 ? 1 : 0;
});
