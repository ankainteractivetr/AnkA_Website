/** Uploaded images live in backend/uploads and are stored in the database as their public address: /uploads/<relative path>. */
export class UploadPath
{
  static #PREFIX = '/uploads/';

  static url(relativePath)
  {
    return `${UploadPath.#PREFIX}${relativePath}`;
  }

  /** The file behind `url`, relative to the uploads folder, or null for an address outside /uploads. */
  static removableFile(url)
  {
    if (typeof url !== 'string' || !url.startsWith(UploadPath.#PREFIX)) return null;
    return url.slice(UploadPath.#PREFIX.length);
  }
}
