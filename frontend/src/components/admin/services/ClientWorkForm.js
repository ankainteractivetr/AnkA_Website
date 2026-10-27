/**
 * Maps a client work between the API's shape and the CMS form's, where every value is a string or flag, so inputs stay
 * controlled. `saved` keeps the work as last saved (with the frame address the API worked out) for the preview.
 */
export class ClientWorkForm
{
  static empty()
  {
    return { id: null, title: '', kind: 'web', url: '', isPublished: true, saved: null };
  }

  static from(work)
  {
    return { id: work.id, title: work.title, kind: work.media.kind, url: work.media.url, isPublished: work.isPublished, saved: work };
  }

  static toPayload(form)
  {
    return { id: form.id, title: form.title, media: { kind: form.kind, url: form.url }, isPublished: form.isPublished };
  }
}
