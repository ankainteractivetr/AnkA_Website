const EMPTY_TEXT = Object.freeze({ en: '', tr: '' });
const LINK_KEYS = Object.freeze(['steamWidget', 'microsoftStore', 'trailer', 'download', 'sourceforgeName', 'sourceforgeGroupId']);

/** Maps a project between the API's shape and the CMS form's, where every value is a string or flag, so inputs stay controlled. */
export class ProjectForm
{
  static empty()
  {
    const texts = { tagline: EMPTY_TEXT, status: EMPTY_TEXT, description: EMPTY_TEXT, features: EMPTY_TEXT };
    return { id: null, type: 'game', title: '', slug: '', displayOrder: '0', ...texts, links: ProjectForm.#linksOf(null), isPublished: true };
  }

  static from(project)
  {
    const { id, type, title, slug, tagline, status, description, features, isPublished } = project;
    return { id, type, title, slug, displayOrder: String(project.displayOrder), tagline, status, description, features, links: ProjectForm.#linksOf(project.links), isPublished };
  }

  static toPayload(form)
  {
    return { ...form, displayOrder: Number(form.displayOrder) || 0 };
  }

  static #linksOf(links)
  {
    return Object.fromEntries(LINK_KEYS.map((key) => [key, links?.[key] ?? '']));
  }
}
