import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { FileStorage } from '../../application/ports/FileStorage.js';

/** Stores uploads as backend/uploads/<uuid>.<ext>; never touches anything outside that folder. */
export class LocalFileStorage extends FileStorage
{
  #root;

  constructor(rootDirectory)
  {
    super();
    this.#root = path.resolve(rootDirectory);
  }

  async save(imageFile)
  {
    const relativePath = `${randomUUID()}.${imageFile.extension}`;
    await mkdir(this.#root, { recursive: true });
    await writeFile(this.pathOf(relativePath), imageFile.bytes);
    return relativePath;
  }

  async remove(relativePath)
  {
    if (!relativePath) return;
    await unlink(this.pathOf(relativePath)).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }

  pathOf(relativePath)
  {
    const absolute = path.resolve(this.#root, relativePath);
    if (!absolute.startsWith(this.#root + path.sep)) throw new Error(`Refusing to touch a file outside uploads: ${relativePath}`);
    return absolute;
  }
}
