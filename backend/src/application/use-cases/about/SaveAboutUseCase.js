import { AboutContent } from '../../../domain/entities/AboutContent.js';

/** Saves the about section's title and story; resolves to the section with its gallery. */
export class SaveAboutUseCase
{
  #about;
  #gallery;

  constructor(about, gallery)
  {
    this.#about = about;
    this.#gallery = gallery;
  }

  async execute(input)
  {
    const about = AboutContent.create(input);
    await this.#about.save(about);
    return about.withImages(await this.#gallery.findAll(null));
  }
}
