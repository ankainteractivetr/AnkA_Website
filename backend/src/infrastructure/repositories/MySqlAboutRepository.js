import { AboutRepository } from '../../application/ports/AboutRepository.js';
import { AboutContent } from '../../domain/entities/AboutContent.js';
import { LocalizedText } from '../../domain/value-objects/LocalizedText.js';
import { MySqlSingletonRow } from '../database/MySqlSingletonRow.js';

export class MySqlAboutRepository extends AboutRepository
{
  #row;

  constructor(db)
  {
    super();
    this.#row = new MySqlSingletonRow(db, 'about_content', ['title', 'body_en', 'body_tr']);
  }

  async find()
  {
    const row = await this.#row.find();
    return row ? new AboutContent({ title: row.title, body: new LocalizedText(row.body_en ?? '', row.body_tr ?? '') }) : new AboutContent();
  }

  async save(about)
  {
    await this.#row.save([about.title, about.body.en, about.body.tr]);
  }
}
