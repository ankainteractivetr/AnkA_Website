const WWW = /^www\./i;

/** The host of an address without "www.", e.g. as a site's name: https://www.depizzazz.com.tr/menu → depizzazz.com.tr. */
export class HostName
{
  static of(url)
  {
    try {
      return new URL(url).hostname.replace(WWW, '');
    } catch {
      return String(url ?? '');
    }
  }
}
