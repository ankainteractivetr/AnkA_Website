import { ContactInfoRepository } from '../../application/ports/ContactInfoRepository.js';
import { ContactInfo } from '../../domain/entities/ContactInfo.js';
import { LocalizedText } from '../../domain/value-objects/LocalizedText.js';
import { MySqlSingletonRow } from '../database/MySqlSingletonRow.js';

export class MySqlContactInfoRepository extends ContactInfoRepository
{
  #row;

  constructor(db)
  {
    super();
    this.#row = new MySqlSingletonRow(db, 'contact_info', ['intro_en', 'intro_tr', 'outro_en', 'outro_tr', 'email', 'map_embed_url']);
  }

  async find()
  {
    const row = await this.#row.find();
    return row ? MySqlContactInfoRepository.#toEntity(row) : new ContactInfo();
  }

  async save(info)
  {
    await this.#row.save([info.intro.en, info.intro.tr, info.outro.en, info.outro.tr, info.email, info.mapEmbedUrl]);
  }

  static #toEntity(row)
  {
    const intro = new LocalizedText(row.intro_en ?? '', row.intro_tr ?? '');
    return new ContactInfo({ intro, outro: new LocalizedText(row.outro_en ?? '', row.outro_tr ?? ''), email: row.email, mapEmbedUrl: row.map_embed_url });
  }
}
