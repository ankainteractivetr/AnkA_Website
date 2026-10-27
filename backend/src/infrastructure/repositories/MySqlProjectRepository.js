import { ProjectRepository } from '../../application/ports/ProjectRepository.js';
import { Project } from '../../domain/entities/Project.js';
import { ConflictError } from '../../domain/errors.js';
import { LocalizedText } from '../../domain/value-objects/LocalizedText.js';
import { ProjectLinks } from '../../domain/value-objects/ProjectLinks.js';

const COLUMNS = [
  'slug', 'type', 'title', 'tagline_en', 'tagline_tr', 'description_en', 'description_tr', 'features_en', 'features_tr',
  'steam_widget_url', 'microsoft_store_url', 'sourceforge_name', 'sourceforge_group_id', 'trailer_url', 'download_url',
  'status_en', 'status_tr', 'display_order', 'is_published',
];
const SELECT = `SELECT id, ${COLUMNS.join(', ')} FROM projects`;
const ORDER = 'ORDER BY type, display_order, id';
const INSERT = `INSERT INTO projects (${COLUMNS.join(', ')}) VALUES (${COLUMNS.map(() => '?').join(', ')})`;
const UPDATE = `UPDATE projects SET ${COLUMNS.map((column) => `${column} = ?`).join(', ')} WHERE id = ?`;

const localizedOf = (row, prefix) => new LocalizedText(row[`${prefix}_en`] ?? '', row[`${prefix}_tr`] ?? '');

export class MySqlProjectRepository extends ProjectRepository
{
  #db;

  constructor(db)
  {
    super();
    this.#db = db;
  }

  findAll({ publishedOnly = false } = {})
  {
    return this.#select(publishedOnly ? `WHERE is_published = 1 ${ORDER}` : ORDER);
  }

  async findById(id)
  {
    const [project] = await this.#select('WHERE id = ?', [id]);
    return project ?? null;
  }

  async create(project)
  {
    const result = await this.#db.query(INSERT, MySqlProjectRepository.#valuesOf(project)).catch(MySqlProjectRepository.#rejectDuplicateSlug);
    return project.withId(result.insertId);
  }

  async update(project)
  {
    await this.#db.query(UPDATE, [...MySqlProjectRepository.#valuesOf(project), project.id]).catch(MySqlProjectRepository.#rejectDuplicateSlug);
  }

  async delete(id)
  {
    await this.#db.query('DELETE FROM projects WHERE id = ?', [id]);
  }

  async #select(clause, params = [])
  {
    const rows = await this.#db.query(`${SELECT} ${clause}`, params);
    return rows.map((row) => MySqlProjectRepository.#toEntity(row));
  }

  static #rejectDuplicateSlug(error)
  {
    throw error.code === 'ER_DUP_ENTRY' ? new ConflictError('Slug already exists.') : error;
  }

  static #valuesOf(project)
  {
    const { tagline, description, features, status, links } = project;
    return [project.slug, project.type, project.title, tagline.en, tagline.tr, description.en, description.tr, features.en, features.tr,
      links.steamWidget, links.microsoftStore, links.sourceforgeName, links.sourceforgeGroupId, links.trailer, links.download,
      status.en || null, status.tr || null, project.displayOrder, project.isPublished ? 1 : 0];
  }

  static #toEntity(row)
  {
    return new Project({
      id: row.id, slug: row.slug, type: row.type, title: row.title, tagline: localizedOf(row, 'tagline'), description: localizedOf(row, 'description'),
      features: localizedOf(row, 'features'), status: localizedOf(row, 'status'), links: MySqlProjectRepository.#linksOf(row),
      displayOrder: row.display_order, isPublished: Boolean(row.is_published),
    });
  }

  static #linksOf(row)
  {
    return new ProjectLinks({
      steamWidget: row.steam_widget_url, microsoftStore: row.microsoft_store_url, trailer: row.trailer_url, download: row.download_url,
      sourceforgeName: row.sourceforge_name, sourceforgeGroupId: row.sourceforge_group_id,
    });
  }
}
