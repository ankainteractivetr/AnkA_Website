# AnkA Interactive — Web Sitesi (Vite + React + Node.js + MySQL)

Modern, koyu temalı, çift dilli (Türkçe/İngilizce) AnkA Interactive web sitesi
ve yönetim paneli (CMS). Eski statik site; CMS'ten yönetilebilen tam bir
full-stack uygulamaya dönüştürüldü. Eski Python uygulamaları (`katip.py`,
`umay.py`) ve iletişim formu (`ulak.js`) Node.js'e taşındı.

> **EN:** Modern, dark-themed, bilingual (TR/EN) website + CMS for AnkA
> Interactive. Static site rebuilt into a full Vite/React + Node/Express/MySQL
> stack. The original Python apps and the contact mailer were ported to Node.js.

---

## İçindekiler / Contents

```
anka-project/
├── backend/      → Node.js + Express + MySQL API (port 5000)
│   ├── anka.sql  → veritabanı şeması + başlangıç içeriği (import edin)
│   └── ...
└── frontend/     → Vite + React + Tailwind (port 5173)
    └── ...
```

---

## 1. Gereksinimler / Requirements

- **Node.js** 18+ (öneri: 20 LTS)
- **MySQL** 8+ (veya MariaDB 10.4+)
- npm

---

## 2. Veritabanı / Database

Yerel MySQL'de bir veritabanı oluşturup `anka.sql` dosyasını içe aktarın:

```bash
# Veritabanını oluştur
mysql -u root -p -e "CREATE DATABASE anka CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Şema + başlangıç içeriğini yükle
mysql -u root -p anka < backend/anka.sql
```

> **www.ankainteractive.com için:** Aynı `backend/anka.sql` dosyasını hosting
> panelinizdeki (cPanel/phpMyAdmin) veritabanına import edin. Ardından
> `backend/.env` içindeki DB bilgilerini sunucu bilgilerinizle güncelleyin.

---

## 3. Backend kurulumu / Backend setup

```bash
cd backend
cp .env.example .env        # .env dosyasını düzenleyin (aşağıya bakın)
npm install
npm start                   # http://localhost:5000
```

`backend/.env` içinde mutlaka ayarlayın:

| Değişken | Açıklama |
|---|---|
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL bağlantısı (`DB_NAME=anka`) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | CMS giriş bilgileri — **mutlaka değiştirin** |
| `JWT_SECRET` | Uzun, rastgele bir gizli anahtar |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_TO` | İletişim formu e-postaları için |
| `CORS_ORIGINS` | İzin verilen frontend adresleri (virgülle ayrılmış) |

> **Önemli:** Sunucu her açılışta `ADMIN_PASSWORD` değerini `.env`'den okuyup
> yeniden hash'ler. Yani parolayı değiştirmek için sadece `.env`'i düzenleyip
> sunucuyu yeniden başlatmanız yeterli. SMTP parolası artık kodda değil, yalnızca
> `.env` içinde tutulur.

İletişim formu, e-posta gönderimi başarısız olsa bile mesajı her zaman
veritabanına kaydeder; tüm mesajları CMS'teki **Gönderiler** ekranından
görebilirsiniz.

---

## 4. Frontend kurulumu / Frontend setup

```bash
cd frontend
cp .env.example .env        # VITE_API_URL doğru mu kontrol edin
npm install
npm run dev                 # http://localhost:5173
```

`frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

Canlı dağıtım için:

```bash
npm run build               # dist/ klasörü oluşur
npm run preview             # üretim derlemesini yerelde test et
```

`dist/` içeriğini web sunucunuza yükleyin. Backend'i ayrı bir Node süreci olarak
(PM2, systemd vb.) çalıştırın ve canlı `VITE_API_URL` değerini kendi API
adresinizle build edin.

---

## 5. CMS / Yönetim paneli

- Adres: **`/admin`** (örn. `http://localhost:5173/admin`)
- Giriş: `.env`'deki `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- Varsayılan: `admin` / `ankaadmin2026` → **ilk işiniz bunu değiştirmek olsun.**

CMS ile yönetebilecekleriniz:

- **Hakkında**: başlık, EN/TR metin, galeri görselleri (yükle / sırala / sil)
- **Projeler**: oyun ve yazılımları ekleme/düzenleme/silme — başlık, slogan,
  açıklama, özellikler (EN/TR), durum etiketi, Steam widget, fragman ve indirme
  linkleri, ekran görüntüleri, yayında/taslak durumu, sıralama
- **İletişim & Sosyal**: iletişim bölümü metinleri (EN/TR), e-posta, Google
  Harita embed adresi, sosyal medya linkleri (ekle/düzenle/sırala/aç-kapa)
- **Gönderiler**: iletişim mesajları (okundu işaretle, yanıtla, sil), oyun geri
  bildirimleri ve yüksek skor tablosu

Metin alanları küçük bir markdown destekler: `[etiket](https://...)` link,
`**kalın**`, `*italik*` ve paragraf için boş satır.

---

## 6. Eski Python/Node uygulamalarının karşılıkları

| Eski | Yeni Node.js uç noktası | Not |
|---|---|---|
| `katip/katip.py` (oyun geri bildirimi) | `POST /api/games/feedback` | `feedback_game_id`, `feedback_message`, `feedback_language` alan adları korundu |
| `umay/umay.py` (yüksek skor) | `POST /api/games/high-score` + `GET /api/games/leaderboard?gameId=` | `score_game_id`, `score_player_name`, `score_player_score` korundu |
| `ulak/ulak.js` (iletişim formu) | `POST /api/contact` (ayrıca `POST /api/ulak`) | SMTP parolası artık `.env`'de; mesaj DB'ye de kaydedilir |

Oyun istemcileriniz eski alan adlarıyla çalışmaya devam edebilir; yalnızca
istek gönderdikleri URL'yi yeni uç noktalarla güncellemeniz yeterli.

---

## 7. Görseller / Assets

- Genel görseller `frontend/public/` içinde (logo, `seperator.png`, Shahmaran
  ekran görüntüleri, ofis fotoğrafları, `MADE-IN-TURKIYE.png`).
- Başlangıç içeriğindeki görseller `backend/uploads/seed/` içinde durur ve
  `anka.sql` bunlara `/uploads/seed/...` yolu ile referans verir.
- CMS'ten yüklenen yeni görseller `backend/uploads/` klasörüne kaydedilir.

> `trooper/` (Caner'ın kişisel sayfası) bu yeniden yapımın parçası değildir;
> ayrı tutulmuştur ve dilediğiniz gibi yanına ekleyebilirsiniz.

---

## 8. Hızlı başlangıç özeti / Quick start

```bash
# 1) DB
mysql -u root -p -e "CREATE DATABASE anka CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p anka < backend/anka.sql

# 2) Backend
cd backend && cp .env.example .env && npm install && npm start

# 3) Frontend (yeni terminal)
cd frontend && cp .env.example .env && npm install && npm run dev
```

Site: http://localhost:5173 · CMS: http://localhost:5173/admin · API: http://localhost:5000/api

İyi çalışmalar, dostum! 🔥🦅
