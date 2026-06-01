// ============================================================================
//  Admin API — all routes require valid JWT (except /login)
// ============================================================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const { query, queryOne } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { upload, UPLOAD_DIR, makeThumbnail } = require('../middleware/upload');
const { thumbPathFor } = require('../lib/thumbnail');

const router = express.Router();

/* ============================================================================
   AUTH
============================================================================ */

router.post('/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required.' });
    }
    try {
        const user = await queryOne('SELECT * FROM admin_users WHERE username = ?', [username]);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        await query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        res.json({ success: true, token, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

router.get('/me', requireAuth, (req, res) => {
    res.json({ success: true, user: req.user });
});

/* ============================================================================
   ABOUT
============================================================================ */

router.get('/about', requireAuth, async (req, res, next) => {
    try {
        const about = await queryOne('SELECT * FROM about_content WHERE id = 1');
        const images = await query(
            'SELECT id, image_url, alt_text, display_order FROM about_images ORDER BY display_order ASC, id ASC'
        );
        res.json({ success: true, data: { ...about, images } });
    } catch (err) { next(err); }
});

router.put('/about', requireAuth, async (req, res, next) => {
    try {
        const { title, body_en, body_tr } = req.body;
        await query(
            'UPDATE about_content SET title = ?, body_en = ?, body_tr = ? WHERE id = 1',
            [title || 'AnkA Interactive', body_en || '', body_tr || '']
        );
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.post('/about/images', requireAuth, upload.single('image'), makeThumbnail, async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
        const url = `/uploads/${req.file.filename}`;
        const alt = req.body.alt_text || '';
        const maxRow = await queryOne('SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM about_images');
        const order = maxRow.next_order;
        const result = await query(
            'INSERT INTO about_images (image_url, alt_text, display_order) VALUES (?, ?, ?)',
            [url, alt, order]
        );
        res.json({ success: true, data: { id: result.insertId, image_url: url, alt_text: alt, display_order: order } });
    } catch (err) { next(err); }
});

router.delete('/about/images/:id', requireAuth, async (req, res, next) => {
    try {
        const img = await queryOne('SELECT image_url FROM about_images WHERE id = ?', [req.params.id]);
        if (img) tryDeleteUploadedFile(img.image_url);
        await query('DELETE FROM about_images WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.put('/about/images/reorder', requireAuth, async (req, res, next) => {
    try {
        const { order } = req.body; // [id, id, id, ...]
        if (!Array.isArray(order)) return res.status(400).json({ success: false });
        for (let i = 0; i < order.length; i++) {
            await query('UPDATE about_images SET display_order = ? WHERE id = ?', [i, order[i]]);
        }
        res.json({ success: true });
    } catch (err) { next(err); }
});

/* ============================================================================
   PROJECTS (games + software)
============================================================================ */

router.get('/projects', requireAuth, async (req, res, next) => {
    try {
        const projects = await query('SELECT * FROM projects ORDER BY type ASC, display_order ASC, id ASC');
        for (const p of projects) {
            p.images = await query(
                'SELECT id, image_url, alt_text, display_order FROM project_images WHERE project_id = ? ORDER BY display_order ASC, id ASC',
                [p.id]
            );
        }
        res.json({ success: true, data: projects });
    } catch (err) { next(err); }
});

router.get('/projects/:id', requireAuth, async (req, res, next) => {
    try {
        const project = await queryOne('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (!project) return res.status(404).json({ success: false });
        project.images = await query(
            'SELECT id, image_url, alt_text, display_order FROM project_images WHERE project_id = ? ORDER BY display_order ASC, id ASC',
            [project.id]
        );
        res.json({ success: true, data: project });
    } catch (err) { next(err); }
});

router.post('/projects', requireAuth, async (req, res, next) => {
    try {
        const p = req.body;
        if (!p.slug || !p.title || !p.type) {
            return res.status(400).json({ success: false, message: 'slug, title, type are required.' });
        }
        const result = await query(
            `INSERT INTO projects
             (slug, type, title, tagline_en, tagline_tr, description_en, description_tr,
              features_en, features_tr, steam_widget_url, trailer_url, download_url,
              status_en, status_tr, display_order, is_published)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                p.slug, p.type, p.title,
                p.tagline_en || '', p.tagline_tr || '',
                p.description_en || '', p.description_tr || '',
                p.features_en || '', p.features_tr || '',
                p.steam_widget_url || null, p.trailer_url || null, p.download_url || null,
                p.status_en || null, p.status_tr || null,
                p.display_order || 0, p.is_published == null ? 1 : (p.is_published ? 1 : 0),
            ]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Slug already exists.' });
        next(err);
    }
});

router.put('/projects/:id', requireAuth, async (req, res, next) => {
    try {
        const p = req.body;
        await query(
            `UPDATE projects SET
              slug = ?, type = ?, title = ?,
              tagline_en = ?, tagline_tr = ?,
              description_en = ?, description_tr = ?,
              features_en = ?, features_tr = ?,
              steam_widget_url = ?, trailer_url = ?, download_url = ?,
              status_en = ?, status_tr = ?,
              display_order = ?, is_published = ?
             WHERE id = ?`,
            [
                p.slug, p.type, p.title,
                p.tagline_en || '', p.tagline_tr || '',
                p.description_en || '', p.description_tr || '',
                p.features_en || '', p.features_tr || '',
                p.steam_widget_url || null, p.trailer_url || null, p.download_url || null,
                p.status_en || null, p.status_tr || null,
                p.display_order || 0, p.is_published ? 1 : 0,
                req.params.id,
            ]
        );
        res.json({ success: true });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Slug already exists.' });
        next(err);
    }
});

router.delete('/projects/:id', requireAuth, async (req, res, next) => {
    try {
        const imgs = await query('SELECT image_url FROM project_images WHERE project_id = ?', [req.params.id]);
        for (const img of imgs) tryDeleteUploadedFile(img.image_url);
        await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.post('/projects/:id/images', requireAuth, upload.single('image'), makeThumbnail, async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
        const url = `/uploads/${req.file.filename}`;
        const alt = req.body.alt_text || '';
        const maxRow = await queryOne(
            'SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM project_images WHERE project_id = ?',
            [req.params.id]
        );
        const order = maxRow.next_order;
        const result = await query(
            'INSERT INTO project_images (project_id, image_url, alt_text, display_order) VALUES (?, ?, ?, ?)',
            [req.params.id, url, alt, order]
        );
        res.json({ success: true, data: { id: result.insertId, image_url: url, alt_text: alt, display_order: order } });
    } catch (err) { next(err); }
});

router.delete('/projects/:id/images/:imgId', requireAuth, async (req, res, next) => {
    try {
        const img = await queryOne('SELECT image_url FROM project_images WHERE id = ? AND project_id = ?', [req.params.imgId, req.params.id]);
        if (img) tryDeleteUploadedFile(img.image_url);
        await query('DELETE FROM project_images WHERE id = ? AND project_id = ?', [req.params.imgId, req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.put('/projects/:id/images/reorder', requireAuth, async (req, res, next) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order)) return res.status(400).json({ success: false });
        for (let i = 0; i < order.length; i++) {
            await query('UPDATE project_images SET display_order = ? WHERE id = ? AND project_id = ?',
                        [i, order[i], req.params.id]);
        }
        res.json({ success: true });
    } catch (err) { next(err); }
});

/* ============================================================================
   CONTACT INFO & SOCIAL LINKS
============================================================================ */

router.get('/contact-info', requireAuth, async (req, res, next) => {
    try {
        const info = await queryOne('SELECT * FROM contact_info WHERE id = 1');
        const social = await query('SELECT * FROM social_links ORDER BY display_order ASC, id ASC');
        res.json({ success: true, data: { ...info, social } });
    } catch (err) { next(err); }
});

router.put('/contact-info', requireAuth, async (req, res, next) => {
    try {
        const { intro_en, intro_tr, outro_en, outro_tr, email, map_embed_url } = req.body;
        const existing = await queryOne('SELECT id FROM contact_info WHERE id = 1');
        if (existing) {
            await query(
                'UPDATE contact_info SET intro_en = ?, intro_tr = ?, outro_en = ?, outro_tr = ?, email = ?, map_embed_url = ? WHERE id = 1',
                [intro_en || '', intro_tr || '', outro_en || '', outro_tr || '', email || null, map_embed_url || null]
            );
        } else {
            await query(
                'INSERT INTO contact_info (id, intro_en, intro_tr, outro_en, outro_tr, email, map_embed_url) VALUES (1, ?, ?, ?, ?, ?, ?)',
                [intro_en || '', intro_tr || '', outro_en || '', outro_tr || '', email || null, map_embed_url || null]
            );
        }
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.get('/social-links', requireAuth, async (req, res, next) => {
    try {
        const rows = await query('SELECT * FROM social_links ORDER BY display_order ASC, id ASC');
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
});

router.post('/social-links', requireAuth, async (req, res, next) => {
    try {
        const { platform, url, icon_name } = req.body;
        if (!platform || !url) return res.status(400).json({ success: false, message: 'platform & url required' });
        const maxRow = await queryOne('SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM social_links');
        const result = await query(
            'INSERT INTO social_links (platform, url, icon_name, display_order, is_active) VALUES (?, ?, ?, ?, 1)',
            [platform, url, icon_name || platform.toLowerCase(), maxRow.next_order]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) { next(err); }
});

// NOTE: must be declared before '/social-links/:id' so 'reorder' isn't captured as :id
router.put('/social-links/reorder', requireAuth, async (req, res, next) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order)) return res.status(400).json({ success: false });
        for (let i = 0; i < order.length; i++) {
            await query('UPDATE social_links SET display_order = ? WHERE id = ?', [i, order[i]]);
        }
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.put('/social-links/:id', requireAuth, async (req, res, next) => {
    try {
        const { platform, url, icon_name, is_active } = req.body;
        await query(
            'UPDATE social_links SET platform = ?, url = ?, icon_name = ?, is_active = ? WHERE id = ?',
            [platform, url, icon_name || platform.toLowerCase(), is_active ? 1 : 0, req.params.id]
        );
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.delete('/social-links/:id', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM social_links WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

/* ============================================================================
   SUBMISSIONS — contact messages, feedbacks, high scores (read-only views)
============================================================================ */

router.get('/messages', requireAuth, async (req, res, next) => {
    try {
        const rows = await query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 500');
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
});

router.put('/messages/:id', requireAuth, async (req, res, next) => {
    try {
        const is_read = req.body.is_read ? 1 : 0;
        await query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [is_read, req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.delete('/messages/:id', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.get('/feedbacks', requireAuth, async (req, res, next) => {
    try {
        const rows = await query('SELECT * FROM game_feedbacks ORDER BY created_at DESC LIMIT 500');
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
});

router.delete('/feedbacks/:id', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM game_feedbacks WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

router.get('/high-scores', requireAuth, async (req, res, next) => {
    try {
        const rows = await query('SELECT * FROM game_high_scores ORDER BY game_id ASC, high_score DESC LIMIT 500');
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
});

router.delete('/high-scores/:id', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM game_high_scores WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

/* ============================================================================
   Helpers
============================================================================ */

function tryDeleteUploadedFile(urlPath) {
    if (!urlPath || !urlPath.startsWith('/uploads/')) return;
    // Don't delete seeded images (under /uploads/seed/)
    if (urlPath.startsWith('/uploads/seed/')) return;
    const filename = urlPath.replace('/uploads/', '');
    const full = path.join(UPLOAD_DIR, filename);
    fs.unlink(full, () => {});
    // Remove its thumbnail too (best-effort; ignore if absent)
    fs.unlink(thumbPathFor(full), () => {});
}

module.exports = router;
