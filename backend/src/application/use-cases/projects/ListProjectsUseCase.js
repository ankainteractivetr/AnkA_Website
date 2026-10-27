/** Every project (or, with publishedOnly, the website's) with its screenshots, loaded in one query for all projects. */
export class ListProjectsUseCase
{
  #projects;
  #gallery;
  #publishedOnly;

  constructor(projects, gallery, { publishedOnly = false } = {})
  {
    this.#projects = projects;
    this.#gallery = gallery;
    this.#publishedOnly = publishedOnly;
  }

  async execute()
  {
    const projects = await this.#projects.findAll({ publishedOnly: this.#publishedOnly });
    const images = await this.#gallery.findByOwners(projects.map((project) => project.id));
    return projects.map((project) => project.withImages(images.get(project.id) ?? []));
  }
}
