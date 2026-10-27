/** One CMS gallery under `path` (e.g. /admin/about/images): list, upload, reorder and delete its images. */
export class AdminGallery
{
  #http;
  #path;

  constructor(httpClient, path)
  {
    this.#http = httpClient;
    this.#path = path;
  }

  async list()
  {
    const { images } = await this.#http.get(this.#path);
    return images;
  }

  /** Uploads one image file; resolves to the stored image (the API also makes its thumbnail). */
  async upload(file, alt = '')
  {
    const form = new FormData();
    form.append('file', file);
    form.append('alt', alt);
    const { image } = await this.#http.post(this.#path, form);
    return image;
  }

  /** Saves an order: the `ids` in their new order, first one first; resolves to the reordered images. */
  async reorder(ids)
  {
    const { images } = await this.#http.put(`${this.#path}/order`, { ids });
    return images;
  }

  async remove(id)
  {
    await this.#http.delete(`${this.#path}/${id}`);
  }
}
