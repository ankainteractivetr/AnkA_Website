// ============================================================================
//  Public API — read-only endpoints powering the website
// ============================================================================
const express = require('express');
const { query, queryOne } = require('../db');

const router = express.Router();

/* -------- About -------- */
router.get('/about', async (req, res, next) => {
    try {
        const about = await queryOne('SELECT * FROM about_content WHERE id = 1');
        const images = await query(
            'SELECT id, image_url, alt_text FROM about_images ORDER BY display_order ASC, id ASC'
        );
        res.json({ success: true, data: { ...about, images } });
    } catch (err) {
        next(err);
    }
});

/* -------- Projects (games + software) -------- */
router.get('/projects', async (req, res, next) => {
    try {
        const type = req.query.type; // optional: 'game' | 'software'
        let sql = 'SELECT * FROM projects WHERE is_published = 1';
        const params = [];
        if (type === 'game' || type === 'software') {
            sql += ' AND type = ?';
            params.push(type);
        }
        sql += ' ORDER BY display_order ASC, id ASC';

        const projects = await query(sql, params);
        for (const p of projects) {
            p.images = await query(
                'SELECT id, image_url, alt_text FROM project_images WHERE project_id = ? ORDER BY display_order ASC, id ASC',
                [p.id]
            );
        }
        res.json({ success: true, data: projects });
    } catch (err) {
        next(err);
    }
});

router.get('/projects/:slug', async (req, res, next) => {
    try {
        const project = await queryOne(
            'SELECT * FROM projects WHERE slug = ? AND is_published = 1',
            [req.params.slug]
        );
        if (!project) return res.status(404).json({ success: false, message: 'Not found.' });
        project.images = await query(
            'SELECT id, image_url, alt_text FROM project_images WHERE project_id = ? ORDER BY display_order ASC, id ASC',
            [project.id]
        );
        res.json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
});

/* -------- Contact info + social links -------- */
router.get('/contact-info', async (req, res, next) => {
    try {
        const info = await queryOne('SELECT * FROM contact_info WHERE id = 1');
        const social = await query(
            'SELECT id, platform, url, icon_name FROM social_links WHERE is_active = 1 ORDER BY display_order ASC, id ASC'
        );
        res.json({ success: true, data: { ...info, social } });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
