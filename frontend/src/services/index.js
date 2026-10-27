// Composition root: the single instance of each service, wired to one HTTP client.
import { MediaUrl } from '../domain/MediaUrl';
import { ApiResource } from './ApiResource';
import { AuthService } from './AuthService';
import { BrowserLanguage } from './BrowserLanguage';
import { CachedResource } from './CachedResource';
import { ContactService } from './ContactService';
import { HttpClient } from './HttpClient';
import { IdleScheduler } from './IdleScheduler';
import { LanguageStore } from './LanguageStore';
import { LoadingTracker } from './LoadingTracker';
import { TrackedResource } from './TrackedResource';
import { AdminCollection } from './admin/AdminCollection';
import { AdminGallery } from './admin/AdminGallery';
import { AdminLog } from './admin/AdminLog';
import { AdminResource } from './admin/AdminResource';
import { BackgroundImageQueue } from './images/BackgroundImageQueue';

const httpClient = new HttpClient(import.meta.env.VITE_API_URL || `${import.meta.env.BASE_URL}api`);
const SITE_LANGUAGES = Object.freeze(['en', 'tr']);

// Everything the home page waits for counts as page loading: its data requests and every thumbnail on it.
// Page data is cached, so the about, projects, services and contact sections share one request each.
export const pageLoading = new LoadingTracker();
export const idleScheduler = new IdleScheduler(window);
const pageData = (resource) => new CachedResource(new TrackedResource(resource, pageLoading));

export const aboutService = pageData(new ApiResource(httpClient, '/public/about', 'about'));
export const projectsService = pageData(new ApiResource(httpClient, '/public/projects', 'projects'));
export const clientWorksService = pageData(new ApiResource(httpClient, '/public/client-works', 'clientWorks'));
export const contactInfoService = pageData(new ApiResource(httpClient, '/public/contact-info', 'contactInfo'));
export const contactService = new ContactService(httpClient);
export const authService = new AuthService(httpClient);

// Thumbnails first: full-size images load in the background only once the page and its thumbnails have.
export const mediaUrl = new MediaUrl(import.meta.env.VITE_BACKEND_URL ?? '');
export const fullImageQueue = new BackgroundImageQueue(pageLoading, idleScheduler);

export const languageStore = new LanguageStore('anka_lang', SITE_LANGUAGES);
// First visit (no saved choice): Turkish browsers get the Turkish site, every other language the English one.
export const browserLanguage = new BrowserLanguage(SITE_LANGUAGES, 'en');

/** CMS endpoints, used only inside /admin. */
export const admin = Object.freeze({
  about: new AdminResource(httpClient, '/admin/about', 'about'),
  aboutImages: new AdminGallery(httpClient, '/admin/about/images'),
  projects: new AdminCollection(httpClient, '/admin/projects', { item: 'project', list: 'projects' }),
  projectImages: (projectId) => new AdminGallery(httpClient, `/admin/projects/${projectId}/images`),
  clientWorks: new AdminCollection(httpClient, '/admin/client-works', { item: 'clientWork', list: 'clientWorks' }),
  contactInfo: new AdminResource(httpClient, '/admin/contact-info', 'contactInfo'),
  socialLinks: new AdminCollection(httpClient, '/admin/social-links', { item: 'socialLink', list: 'socialLinks' }),
  messages: new AdminLog(httpClient, '/admin/messages', 'messages'),
  feedbacks: new AdminLog(httpClient, '/admin/feedbacks', 'feedbacks'),
  highScores: new AdminLog(httpClient, '/admin/high-scores', 'highScores'),
});
