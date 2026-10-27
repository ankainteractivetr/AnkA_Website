-- ============================================================================
-- AnkA Interactive — Database Schema
-- ankainteractive.com
-- ============================================================================
-- Creates the tables of an empty database; no content is inserted. Safe to run
-- on an existing database: tables that already exist (and their data) are kept.
--   Local:  mysql -u root -p anka_website < anka.sql
--   cPanel: phpMyAdmin -> select the database -> Import this file.
-- The CMS account is created on the API's first start from ADMIN_USERNAME /
-- ADMIN_PASSWORD (backend/.env); the about and contact texts are filled in the CMS.
-- ============================================================================

-- About section texts (one row, id = 1; light markup allowed)
CREATE TABLE IF NOT EXISTS `about_content` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL DEFAULT 'AnkA Interactive',
  `body_en` MEDIUMTEXT NOT NULL,
  `body_tr` MEDIUMTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- About-section gallery (ordered)
CREATE TABLE IF NOT EXISTS `about_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT '',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_about_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Projects: games + software
CREATE TABLE IF NOT EXISTS `projects` (
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
  `sourceforge_name` VARCHAR(100) DEFAULT NULL,
  `sourceforge_group_id` VARCHAR(20) DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Project screenshots (ordered; deleted with their project)
CREATE TABLE IF NOT EXISTS `project_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT '',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  INDEX `idx_proj_img_order` (`project_id`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Services section: works done for clients (ordered, can be hidden).
-- kind 'web' frames the website at `url`; 'app' frames the YouTube video at `url`.
CREATE TABLE IF NOT EXISTS `client_works` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `kind` ENUM('web','app') NOT NULL DEFAULT 'web',
  `url` VARCHAR(500) NOT NULL,
  `display_order` INT DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_work_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contact section settings (one row, id = 1)
CREATE TABLE IF NOT EXISTS `contact_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `intro_en` TEXT,
  `intro_tr` TEXT,
  `outro_en` TEXT,
  `outro_tr` TEXT,
  `email` VARCHAR(255) DEFAULT NULL,
  `map_embed_url` VARCHAR(1000) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Footer social media links (ordered, can be hidden)
CREATE TABLE IF NOT EXISTS `social_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `platform` VARCHAR(50) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  INDEX `idx_social_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contact form submissions (language: '0' English, '1' Turkish)
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `email` VARCHAR(255),
  `subject` VARCHAR(500),
  `message` TEXT,
  `language` CHAR(2),
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_msg_read` (`is_read`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Game feedback (formerly katip.py)
CREATE TABLE IF NOT EXISTS `game_feedbacks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `game_id` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_fb_game` (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- High scores (formerly umay.py): one row per game and player
CREATE TABLE IF NOT EXISTS `game_high_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `game_id` VARCHAR(100) NOT NULL,
  `player_name` VARCHAR(24) NOT NULL,
  `high_score` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_player_game` (`game_id`, `player_name`),
  INDEX `idx_hs_game_score` (`game_id`, `high_score` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CMS accounts (bcrypt hashes); filled by the API from backend/.env on every start
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
