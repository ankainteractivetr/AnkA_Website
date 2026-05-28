-- ============================================================================
-- AnkA Interactive — Database Schema & Seed Data
-- ankainteractive.com
-- ============================================================================
-- Import notes:
--   Local:  mysql -u root -p < anka.sql
--   cPanel: phpMyAdmin -> Import this file.
-- After import, update backend/.env with matching DB_NAME / DB_USER / DB_PASSWORD.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `anka`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `anka`;

-- ----------------------------------------------------------------------------
-- Drop existing tables in dependency order (safe re-import)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `project_images`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `about_images`;
DROP TABLE IF EXISTS `about_content`;
DROP TABLE IF EXISTS `social_links`;
DROP TABLE IF EXISTS `contact_info`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `game_feedbacks`;
DROP TABLE IF EXISTS `game_high_scores`;
DROP TABLE IF EXISTS `admin_users`;

-- ----------------------------------------------------------------------------
-- About section content (English + Turkish, rich HTML allowed)
-- ----------------------------------------------------------------------------
CREATE TABLE `about_content` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL DEFAULT 'AnkA Interactive',
  `body_en` MEDIUMTEXT NOT NULL,
  `body_tr` MEDIUMTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- About-section images (multiple, ordered)
-- ----------------------------------------------------------------------------
CREATE TABLE `about_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT '',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_about_order` (`display_order`)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Projects: unified table for games + software
-- ----------------------------------------------------------------------------
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `type` ENUM('game','software') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `tagline_en` TEXT,
  `tagline_tr` TEXT,
  `description_en` MEDIUMTEXT,
  `description_tr` MEDIUMTEXT,
  `features_en` MEDIUMTEXT,
  `features_tr` MEDIUMTEXT,
  `steam_widget_url` VARCHAR(500) DEFAULT NULL,
  `microsoft_store_url` VARCHAR(500) DEFAULT NULL,
  `trailer_url` VARCHAR(500) DEFAULT NULL,
  `download_url` VARCHAR(500) DEFAULT NULL,
  `status_en` VARCHAR(255) DEFAULT NULL,
  `status_tr` VARCHAR(255) DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_project_type_order` (`type`, `display_order`),
  INDEX `idx_project_pub` (`is_published`)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Project images
-- ----------------------------------------------------------------------------
CREATE TABLE `project_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT '',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  INDEX `idx_proj_img_order` (`project_id`, `display_order`)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Contact info (intro/outro text + map embed)
-- ----------------------------------------------------------------------------
CREATE TABLE `contact_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `intro_en` TEXT,
  `intro_tr` TEXT,
  `outro_en` TEXT,
  `outro_tr` TEXT,
  `email` VARCHAR(255) DEFAULT NULL,
  `map_embed_url` VARCHAR(1000) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Social media links (CMS editable, drag-orderable)
-- ----------------------------------------------------------------------------
CREATE TABLE `social_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `platform` VARCHAR(50) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  INDEX `idx_social_order` (`display_order`)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Contact form submissions (from website contact form)
-- ----------------------------------------------------------------------------
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `email` VARCHAR(255),
  `subject` VARCHAR(500),
  `message` TEXT,
  `language` CHAR(2),
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_msg_read` (`is_read`, `created_at`)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Game feedbacks (replaces katip.py API)
-- ----------------------------------------------------------------------------
CREATE TABLE `game_feedbacks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `game_id` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_fb_game` (`game_id`)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- High scores (replaces umay.py API)
-- ----------------------------------------------------------------------------
CREATE TABLE `game_high_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `game_id` VARCHAR(100) NOT NULL,
  `player_name` VARCHAR(24) NOT NULL,
  `high_score` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_player_game` (`game_id`, `player_name`),
  INDEX `idx_hs_game_score` (`game_id`, `high_score` DESC)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Admin users (bcrypt-hashed passwords)
-- The seeded password below corresponds to: "ankaadmin2026"
-- Override via .env (ADMIN_USERNAME / ADMIN_PASSWORD) — backend rehashes on boot.
-- ----------------------------------------------------------------------------
CREATE TABLE `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NULL
) ENGINE=InnoDB;

-- ============================================================================
-- SEED DATA — pulled from the existing live site so the CMS works out of the box
-- ============================================================================

INSERT INTO `about_content` (`id`, `title`, `body_en`, `body_tr`) VALUES (1,
'AnkA Interactive',
'AnkA Interactive was founded in early 2023 by [Caner ''Trooper'' Kurt](https://trooper.ankainteractive.com) in Ankara, Türkiye, with the goal of creating story-rich, unique, and adventurous video games that elevate their culture to a more prominent, esteemed, and cherished position in the entertainment world.\n\nThe company''s name is inspired by the mythological bird Phoenix, a significant figure in Turkish mythology. We chose this name to symbolize the revolutionary birth of epic and meaningful creations we aspire to bring to life.\n\nIn 2024, we released the prototype of our debut mini Action-RPG video game, Shahmaran, developed and published for Steam and Nintendo platforms.\n\nIn early 2025 we developed and published our freeware 3D Model viewer application Ayzıt.\n\nIn late 2025 we finished the game design document, script and the demo of our space shooter Arcade game with the codename Project Beta.\n\nCurrently we are working on the full version of Shahmaran.\n\nStay tuned, and feel free to reach out to us!',
'AnkA Interactive, 2023''ün başlarında [Caner ''Trooper'' Kurt](https://trooper.ankainteractive.com) tarafından Ankara, Türkiye''de, kültürlerini eğlence dünyasında daha itibarlı, saygın ve sevilen bir konuma taşımayı hedefleyen, zengin hikâyeli, benzersiz ve macera dolu video oyunları yaratma amacıyla kurulmuştur.\n\nŞirketin adı, Türk mitolojisinde önemli bir figür olan efsanevi Anka Kuşu''ndan esinlenilmiştir. Bu adı, hayata geçirmeye çalıştığımız destansı ve anlamlı yaratımların devrimsel doğuşunu temsil etmesi amacıyla seçtik.\n\n2024 yılında, Steam ve Nintendo platformları için geliştirdiğimiz ve yayımladığımız mini bir Action-RPG olan ilk video oyunumuz Shahmaran''ın prototipini piyasaya sürdük.\n\n2025 yılının başlarında, ücretsiz 3D model görüntüleme uygulamamız Ayzıt''ı geliştirdik ve yayınladık.\n\n2025 yılının sonlarında, kod adı Project Beta olan bir space shooter arcade olan oyunumuzun oyun tasarım belgesini, senaryosunu ve demosunu tamamladık.\n\nŞuan Shahmaran''ın tam versiyonu üstünde çalışıyoruz.\n\nBizi takipte kalın ve bizimle iletişime geçmekten çekinmeyin!');

INSERT INTO `about_images` (`image_url`, `alt_text`, `display_order`) VALUES
('/uploads/seed/AnkA-Interactive-Logo.png', 'AnkA Interactive Logo', 0),
('/uploads/seed/anka-home-office-0.png', 'AnkA home office', 1),
('/uploads/seed/anka-home-office-1.png', 'AnkA home office', 2);

-- Projects: Shahmaran (game) and Ayzıt (software)
INSERT INTO `projects`
(`slug`, `type`, `title`, `tagline_en`, `tagline_tr`, `description_en`, `description_tr`, `features_en`, `features_tr`, `steam_widget_url`, `trailer_url`, `download_url`, `status_en`, `status_tr`, `display_order`)
VALUES
('shahmaran', 'game', 'Shahmaran',
'A Mythological Twist on a Timeless Classic!',
'Zamansız Bir Klasiğe Mitolojik Bir Dokunuş!',
'Slither into a dark, fantastical world in Shahmaran, an action-RPG that fuses classic Snake mechanics with fast-paced hack-and-slash combat. Devour mystical energy to grow your serpentine body, unleash devastating spells, command your trusted ally Jamsab, and battle your way through cursed lands to defeat the evil Vizier!\n\nThe legend comes to life. Shahmaran is a thrilling, mythological action-RPG that takes the timeless, addictive gameplay of the classic "Snake" and injects it with high-octane magic, deadly enemies, and deep lore. As the mythical half-woman, half-serpent, you must navigate treacherous battlefields, growing in size and power while avoiding your own ever-expanding body. But navigating the map is only half the battle—the Vizier''s monstrous forces are hunting you.',
'Klasik Yılan (Snake) mekaniklerini hızlı tempolu hack-and-slash dövüşüyle harmanlayan bir aksiyon-RYO olan Shahmaran''da karanlık, fantastik bir dünyaya süzülün. Yılan bedeninizi büyütmek için mistik enerjiyi yutun, yıkıcı büyüleri serbest bırakın, sadık yoldaşınız Camsab''a komuta edin ve şeytani Vezir''i yenmek için lanetli topraklarda savaşarak ilerleyin!\n\nEfsane hayat buluyor. Şahmeran, klasik "Yılan" oyununun zamansız ve bağımlılık yaratan oynanışını alıp ona yüksek oktanlı büyü, ölümcül düşmanlar ve derin bir hikaye enjekte eden nefes kesici, mitolojik bir aksiyon-RYO''dur. Yarı kadın, yarı yılan mitolojik bir varlık olarak, sürekli uzayan bedeninize çarpmaktan kaçınırken boyut ve güç olarak büyümeli ve tehlikelerle dolu savaş alanlarında gezinmelisiniz. Ancak haritada hayatta kalmak işin sadece yarısı; Vezir''in korkunç güçleri peşinizde.',
'**A Timeless Classic, Reborn** — Experience grid-based movement like never before. Slither across the map, devour food to increase your length, and outmaneuver your foes.\n\n**Unleash Mythological Magic** — Master 12 unique spells from diverse schools of magic to decimate the enemy hordes. When magic isn''t enough, whip your draconic tail to deliver devastating ranged spit attacks.\n\n**Formidable Foes & Epic Bosses** — Survive against 9 distinct, terrifying enemy types that actively target your body to shrink your size. Battle through 3 brutal minor bosses before your final confrontation with the Vizier himself.\n\n**Dynamic Companion Combat** — Build up your action points and call upon your trusty companion, Jamsab. Command him to drop tar-filled barrels to snare swarms, or let him dive into the fray with his blade and flintlock pistol.\n\n**Next-Gen Visuals** — Brought to life in Unreal Engine, journey through 4 distinct, visually stunning environments featuring hardware ray tracing, deferred shading, and gorgeous atmospheric lighting.',
'**Zamansız Bir Klasik Yeniden Doğuyor** — Kare (grid) tabanlı hareketi daha önce hiç olmadığı gibi deneyimleyin. Harita üzerinde süzülün, boyunuzu uzatmak için yiyecekleri yutun ve düşmanlarınızı alt edin.\n\n**Mitolojik Büyüleri Serbest Bırakın** — Düşman sürülerini yok etmek için farklı büyü okullarından 12 benzersiz büyüde ustalaşın. Büyü yeterli olmadığında, ejderhayı andıran kuyruğunuzu savurun ve yıkıcı menzilli zehir saldırıları yapın.\n\n**Zorlu Düşmanlar ve Destansı Boss''lar** — Boyutunuzu küçültmek için doğrudan bedeninizi hedef alan birbirinden farklı 9 korkutucu düşman türüne karşı hayatta kalın. Vezir''in kendisiyle yapacağınız nihai yüzleşmeden önce 3 acımasız alt-boss''u alt edin.\n\n**Dinamik Yoldaş Dövüşü** — Aksiyon puanlarınızı biriktirin ve sadık yoldaşınız Camsab''ı yardıma çağırın. Üzerinize gelen sürüleri tuzağa düşürmek için ona katran dolu fıçıları bırakmasını emredin ya da kılıcı ve çakmaklı tabancasıyla çatışmanın ortasına dalmasına izin verin.\n\n**Yeni Nesil Görseller** — Unreal Engine ile hayat bulan oyunda; donanımsal ışın izleme, geciktirilmiş gölgelendirme ve muhteşem atmosferik aydınlatmalara sahip 4 farklı ve görsel açıdan büyüleyici ortamda epik bir yolculuğa çıkın.',
'https://store.steampowered.com/widget/3061480/',
'https://youtu.be/znUv_1yW4So',
NULL,
'Full version under heavy development. Prototype available now.',
'Tam versiyonu yoğun geliştirme sürecinde. Prototipi şu anda mevcut.',
0),

('ayzit', 'software', 'Ayzıt',
'A 3D Model Viewer',
'Bir 3D Model Görüntüleyici',
'Ayzıt (named after the goddess of beauty in ancient Turkish mythology) is a lightweight, freeware 3D model viewer and converter for Windows.\n\nThis latest version is a modernized reinterpretation of the original program, which featured fixed-function pipeline rendering and a dated GUI. Now, Ayzıt offers enhanced functionality, allowing users to convert between various 3D content formats.\n\nDesigned as a utility for 3D graphics creation and programming, Ayzıt is distributed under the MIT license and is completely free for both commercial and non-commercial use.\n\nFor the curious, the following main technologies have been used in the development process: C++, Visual Studio, Windows API, WinUI, Direct2D, Direct3D, HLSL, ASSIMP, JavaScript, SQL, Node.js, and CMake.',
'Ayzıt (adını eski Türk mitolojisindeki güzellik tanrıçasından alır), Windows için tasarlanmış hafif, ücretsiz bir 3D model görüntüleyici ve dönüştürücü yazılımdır.\n\nBu en son sürüm, sabit işlevli işlem hattı görüntüleme ve eski bir GUI''ye sahip olan orijinal programın modernize edilmiş bir yeniden yorumudur. Bu yeni versiyonla artık pek çok farklı 3D içerik formatı arasında dönüşüm yapmak da mümkün.\n\n3D grafik oluşturma ve programlama için bir yardımcı program olarak tasarlanan Ayzıt, MIT lisansı altında dağıtılmaktadır ve hem ticari hem de ticari olmayan kullanım için tamamen ücretsizdir.\n\nMerak edenler için geliştirme sürecinde aşağıdaki ana teknolojiler kullanılmıştır: C++, Visual Studio, Windows API, WinUI, Direct2D, Direct3D, HLSL, ASSIMP, JavaScript, SQL, Node.js, ve CMake.',
'Shadow Mapping, Deferred Shading, Physically Based Rendering, Normal Mapping, Cube Mapping, Displacement Mapping, Bump Mapping, Parallax Mapping, Gamma Correction, HDR, Bloom, Screen Space Ambient Occlusion, Custom Resolve Anti-Aliasing, and more.',
'Shadow Mapping, Deferred Shading, Physically Based Rendering, Normal Mapping, Cube Mapping, Displacement Mapping, Bump Mapping, Parallax Mapping, Gamma Correction, HDR, Bloom, Screen Space Ambient Occlusion, Custom Resolve Anti-Aliasing, ve daha fazlası.',
NULL,
NULL,
'/ayzit-1_0_0.exe',
'Released — MIT License — Free for commercial & non-commercial use.',
'Yayımlandı — MIT Lisansı — Ticari ve ticari olmayan kullanım için ücretsiz.',
0);

-- Project images
INSERT INTO `project_images` (`project_id`, `image_url`, `alt_text`, `display_order`)
SELECT id, '/uploads/seed/shahmaran00.png', 'Shahmaran screenshot', 0 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran01.png', 'Shahmaran screenshot', 1 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran02.png', 'Shahmaran screenshot', 2 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran03.png', 'Shahmaran screenshot', 3 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran04.png', 'Shahmaran screenshot', 4 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran05.png', 'Shahmaran screenshot', 5 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran06.png', 'Shahmaran screenshot', 6 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran07.png', 'Shahmaran screenshot', 7 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran08.png', 'Shahmaran screenshot', 8 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran09.png', 'Shahmaran screenshot', 9 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran10.png', 'Shahmaran screenshot', 10 FROM `projects` WHERE `slug`='shahmaran' UNION ALL
SELECT id, '/uploads/seed/shahmaran11.png', 'Shahmaran screenshot', 11 FROM `projects` WHERE `slug`='shahmaran';

-- Contact info
INSERT INTO `contact_info` (`id`, `intro_en`, `intro_tr`, `outro_en`, `outro_tr`, `email`, `map_embed_url`) VALUES (1,
'We value your feedback! Whether you have questions, suggestions, or just want to say hello, please fill out the contact form.',
'Görüşleriniz bizim için değerli! Sorularınız, önerileriniz varsa ya da sadece bir "merhaba" demek isterseniz, lütfen iletişim formunu doldurun.',
'Passing by? Great to hear! We''re nice and friendly people. Feel free to knock on our door, and we''ll gladly serve you some Turkish tea!',
'Yolunuz buraya mı düştü? Harika! Biz sıcak ve misafirperver insanlarız. Kapımızı çalacak olursanız, size çay ikram ederiz!',
'contact@ankainteractive.com',
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3061.878245286539!2d32.67270207644476!3d39.876965088313824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d3398a44139d31%3A0x6fee62caca0abd2f!2sAnkA%20Interactive!5e0!3m2!1sen!2str!4v1698074333256!5m2!1sen!2str');

-- Social media links
INSERT INTO `social_links` (`platform`, `url`, `icon_name`, `display_order`) VALUES
('LinkedIn', 'https://www.linkedin.com/company/anka-interactive/', 'linkedin', 0),
('Instagram', 'https://www.instagram.com/ankainteractive', 'instagram', 1),
('Twitter', 'https://twitter.com/AnkaInteractive', 'twitter', 2),
('YouTube', 'https://www.youtube.com/@ankainteractive', 'youtube', 3);

-- Default admin user — password = "ankaadmin2026" (bcrypt hash).
-- Backend will re-hash to whatever ADMIN_PASSWORD is set in .env on first boot.
INSERT INTO `admin_users` (`username`, `password_hash`) VALUES
('admin', '$2b$10$rPlaceholderHashWillBeReplacedOnFirstBootByServerB.K');