/** What AnkA offers businesses, in page order: the restaurant offer first and `featured`, linking to its own page (/restoran). */
export const SERVICE_OFFERS = Object.freeze([
  {
    id: 'restaurants',
    icon: 'utensils',
    featured: true,
    title: { en: 'For restaurants & cafés', tr: 'Restoran ve kafeler için' },
    text: { en: 'Websites with regulation-ready QR menus, commission-free online ordering and our own point-of-sale app.', tr: 'Yönetmeliğe uygun QR menülü web sitesi, komisyonsuz online sipariş ve kendi kasa uygulamamız.' },
    link: { href: '/restoran', label: { en: 'See packages', tr: 'Paketleri inceleyin' } },
  },
  {
    id: 'web',
    icon: 'globe',
    title: { en: 'Websites & web apps', tr: 'Web siteleri ve web uygulamaları' },
    text: { en: 'Fast, custom-built websites with easy content management and the integrations your business needs.', tr: 'İçeriğini kolayca yönetebileceğiniz, işinize özel ve hızlı siteler; ihtiyaç duyduğunuz entegrasyonlarla.' },
  },
  {
    id: 'desktop',
    icon: 'monitor',
    title: { en: 'Desktop & business software', tr: 'Masaüstü ve işletme yazılımları' },
    text: {
      en: 'Native Windows applications in C++ with WinUI, the Windows API, Direct2D and Direct3D (HLSL), from our own tools like Talay and Ayzıt to integrations with your existing systems. Every app comes with lifetime maintenance.',
      tr: "C++ ile WinUI, Windows API, Direct2D ve Direct3D (HLSL) kullanan yerel Windows uygulamaları; Talay ve Ayzıt gibi kendi araçlarımızdan mevcut sistemlerinizle entegrasyonlara kadar. Tüm uygulamalarımız ömür boyu bakım garantilidir.",
    },
  },
  {
    id: 'games',
    icon: 'gamepad',
    title: { en: 'Games & interactive', tr: 'Oyun ve interaktif projeler' },
    text: { en: 'Our own games like Shahmaran, plus interactive and real-time 3D projects.', tr: 'Shahmaran gibi kendi oyunlarımız; interaktif ve gerçek zamanlı 3D projeler.' },
  },
]);
