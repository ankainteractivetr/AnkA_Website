/** The CMS sections in the sidebar, in order. */
export const ADMIN_SECTIONS = Object.freeze([
  { to: '/admin', end: true, icon: '◈', label: { en: 'Dashboard', tr: 'Pano' } },
  { to: '/admin/about', icon: '✦', label: { en: 'About', tr: 'Hakkında' } },
  { to: '/admin/projects', icon: '⬡', label: { en: 'Projects', tr: 'Projeler' } },
  { to: '/admin/services', icon: '❖', label: { en: 'Services', tr: 'Hizmetler' } },
  { to: '/admin/contact', icon: '✉', label: { en: 'Contact', tr: 'İletişim' } },
  { to: '/admin/submissions', icon: '⚑', label: { en: 'Submissions', tr: 'Gönderiler' } },
]);
