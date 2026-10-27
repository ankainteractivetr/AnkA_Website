/** The about section with its gallery. */
export class GetAboutUseCase
{
  #about;
  #gallery;

  constructor(about, gallery)
  {
    this.#about = about;
    this.#gallery = gallery;
  }

  async execute()
  {
    const [about, images] = await Promise.all([this.#about.find(), this.#gallery.findAll(null)]);
    return about.withImages(images);
  }
}
