import { GetAboutUseCase } from './application/use-cases/about/GetAboutUseCase.js';
import { GetContactPageUseCase } from './application/use-cases/contact/GetContactPageUseCase.js';
import { ListProjectsUseCase } from './application/use-cases/projects/ListProjectsUseCase.js';
import { ListUseCase } from './application/use-cases/shared/ListUseCase.js';
import { Endpoint } from './presentation/http/routes/Endpoint.js';
import { EndpointRoutes } from './presentation/http/routes/EndpointRoutes.js';

/** The read-only endpoints under /api/public that feed the website. */
export class PublicModule
{
  #c;

  constructor(container)
  {
    this.#c = container;
  }

  routes()
  {
    const { about, aboutImages, projects, projectImages, clientWorks, contactInfo, socialLinks } = this.#c;
    return new EndpointRoutes('/public', [
      Endpoint.query('get', '/about', new GetAboutUseCase(about, aboutImages), 'about'),
      Endpoint.query('get', '/projects', new ListProjectsUseCase(projects, projectImages, { publishedOnly: true }), 'projects'),
      Endpoint.query('get', '/client-works', new ListUseCase(clientWorks, 'findPublished'), 'clientWorks'),
      Endpoint.query('get', '/contact-info', new GetContactPageUseCase(contactInfo, socialLinks), 'contactInfo'),
    ]);
  }
}
