import { Input } from '../../../domain/value-objects/Input.js';
import { UploadPath } from '../../../domain/value-objects/UploadPath.js';

/** Deletes a project; the database drops its screenshot rows, this deletes their files. */
export class DeleteProjectUseCase
{
  #projects;
  #gallery;
  #files;

  constructor(projects, gallery, fileStorage)
  {
    this.#projects = projects;
    this.#gallery = gallery;
    this.#files = fileStorage;
  }

  async execute(idInput)
  {
    const id = Input.id(idInput, 'Project');
    const images = await this.#gallery.findAll(id);
    await this.#projects.delete(id);
    await Promise.all(images.map((image) => this.#files.remove(UploadPath.removableFile(image.url))));
  }
}
