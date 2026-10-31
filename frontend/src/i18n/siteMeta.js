import { PageMeta } from '../domain/PageMeta';

/** The site's title and description per language; index.html carries the English ones for crawlers that run no JavaScript. */
export const SITE_META = Object.freeze({
  en: new PageMeta({
    title: 'AnkA Interactive | Game & Software Studio from Ankara, Türkiye',
    description: 'AnkA Interactive is an independent game and software studio from Ankara, Türkiye: makers of Shahmaran, Ayzıt and Talay, and of websites and apps for clients.',
    locale: 'en_US',
  }),
  tr: new PageMeta({
    title: "AnkA Interactive | Ankara'dan Oyun ve Yazılım Stüdyosu",
    description: "AnkA Interactive, Ankara'da bağımsız bir oyun ve yazılım stüdyosu: Şahmeran, Ayzıt ve Talay'ın yapımcısı. Restoran ve kafeler için web sitesi, online sipariş ve kasa uygulaması; diğer işletmeler için özel yazılım geliştirir.",
    locale: 'tr_TR',
  }),
});
