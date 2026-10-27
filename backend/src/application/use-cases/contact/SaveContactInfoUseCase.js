import { ContactInfo } from '../../../domain/entities/ContactInfo.js';

export class SaveContactInfoUseCase
{
  #contactInfo;

  constructor(contactInfo)
  {
    this.#contactInfo = contactInfo;
  }

  async execute(input)
  {
    const info = ContactInfo.create(input);
    await this.#contactInfo.save(info);
    return info;
  }
}
