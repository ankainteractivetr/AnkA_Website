import { Project } from '../../../domain/entities/Project.js';
import { NotFoundError } from '../../../domain/errors.js';
import { Input } from '../../../domain/value-objects/Input.js';

/** Creates a project, or updates one; resolves to the saved project with its screenshots. */
export class SaveProjectUseCase
{
  #projects;
  #gallery;

  constructor(projects, gallery)
  {
    this.#projects = projects;
    this.#gallery = gallery;
  }

  execute({ id, input })
  {
    return id === undefined ? this.#projects.create(Project.create(input)) : this.#update(Input.id(id, 'Project'), input);
  }

  async #update(id, input)
  {
    if (!(await this.#projects.findById(id))) throw new NotFoundError('Project not found.');
    const project = Project.create(input, id);
    await this.#projects.update(project);
    return project.withImages(await this.#gallery.findAll(id));
  }
}
