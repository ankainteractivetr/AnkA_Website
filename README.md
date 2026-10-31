# AnkA Interactive — Web Sitesi (Vite + React + Tailwind CSS + Node.js + MySQL)

Modern, koyu temalı, çift dilli (Türkçe/İngilizce) AnkA Interactive web sitesi ve
yönetim paneli (CMS). Eski Python uygulamaları (`katip.py`, `umay.py`) ve iletişim
formu (`ulak.js`) Node.js'e taşınmıştır; eski oyun istemcileri değişiklik olmadan
çalışmaya devam eder.

> **EN:** Modern, dark-themed, bilingual (TR/EN) website + CMS for AnkA Interactive.
> Object-oriented JavaScript with a clean-architecture backend (Express + MySQL) and a
> React 19 + Tailwind CSS 4 frontend.

## Teknolojiler

- **frontend/** — React 19, Vite, Tailwind CSS 4, React Router, axios
- **backend/** — Node.js 20+, Express 5, MySQL (`mysql2`), JWT (httpOnly cookie), jimp (thumbnail)

```
AnkA_Website/
├── backend/
│   ├── anka.sql          → veritabanı şeması (yalnızca tablolar, içerik yok)
│   ├── uploads/          → yüklenen görseller (veri: git'te tutulmaz)
│   ├── server.js         → başlangıç dosyası (cPanel/Passenger ayarı değişmesin diye aynı yerde)
│   ├── scripts/          → npm run thumbs
│   └── src/
│       ├── domain/          → entity'ler, value object'ler, hatalar (framework'süz iş kuralları)
│       ├── application/     → port'lar (soyut sınıflar) ve use-case'ler
│       ├── infrastructure/  → MySQL, dosya depolama, jimp, SMTP, bcrypt, JWT adapter'ları
│       ├── presentation/    → Express: controller, middleware, route modülleri
│       ├── Container.js     → composition root: hangi port'u hangi sınıfın uyguladığını bilen tek yer
│       └── *Module.js       → Public / Admin / Legacy uç noktalarının bağlanması
├── frontend/
│   └── src/
│       ├── domain/      → saf sınıflar (MediaUrl, GalleryImage, InlineMarkup, Translator …)
│       ├── services/    → API ve tarayıcı adapter'ları; services/index.js composition root
│       ├── hooks/       → durum mantığı (useEditor, useAdminList, useThumbnail …)
│       ├── components/  → yalnızca Tailwind sınıflarıyla stillenmiş bileşenler
│       ├── pages/ layouts/ routes/ auth/ i18n/
│       └── index.css    → Tailwind 4 @theme token'ları + taban stiller
└── eslint-rules/        → ev kuralı: sınıf/fonksiyon gövdesinin { işareti yeni satırda
```

## Kod standartları

Her iki uygulama da `npm run lint` ile denetlenir (`eslint-rules/` + `*/eslint.config.js`):

- Fonksiyonlar en fazla **10 satır** (boş satırlar dahil).
- Her ifade **`;`** ile biter.
- Sınıf ve fonksiyon gövdelerinin **`{`** işareti yeni satırdadır.
- Nesne yönelimli, SOLID: her sınıfın tek sorumluluğu var; use-case'ler port'lara (soyut
  sınıflar) bağımlıdır, somut sınıfları yalnızca `Container.js` / `services/index.js` seçer.
- Kullanılan tasarım kalıpları: Composition Root / Dependency Injection, Repository, Adapter,
  Facade (`HttpServer`), Decorator (`ThumbnailingFileStorage`, `CachedResource`,
  `TrackedResource`), Strategy (galeri tablo eşlemeleri, `PasswordHasher`, `TokenService`,
  hizmet türleri: `WorkMedia` / `WORK_KINDS`),
  Null Object (`LogMailer`), Factory (`Endpoint`, `RateLimiter`, entity `create`), Observer
  (`LoadingTracker`), State Machine (`useEditor`).

## Kurulum

Node.js 20+ ve bir MySQL 8+ (veya MariaDB 10.4+) veritabanı gerekir.

```bash
npm run install:all
```

### Veritabanı ve görseller

Sitenin içeriği (veritabanı) ve yüklenen görselleri (`backend/uploads/`) repoda tutulmaz;
bunlar canlı siteden alınır:

1. Canlı veritabanının dökümünü yerel bir veritabanına (ör. `anka_website`) aktarın ve
   `backend/.env` içindeki `DB_NAME` değerini ona göre ayarlayın.
2. Canlı sunucudaki `uploads/` klasörünün içeriğini `backend/uploads/` altına kopyalayın
   (alt klasörleriyle birlikte; veritabanı görselleri `/uploads/…` yollarıyla tutar).

Boş bir kurulumda yalnızca tabloları oluşturmak için şemayı içe aktarın. Dosya hiçbir
tabloyu silmez ve içerik eklemez; CMS hesabı API'nin ilk açılışında `.env`'den oluşturulur,
metinler ve görseller CMS'ten girilir:

```bash
mysql -u root -p -e "CREATE DATABASE anka_website CHARACTER SET utf8mb4;"
mysql -u root -p anka_website < backend/anka.sql
```

> MySQL 8.4+ `mysql_native_password` eklentisini varsayılan olarak yüklemez. Uygulama
> kullanıcınız bu eklentiyle tanımlıysa bağlantı `ER_PLUGIN_IS_NOT_LOADED` ile reddedilir;
> kullanıcıyı `caching_sha2_password` ile yeniden tanımlayın:
> `ALTER USER 'kullanici'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'parola';`

### Ortam değişkenleri

- `backend/.env.example` → `backend/.env`
- `frontend/.env.example` → `frontend/.env` (geliştirmede boş bırakılabilir)

| Değişken (backend) | Açıklama |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL bağlantısı (`DB_NAME=anka_website`) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | CMS hesabı — her açılışta bu değerlerden yeniden oluşturulur. **`ADMIN_PASSWORD` zorunlu.** |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Oturum token'ı (zorunlu, uzun ve rastgele) ve süresi (varsayılan `7d`) |
| `SMTP_*` | İletişim formu e-postaları; `SMTP_HOST`/`SMTP_USER` boşsa e-postalar yalnızca loglanır |
| `CORS_ORIGINS` | İzin verilen frontend adresleri (virgülle ayrılmış) |
| `FRONTEND_DIR` | İsteğe bağlı: API'nin siteyi de sunması için derlenmiş frontend klasörü (ör. `../frontend/dist`) |
| `MAX_UPLOAD_SIZE_MB`, `THUMB_MAX_PX`, `THUMB_JPEG_QUALITY` | Yükleme sınırı ve thumbnail ayarları |

| Değişken (frontend) | Açıklama |
|---|---|
| `VITE_API_URL` | API adresi. Geliştirmede boş: Vite `/api` ve `/uploads` isteklerini backend'e yönlendirir |
| `VITE_BACKEND_URL` | Yüklenen görsellerin (`/uploads/…`) sunulduğu adres; boşsa sitenin kendi adresi |
| `API_PROXY_TARGET` | Yalnızca geliştirme: Vite'ın yönlendirdiği backend (varsayılan `http://localhost:5000`) |

> **Canlı derleme:** üretim değerlerini (`VITE_API_URL=https://www.ankainteractive.com/api`,
> `VITE_BACKEND_URL=https://api.ankainteractive.com`) `frontend/.env.production` dosyasına koyun.
> `frontend/.env` içinde kalırlarsa `npm run dev` de canlı API'yi kullanır.

## Geliştirme

```bash
npm run dev
```

API'yi http://localhost:5000, siteyi http://localhost:5173 adresinde başlatır. Vite `/api`
ve `/uploads` isteklerini API'ye yönlendirir; böylece ikisi tek origin üzerinde çalışır ve
CMS oturum çerezi CORS ayarı gerektirmez.

- Site: http://localhost:5173
- CMS: http://localhost:5173/admin
- Sağlık kontrolü: http://localhost:5173/api/health

```bash
npm run lint     # backend + frontend
npm run build    # frontend/dist
npm test         # birim testleri (node:test)
npm start        # backend (canlı)
```

## CMS / Yönetim paneli

- Adres: **`/admin`** — oturum yoksa giriş formu aynı adreste gösterilir.
- Oturum, JavaScript'in okuyamadığı bir **httpOnly çerezde** tutulur (XSS ile çalınamaz,
  `SameSite=Strict`). Bu yüzden site ve API aynı site altında olmalıdır
  (ör. `www.ankainteractive.com` ve `www.ankainteractive.com/api`).
- Giriş denemeleri ve iletişim formu IP başına hız sınırlıdır.

CMS ile yönetebilecekleriniz:

- **Hakkında**: başlık, EN/TR metin, galeri görselleri (yükle / sırala / sil)
- **Projeler**: oyun ve yazılımlar — başlık, slogan, açıklama, özellikler, durum, Steam
  widget, fragman, indirme, Microsoft Store ve SourceForge bağlantıları, ekran görüntüleri,
  yayında/taslak, sıralama
- **Hizmetler**: müşteriler için yapılan işler — başlık, tür (web sitesi veya uygulama), adres,
  yayında/taslak, sıralama. Sitede iki sütunlu bir panelde gösterilir: solda işlerin listesi,
  sağda seçilen işin web sitesi ya da (uygulamalar için) YouTube videosu bir iframe içinde.
  Uygulama adresi bir YouTube video linki olmalıdır (`youtu.be/…`, `watch?v=…`, `shorts/…`).
  Bazı siteler iframe içinde açılmayı reddeder (`X-Frame-Options`); çerçevenin üstündeki
  **Aç** linki siteyi yeni sekmede açar.
- **İletişim & Sosyal**: iletişim bölümü metinleri, e-posta, Google Harita adresi, sosyal
  medya linkleri (ekle / düzenle / sırala / aç-kapa)
- **Gönderiler**: iletişim mesajları (okundu işaretle, yanıtla, sil), oyun geri
  bildirimleri ve yüksek skor tablosu

Uzun metinler küçük bir işaretleme destekler: `[etiket](https://...)` link, `**kalın**`,
`*italik*` ve paragraf için boş satır.

## Restoran sayfası (`/restoran`)

Restoran ve kafelere yönelik Türkçe, mobil öncelikli landing page. Ana sitenin parçası değil,
**ayrı bir HTML giriş noktası**: `frontend/restoran.html` (Vite'ın ikinci `input`'u). Böylece
başlık, açıklama, OG etiketleri ve JSON-LD ham HTML'de durur; WhatsApp/Facebook önizlemeleri
JavaScript çalıştırmadan doğru başlığı ve `og-restoran.jpg` görselini gösterir.

- **Metinler ve paketler:** `frontend/src/content/restoran.tr.js` (bileşenlere dokunmadan düzenlenir).
  Meta etiketleri `frontend/restoran.html` içinde.
- **Adres:** `/restoran` 200 döner; `/restoran/` ve `/restoran.html` 301 ile `/restoran`'a gider.
  Kurallar `public/.htaccess` (Apache/LiteSpeed), `FrontendRoutes.js` (Node) ve `vite.config.js`
  (dev/preview) içinde.
- **Yer tutucular:** doldurulmamış bilgiler `TODO_CANER_…` biçimindedir. Yayından önce şu komut boş dönmeli
  (build çıktısı dahil):

  ```bash
  grep -rn TODO_CANER --exclude-dir=node_modules --exclude='*restoran-brief.md' --exclude=README.md .
  ```

- **Prerender:** `npm run build` sayfayı `scripts/prerender-restoran.mjs` ile HTML olarak `dist/restoran.html` içine
  yazar; içerik JavaScript beklemeden görünür, React sonra onu devralır (hydrate).
- **Testler:** hesaplayıcı ve WhatsApp linki `node:test` ile test edilir: `npm test`.
- **CTA ölçümü:** her buton/link `data-cta="hero-whatsapp"` gibi bir tanımlayıcı taşır.

### Kampanya linkleri (UTM)

Ziyaretlerin nereden geldiğini (analytics kurulana kadar hosting erişim loglarından) ayırmak için:

| Kanal | Link |
|---|---|
| Broşür QR | `https://www.ankainteractive.com/restoran?utm_source=brosur&utm_medium=qr&utm_campaign=restoran` |
| WhatsApp mesajı | `https://www.ankainteractive.com/restoran?utm_source=whatsapp&utm_medium=dm&utm_campaign=restoran` |
| Instagram bio | `https://www.ankainteractive.com/restoran?utm_source=instagram&utm_medium=bio&utm_campaign=restoran` |

## API

| Uç nokta | Açıklama |
|---|---|
| `GET /api/public/about`, `/api/public/projects`, `/api/public/client-works`, `/api/public/contact-info` | Sitenin içeriği |
| `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | CMS oturumu |
| `/api/admin/…` | CMS uç noktaları (oturum gerekir) |
| `GET /api/health` | `{ ok, ts }` |

### Eski uygulamaların karşılıkları (değişmedi)

| Eski | Node.js uç noktası | Not |
|---|---|---|
| `katip/katip.py` (oyun geri bildirimi) | `POST /api/games/feedback` | `feedback_game_id`, `feedback_message`, `feedback_language` |
| `umay/umay.py` (yüksek skor) | `POST /api/games/high-score` + `GET /api/games/leaderboard?gameId=` | `score_game_id`, `score_player_name`, `score_player_score`, `score_language` |
| `ulak/ulak.js` (iletişim formu) | `POST /api/contact` (ayrıca `POST /api/ulak`) | `contact_name`, `contact_email`, `contact_subject`, `contact_message`, `contact_lang` |

İstek alanları ve yanıt biçimleri (`success: 0/1`, `message`, `ranking`, `invalid_field` …)
eskisiyle birebir aynıdır; form-encoded ve JSON gövdeler kabul edilir.

## Görseller ve thumbnail'lar

- Genel görseller (logo, ayırıcı, rozet) `frontend/public/` içindedir.
- CMS'ten yüklenen görseller içeriklerine (magic bytes) göre denetlenir (JPG/PNG/WEBP/GIF) ve
  `backend/uploads/<uuid>.<uzantı>` olarak saklanır; yanına otomatik olarak `_thumb` kopyası
  üretilir (`foo.png` → `foo_thumb.png`). Bir görsel CMS'ten silinince dosyası ve thumbnail'ı
  da silinir — `uploads/` altındaki hangi klasörde olursa olsun.
- **Önce thumbnail'lar:** ana sayfa önce verisini ve sayfadaki **tüm thumbnail'ları** yükler.
  Hepsi bittiğinde tam boy görseller **arka planda, sırayla ve düşük öncelikle** yüklenir
  (`BackgroundImageQueue`); bu sırada yeni bir thumbnail yüklenmeye başlarsa kuyruk bekler.
  Böylece bir thumbnail'a tıklandığında büyük görsel çoğunlukla anında açılır.
- Thumbnail'ı olmayan bir görselde (eski yüklemeler, GIF) site tam boy dosyaya geri düşer.
- Eksik thumbnail'ları üretmek için:

  ```bash
  npm --prefix backend run thumbs             # yalnızca eksikler
  npm --prefix backend run thumbs -- --force  # hepsini yeniden üret
  ```

## Canlıya alma

- `npm run build` → `frontend/dist` içeriğini web sunucusuna yükleyin, ya da backend'de
  `FRONTEND_DIR` ayarlayıp siteyi Node uygulamasının sunmasını sağlayın.
- Backend'e `server.js`, `src/`, `scripts/`, `package.json`, `package-lock.json` ve `.env`
  yüklenir; `node_modules` sunucuda kurulur. Sunucudaki `uploads/` klasörü canlı veridir:
  güncelleme sırasında üzerine yazmayın. Backend artık ES modülleri
  (`"type": "module"`) ve Express 5 kullanır: Node.js 20.19+ / 22.12+ önerilir.
- Canlıda `NODE_ENV=production` ayarlayın (çerez yalnızca HTTPS ile gönderilir, 500 hata
  ayrıntıları gizlenir).
