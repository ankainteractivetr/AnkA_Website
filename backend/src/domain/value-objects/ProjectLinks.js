import { Input } from './Input.js';

/**
 * A project's outbound links; each is null when not set. The SourceForge badge needs both the project name
 * (its page, sourceforge.net/p/<name>/) and the numeric group id (its badge image).
 */
export class ProjectLinks
{
  constructor({ steamWidget = null, microsoftStore = null, trailer = null, download = null, sourceforgeName = null, sourceforgeGroupId = null } = {})
  {
    Object.assign(this, { steamWidget, microsoftStore, trailer, download, sourceforgeName, sourceforgeGroupId });
    Object.freeze(this);
  }

  static create(input)
  {
    const links = input ?? {};
    return new ProjectLinks({
      steamWidget: Input.link(links.steamWidget, 'Steam widget URL'), microsoftStore: Input.link(links.microsoftStore, 'Microsoft Store URL'),
      trailer: Input.link(links.trailer, 'Trailer URL'), download: Input.link(links.download, 'Download URL'),
      sourceforgeName: Input.nullable(links.sourceforgeName, 'SourceForge project name', { max: 100 }),
      sourceforgeGroupId: Input.nullable(links.sourceforgeGroupId, 'SourceForge group ID', { max: 20 }),
    });
  }
}
