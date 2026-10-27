import { GetAboutUseCase } from './application/use-cases/about/GetAboutUseCase.js';
import { SaveAboutUseCase } from './application/use-cases/about/SaveAboutUseCase.js';
import { MarkMessageUseCase } from './application/use-cases/contact/MarkMessageUseCase.js';
import { SaveContactInfoUseCase } from './application/use-cases/contact/SaveContactInfoUseCase.js';
import { AddGalleryImageUseCase } from './application/use-cases/gallery/AddGalleryImageUseCase.js';
import { DeleteGalleryImageUseCase } from './application/use-cases/gallery/DeleteGalleryImageUseCase.js';
import { ListGalleryImagesUseCase } from './application/use-cases/gallery/ListGalleryImagesUseCase.js';
import { ReorderGalleryImagesUseCase } from './application/use-cases/gallery/ReorderGalleryImagesUseCase.js';
import { DeleteProjectUseCase } from './application/use-cases/projects/DeleteProjectUseCase.js';
import { ListProjectsUseCase } from './application/use-cases/projects/ListProjectsUseCase.js';
import { SaveProjectUseCase } from './application/use-cases/projects/SaveProjectUseCase.js';
import { DeleteUseCase } from './application/use-cases/shared/DeleteUseCase.js';
import { ListUseCase } from './application/use-cases/shared/ListUseCase.js';
import { ReorderUseCase } from './application/use-cases/shared/ReorderUseCase.js';
import { SaveListItemUseCase } from './application/use-cases/shared/SaveListItemUseCase.js';
import { ClientWork } from './domain/entities/ClientWork.js';
import { SocialLink } from './domain/entities/SocialLink.js';
import { ImageUploadMiddleware } from './presentation/http/middleware/ImageUploadMiddleware.js';
import { CommandController } from './presentation/http/controllers/CommandController.js';
import { Endpoint } from './presentation/http/routes/Endpoint.js';
import { EndpointRoutes } from './presentation/http/routes/EndpointRoutes.js';

const bodyField = (field) => (req) => req.body?.[field];
const routeId = (req) => req.params.id;
const saveInput = (req) => ({ id: req.params.id, input: req.body });
const noOwner = () => null;

// The lists edited row by row: their path and response keys, and the record name of their error messages.
const SOCIAL_LINKS = Object.freeze({ path: '/social-links', item: 'socialLink', list: 'socialLinks', field: 'Link' });
const CLIENT_WORKS = Object.freeze({ path: '/client-works', item: 'clientWork', list: 'clientWorks', field: 'Work' });

/** Wires the CMS endpoints under /api/admin (all behind the login) from the container's repositories and services. */
export class AdminModule
{
  #c;

  constructor(container)
  {
    this.#c = container;
  }

  routes(authMiddleware)
  {
    const { aboutImages, projectImages, socialLinks, clientWorks } = this.#c;
    const galleries = [...this.#galleryEndpoints('/about/images', aboutImages, noOwner), ...this.#galleryEndpoints('/projects/:id/images', projectImages, routeId)];
    const lists = [...AdminModule.#orderedListEndpoints(SOCIAL_LINKS, socialLinks, SocialLink), ...AdminModule.#orderedListEndpoints(CLIENT_WORKS, clientWorks, ClientWork)];
    const endpoints = [...this.#aboutEndpoints(), ...this.#projectEndpoints(), ...galleries, ...this.#contactEndpoints(), ...lists, ...this.#submissionEndpoints()];
    return new EndpointRoutes('/admin', endpoints, [authMiddleware.handle]);
  }

  #aboutEndpoints()
  {
    const { about, aboutImages } = this.#c;
    return [
      Endpoint.query('get', '/about', new GetAboutUseCase(about, aboutImages), 'about'),
      Endpoint.command('put', '/about', new SaveAboutUseCase(about, aboutImages), { inputOf: bodyField('about'), responseKey: 'about' }),
    ];
  }

  #projectEndpoints()
  {
    const { projects, projectImages, fileStorage } = this.#c;
    return [
      Endpoint.query('get', '/projects', new ListProjectsUseCase(projects, projectImages), 'projects'),
      ...AdminModule.#saveEndpoints('/projects', 'project', new SaveProjectUseCase(projects, projectImages)),
      Endpoint.command('delete', '/projects/:id', new DeleteProjectUseCase(projects, projectImages, fileStorage), { inputOf: routeId }),
    ];
  }

  /** POST creates an entry, PUT /:id updates one; both answer { [responseKey]: the saved entry }. */
  static #saveEndpoints(path, responseKey, save)
  {
    return [
      Endpoint.command('post', path, save, { inputOf: (req) => ({ input: req.body }), responseKey, status: 201 }),
      Endpoint.command('put', `${path}/:id`, save, { inputOf: saveInput, responseKey }),
    ];
  }

  /** List, upload, reorder and delete of one gallery; `ownerOf(req)` picks its owner (null for the about gallery). */
  #galleryEndpoints(path, gallery, ownerOf)
  {
    const { fileStorage } = this.#c;
    return [
      Endpoint.query('get', path, new ListGalleryImagesUseCase(gallery), 'images', (req) => ({ ownerId: ownerOf(req) })),
      this.#uploadEndpoint(path, gallery, ownerOf),
      Endpoint.command('put', `${path}/order`, new ReorderGalleryImagesUseCase(gallery), { inputOf: (req) => ({ ownerId: ownerOf(req), ids: req.body?.ids }), responseKey: 'images' }),
      Endpoint.command('delete', `${path}/:imageId`, new DeleteGalleryImageUseCase(gallery, fileStorage), { inputOf: (req) => ({ ownerId: ownerOf(req), id: req.params.imageId }) }),
    ];
  }

  #uploadEndpoint(path, gallery, ownerOf)
  {
    const { fileStorage, config } = this.#c;
    const add = new AddGalleryImageUseCase(gallery, fileStorage, config.uploads.maxBytes);
    const inputOf = (req) => ({ ownerId: ownerOf(req), bytes: req.file?.buffer, alt: req.body?.alt });
    return Endpoint.of('post', path, new ImageUploadMiddleware(config.uploads.maxBytes).handle, new CommandController(add, { inputOf, responseKey: 'image', status: 201 }).handle);
  }

  #contactEndpoints()
  {
    const { contactInfo } = this.#c;
    return [
      Endpoint.query('get', '/contact-info', new ListUseCase(contactInfo, 'find'), 'contactInfo'),
      Endpoint.command('put', '/contact-info', new SaveContactInfoUseCase(contactInfo), { inputOf: bodyField('contactInfo'), responseKey: 'contactInfo' }),
    ];
  }

  /** Order, list, create, update and delete of an OrderedListRepository; "order" comes first, so it is not taken for an id. */
  static #orderedListEndpoints(list, repository, entity)
  {
    const { path, item, field } = list;
    return [
      Endpoint.command('put', `${path}/order`, new ReorderUseCase(repository), { inputOf: bodyField('ids'), responseKey: list.list }),
      Endpoint.query('get', path, new ListUseCase(repository), list.list),
      ...AdminModule.#saveEndpoints(path, item, new SaveListItemUseCase(repository, entity, field)),
      Endpoint.command('delete', `${path}/:id`, new DeleteUseCase(repository, field), { inputOf: routeId }),
    ];
  }

  #submissionEndpoints()
  {
    const { contactMessages, gameFeedbacks, highScores } = this.#c;
    return [
      ...AdminModule.#logEndpoints('/messages', 'messages', contactMessages, 'Message'),
      Endpoint.command('put', '/messages/:id/read', new MarkMessageUseCase(contactMessages), { inputOf: (req) => ({ id: req.params.id, isRead: req.body?.isRead }), responseKey: 'message' }),
      ...AdminModule.#logEndpoints('/feedbacks', 'feedbacks', gameFeedbacks, 'Feedback'),
      ...AdminModule.#logEndpoints('/high-scores', 'highScores', highScores, 'Score'),
    ];
  }

  /** GET (latest entries) and DELETE of a list that visitors and games fill in. */
  static #logEndpoints(path, key, repository, field)
  {
    return [
      Endpoint.query('get', path, new ListUseCase(repository, 'findRecent'), key),
      Endpoint.command('delete', `${path}/:id`, new DeleteUseCase(repository, field), { inputOf: routeId }),
    ];
  }
}
