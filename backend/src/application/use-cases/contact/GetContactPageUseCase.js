/** The contact section's settings with the footer's active social links. */
export class GetContactPageUseCase
{
  #contactInfo;
  #socialLinks;

  constructor(contactInfo, socialLinks)
  {
    this.#contactInfo = contactInfo;
    this.#socialLinks = socialLinks;
  }

  async execute()
  {
    const [info, links] = await Promise.all([this.#contactInfo.find(), this.#socialLinks.findActive()]);
    return info.withSocialLinks(links);
  }
}
