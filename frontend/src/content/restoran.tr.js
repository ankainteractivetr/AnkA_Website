/**
 * /restoran sayfasının bütün metinleri ve paket verileri: sözcükleri burada değiştirin, sayfa onları izler (bileşenler yalnızca yerleştirir).
 * Doldurulacak yerler büyük harfli TODO yer tutucularıdır; yayından önce README'deki grep komutu boş dönmeli.
 * Başlık, açıklama ve link önizleme etiketleri bu dosyada değil, frontend/restoran.html içinde (JavaScript'siz okunabilsinler diye).
 */

/** İletişim: WhatsApp numarası ülke koduyla, + ve boşluk olmadan (905XXXXXXXXX); telefon `tel:` linki ve ekranda görünen hali. */
export const CONTACT = Object.freeze({
  whatsapp: '905389325785',
  whatsappMessage: 'Merhaba, restoran hizmetleriniz hakkında bilgi almak istiyorum. İşletmemin adı: ',
  phoneHref: 'tel:+905389325785',
  phoneLabel: '0 538 932 57 85',
  email: 'contact@ankainteractive.com',
});

export const DEPIZZAZZ_URL = 'https://www.depizzazz.com.tr';

export const TOP_BAR = Object.freeze({ homeLabel: 'AnkA Interactive ana sayfa', whatsapp: 'WhatsApp' });

export const HERO = Object.freeze({
  title: 'Siparişleriniz sizin olsun, menünüz yönetmeliğe uygun.',
  text: 'Yönetmeliğe uygun QR menülü web sitesi, komisyonsuz online sipariş ve kasa uygulaması. Yazılımı kendimiz geliştiriyoruz; doğrudan geliştiriciyle çalışırsınız.',
  primary: "WhatsApp'tan yazın",
  secondary: 'Paketleri görün',
  trust: { label: 'Canlı örnek:', name: 'De Pizzazz, Denizli', url: DEPIZZAZZ_URL },
  /** Telefon çiziminde gösterilen örnek QR menü (gerçek bir işletme değil). */
  demo: {
    label: 'Örnek QR menü ekranı: ürün adı, fiyatı, alerjenleri ve kalorisi',
    venue: 'Örnek Kafe',
    category: 'Çorbalar ve başlangıçlar',
    items: [
      { name: 'Mercimek çorbası', price: '₺120', info: 'Alerjen: kereviz · 210 kcal' },
      { name: 'Sigara böreği', price: '₺160', info: 'Alerjen: gluten, süt, yumurta · 340 kcal' },
      { name: 'Çoban salata', price: '₺140', info: 'Alerjen: yok · 150 kcal' },
    ],
  },
});

export const SEFFAF_MENU = Object.freeze({
  title: 'Menülerde içerik ve alerjen bilgisi artık zorunlu',
  text: [
    "Tarım ve Orman Bakanlığı'nın düzenlemesiyle restoran, kafe ve benzeri işletmelerde yiyeceklerin içerik ve alerjen bilgileri ile kalori değerlerinin müşteriye sunulması zorunlu hale geldi. Bu bilgiler menüde, panoda, dijital ekranda ya da QR kodla verilebiliyor.",
    'QR kod kullanılıyorsa bunu belirten bir bilgilendirme yazısının görünür bir yere asılması, QR kullanamayan müşterilere de bilginin istek üzerine ayrıca sunulması gerekiyor.',
  ],
  deadlines: {
    title: 'Zincir olmayan işletmeler için duyurulan son tarihler',
    items: [{ label: 'İçerik ve alerjen bilgisi', date: '31 Aralık 2026' }, { label: 'Kalori bilgisi', date: '31 Aralık 2027' }],
    source: { label: 'Tarım ve Orman Bakanlığı duyurusu (Etiketleme Kılavuzu, md. 41 ve 47)', url: 'https://www.tarimorman.gov.tr/GKGM/Duyuru/681/Tgk-Gida-Etiketleme-Ve-Tuketicileri-Bilgilendirme-Yonetmeligi-Kilavuzu-Guncellendi' },
  },
  doTitle: 'Ne yapıyoruz?',
  does: [
    'Menünüzü mobil uyumlu QR menüye taşıyoruz (isteğe bağlı İngilizce).',
    'Her ürüne içerik, alerjen, kalori, et türü ve alkol/domuz türevi bilgisi alanlarını ekliyoruz.',
    'Asmanız gereken bilgilendirme yazısını ve masa QR kodlarını basıma hazır veriyoruz.',
    'QR kullanamayan müşterileriniz için yazdırılabilir bir içerik/alerjen listesi hazırlıyoruz.',
    'Menünüzü Google Haritalar profilinize bağlıyoruz.',
  ],
  note: 'Besin değeri ve alerjen bilgileri işletmenin beyanıdır; bir gıda mühendisi ya da uzman tarafından hazırlanmasını öneririz. Biz dijital altyapıyı ve yayını üstleniyoruz.',
  cta: 'Menünüzü birlikte kontrol edelim',
});

export const CALCULATOR = Object.freeze({
  title: 'Platforma her ay ne kadar ödüyorsunuz?',
  text: 'Kendi rakamlarınızı girin; kendi sipariş kanalınızla ne kadarını cebinizde tutabileceğinizi görün.',
  fields: {
    orders: { label: 'Aylık platform sipariş sayısı', placeholder: 'örn. 300' },
    basket: { label: 'Ortalama sepet tutarı (TL)', placeholder: 'örn. 400' },
    rate: { label: 'Platform komisyon oranı (%)', placeholder: 'örn. 20', hint: 'Sözleşmenizdeki oranı girin.' },
    share: { label: 'Kendi kanalınıza taşınabilecek pay', defaultValue: 20 },
  },
  results: { monthly: 'Aylık platform komisyonu', yearly: 'Yıllık platform komisyonu', savings: 'Yıllık tasarruf potansiyeli' },
  disclaimer: 'Hesap tahminidir. KDV, kampanya kesintileri ve kendi kanalınızın ödeme/kurye maliyetleri dahil değildir. Girdiğiniz rakamlar hiçbir yere gönderilmez.',
  after: 'Kendi sipariş kanalınız platformların yerini almak zorunda değil. Düzenli müşterilerinizi komisyonsuz kanala taşımanız yeter.',
  cta: 'Kendi sipariş sitenizi konuşalım',
});

/** Paketler: her biri bir öncekinin üstüne kurulur; ortadaki kart `badge` ile öne çıkar. Fiyat: tek seferlik satın alma (KDV hariç), aylık ücret yok. */
export const PACKAGES = Object.freeze({
  title: 'Paketler',
  text: 'Bir kez satın alırsınız, aylık abonelik yok. Web sitesiyle başlayın; online siparişi ve kasayı istediğiniz zaman ekleyin.',
  items: [
    {
      id: 'web-sitesi',
      name: 'Web Sitesi',
      tagline: 'Restoranınızın kendi sitesi, yönetmeliğe uygun QR menüsüyle.',
      features: [
        'Kendi alan adınızda restoran web sitesi',
        'Kolay menü yönetim paneli',
        'Yönetmeliğe uygun QR menü (isteğe bağlı İngilizce)',
        'İçerik, alerjen, kalori, et türü ve alkol/domuz türevi bilgisi alanları',
        'Basıma hazır bilgilendirme yazısı ve masa QR kodları',
        'QR kullanamayanlar için yazdırılabilir liste',
        'Google Haritalar profilinin düzenlenmesi ve menü linki',
        'Güvenlik güncellemeleri',
        'Ömür boyu bakım garantisi',
      ],
      price: { amount: '₺50.000', period: 'tek seferlik + KDV', setup: 'Kurulum dahil' },
    },
    {
      id: 'web-siparis',
      name: 'Web + Online Sipariş',
      tagline: 'Siparişleriniz kendi sitenizden, komisyonsuz.',
      badge: 'Önerilen',
      features: [
        'Web Sitesi paketindeki her şey',
        'Online sipariş: gel-al, restoranda, adrese teslim',
        'Kapıda ödemeyle hızlı başlangıç; sanal POS onayından sonra online kartla ödeme',
        'Aylık sipariş ve tasarruf özeti',
      ],
      price: { amount: '₺75.000', period: 'tek seferlik + KDV', setup: 'Kurulum dahil' },
      footnote: 'Platform komisyonu ödemezsiniz; online kartlı ödemede bankanızın veya ödeme kuruluşunuzun kesintisi geçerlidir.',
    },
    {
      id: 'web-siparis-kasa',
      name: 'Web + Sipariş + Kasa',
      tagline: 'Siteniz, siparişleriniz ve kasanız tek elden.',
      features: [
        'Web + Online Sipariş paketindeki her şey',
        'Kendi geliştirdiğimiz Windows kasa uygulaması',
        'Kurulum ve personelinize kullanım eğitimi',
      ],
      price: { amount: '₺150.000', period: 'tek seferlik + KDV', setup: 'Kurulum ve eğitim dahil' },
    },
  ],
  note: 'Alan adı ve hosting işletmenize aittir; yıllık ücretlerini doğrudan sağlayıcıya ödersiniz. Kurulum sırasında hepsini birlikte ayarlıyoruz.',
  extras: {
    title: 'Ek hizmetler',
    text: 'Her pakete eklenebilir; fiyatı teklifle.',
    items: [
      'Instagram ve Facebook yönetimi: aylık içerik planı, paylaşımlar ve Reels',
      'Google Haritalar yorumlarının takibi ve yanıtlanması',
      'Mevcut kasa programınızla entegrasyon',
    ],
  },
  cta: 'Size uygun paketi konuşalım',
});

export const STEPS = Object.freeze({
  title: 'Nasıl çalışıyoruz?',
  items: [
    { title: 'Ücretsiz analiz', text: 'Google Haritalar profilinize, Instagram hesabınıza, menünüze ve platform bağımlılığınıza bakıp 3 somut öneri veriyoruz.' },
    { title: 'Demo', text: 'Kendi menünüzle hazırlanmış bir örneği telefonunuzda görüyorsunuz.' },
    { title: 'Kurulum', text: 'Kurulumu biz yapıyoruz; ekibinize kısa bir kullanım eğitimi veriyoruz.' },
    { title: 'Takip', text: 'Sipariş ve Kasa paketlerinde aramalar, yol tarifleri, siteden gelen siparişler ve tasarruf edilen komisyon her ay tek sayfalık bir raporla size gelir.' },
  ],
  cta: 'Ücretsiz analiz için yazın',
});

/** Referans: ekran görüntüleri izin alındıktan sonra public/ altına konup `screenshots` dizisine eklenir ({ src, alt, width, height }). */
export const REFERENCE = Object.freeze({
  title: 'Canlı referans',
  name: 'De Pizzazz',
  place: 'Denizli',
  text: 'Restoranın web sitesini ve menüsünü kurduk; online sipariş modülü geliştiriliyor.',
  link: { label: 'Siteyi görün', url: DEPIZZAZZ_URL },
  screenshots: [],
});

export const WHY = Object.freeze({
  title: 'Neden AnkA?',
  items: [
    { icon: 'code', title: 'Yazılımı kendimiz geliştiriyoruz', text: 'Hazır bir platformun aboneliğini satmıyoruz; web sitesi, sipariş sistemi ve kasa uygulaması bizim yazılımımız.' },
    { icon: 'shield', title: 'Ömür boyu bakım garantisi', text: 'Kurduğumuz yazılımın bakımı, siz kullandığınız sürece bizde.' },
    { icon: 'chat', title: 'Doğrudan geliştiriciyle çalışırsınız', text: 'Aracı yok, hızlı dönüş.' },
    { icon: 'key', title: 'Alan adı da müşteri verileri de sizin', text: 'Bir platforma bağlı kalmazsınız.' },
    { icon: 'pin', title: "Ankara'da yüz yüze, diğer şehirlerde uzaktan", text: "Denizli'de canlı bir projemiz var." },
  ],
});

export const FAQ = Object.freeze({
  title: 'Sık sorulan sorular',
  items: [
    { q: 'Yemek sipariş platformlarından çıkmam mı gerekiyor?', a: 'Hayır. Kendi kanalınız platformların yanında çalışır; amaç düzenli müşterilerinizi komisyonsuz kanala taşımak.' },
    { q: 'Kendi kuryem yok, yine de olur mu?', a: 'Olur. Gel-al ve restoranda siparişle başlayabilirsiniz; adrese teslimi kurye düzeninize göre açarız.' },
    { q: 'Online ödeme için ne gerekiyor?', a: 'Bankanızdan sanal POS ya da bir ödeme kuruluşu hesabı. Onay gelene kadar kapıda ödemeyle başlarız.' },
    { q: 'Kalori ve alerjen bilgilerini siz mi hesaplıyorsunuz?', a: 'Hayır. Bu bilgiler işletmenin beyanıdır ve uzman tarafından hazırlanmalıdır; biz dijital altyapıyı ve yayını üstleniyoruz.' },
    { q: 'Menümü sık değiştiriyorum, ne olacak?', a: "Yönetim panelinden kendiniz güncelleyebilir ya da değişikliği WhatsApp'tan bize iletebilirsiniz." },
    { q: 'Kasa uygulaması hangi bilgisayarlarda çalışıyor?', a: 'Windows bilgisayarlarda çalışır. Kurulumu ve personelinizin eğitimini biz yapıyoruz.' },
    { q: 'Aylık ücret ödüyor muyum?', a: 'Hayır. Paketleri bir kez satın alırsınız; aylık abonelik yoktur. Yalnızca alan adı ve hosting için sağlayıcıya yıllık ücret ödersiniz. Yazılımın bakımı ömür boyu garantimiz altındadır.' },
    { q: 'Ankara dışındayım, çalışabilir miyiz?', a: 'Evet. Kurulum ve yönetim uzaktan da yapılabiliyor.' },
  ],
  cta: "Sorunuzu WhatsApp'tan sorun",
});

export const FOOTER = Object.freeze({ name: 'AnkA Interactive', city: 'Ankara', home: 'Ana sayfa' });

export const STICKY_CTA = "WhatsApp'tan yazın";
