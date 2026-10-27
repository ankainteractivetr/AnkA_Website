import { HostName } from '../../../domain/HostName';

// A framed website may run and open its links in new tabs, but never navigate (or frame-bust) this page.
const WEBSITE_SANDBOX = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';
const VIDEO_FEATURES = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

/**
 * How each kind of client work is presented (a strategy per kind, keyed like the API's media.kind): its name, list icon,
 * caption (`caption(media, t)`, t from useLanguage), the CMS placeholder and hint for its address, and the frame it is shown in.
 */
export const WORK_KINDS = Object.freeze({
  web: Object.freeze({
    label: { en: 'Website', tr: 'Web sitesi' },
    icon: 'globe',
    caption: (media) => HostName.of(media.url),
    urlPlaceholder: 'https://www.depizzazz.com.tr',
    urlHint: { en: 'The site is shown in a frame. Some sites refuse to be framed; visitors can still open them with "Open".', tr: 'Site bir çerçeve içinde gösterilir. Bazı siteler çerçevede açılmayı reddeder; ziyaretçiler yine de "Aç" ile açabilir.' },
    frame: { className: 'h-[480px] sm:h-[600px]', sandbox: WEBSITE_SANDBOX },
  }),
  app: Object.freeze({
    label: { en: 'App (YouTube video)', tr: 'Uygulama (YouTube videosu)' },
    icon: 'play',
    caption: (_media, t) => t('App · Video', 'Uygulama · Video'),
    urlPlaceholder: 'https://youtu.be/...',
    urlHint: { en: 'A YouTube video link: https://youtu.be/… or https://www.youtube.com/watch?v=…', tr: 'Bir YouTube video linki: https://youtu.be/… veya https://www.youtube.com/watch?v=…' },
    frame: { className: 'aspect-video', allow: VIDEO_FEATURES, allowFullScreen: true },
  }),
});
