import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { ThumbnailPath } from '../../domain/value-objects/ThumbnailPath.js';

/** Creates the missing (or, with force, every) thumbnail of the images under a folder; resolves to { created, skipped, failed }. */
export class ThumbnailBatch
{
  #generator;
  #log;

  constructor(generator, log = console)
  {
    this.#generator = generator;
    this.#log = log;
  }

  async run(directory, { force = false } = {})
  {
    const totals = { created: 0, skipped: 0, failed: 0 };
    for (const file of await ThumbnailBatch.#imagesIn(directory)) totals[await this.#process(directory, file, force)] += 1;
    return totals;
  }

  async #process(directory, file, force)
  {
    try {
      const { created } = await this.#generator.create(file, { force });
      return created ? this.#outcome('created', 'log', `  ✓ ${path.relative(directory, ThumbnailPath.of(file))}`) : 'skipped';
    } catch (error) {
      return this.#outcome('failed', 'warn', `  ✗ ${path.relative(directory, file)} — ${error.message}`);
    }
  }

  #outcome(outcome, level, line)
  {
    this.#log[level](line);
    return outcome;
  }

  static async #imagesIn(directory)
  {
    const entries = await readdir(directory, { recursive: true, withFileTypes: true });
    return entries.filter((entry) => entry.isFile() && !ThumbnailPath.isThumbnail(entry.name)).map((entry) => path.join(entry.parentPath ?? entry.path, entry.name));
  }
}
