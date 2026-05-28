// ============================================================================
//  AnkA Interactive — Backend Server
//  Express + MySQL2 + JWT
// ============================================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const { testConnection, query, queryOne } = require('./src/db');

const publicRoutes = require('./src/routes/public');
const adminRoutes = require('./src/routes/admin');
const contactRoutes = require('./src/routes/contact');
const gamesRoutes = require('./src/routes/games');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

/* -------- Middleware -------- */
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        // Allow requests with no Origin (server-to-server, curl, game clients)
        if (!origin) return cb(null, true);
        if (corsOrigins.length === 0) return cb(null, true);
        if (corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error('CORS: origin not allowed'));
    },
    credentials: true,
}));

/* -------- Static: uploaded images -------- */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* -------- Routes -------- */
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/games', gamesRoutes);

// Legacy compatibility — old game clients posting to /api/ulak still work
app.use('/api/ulak', contactRoutes);

/* -------- Error handler -------- */
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
});

/* -------- Admin bootstrap: re-hash password from .env on every boot -------- */
async function bootstrapAdmin() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'ankaadmin2026';
    const hash = await bcrypt.hash(password, 10);

    const existing = await queryOne('SELECT id FROM admin_users WHERE username = ?', [username]);
    if (existing) {
        await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, existing.id]);
    } else {
        await query('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [username, hash]);
    }
    console.log(`[bootstrap] admin user "${username}" ready.`);
}

/* -------- Boot -------- */
(async () => {
    try {
        await testConnection();
        console.log('[db] connected.');
        await bootstrapAdmin();
        app.listen(PORT, () => {
            console.log(`╔══════════════════════════════════════════════════╗`);
            console.log(`║  AnkA Interactive backend running                ║`);
            console.log(`║  http://localhost:${PORT}                            ║`);
            console.log(`║  CMS API:    /api/admin                          ║`);
            console.log(`║  Public API: /api/public                         ║`);
            console.log(`╚══════════════════════════════════════════════════╝`);
        });
    } catch (err) {
        console.error('[boot] failed:', err.message);
        console.error('Hint: make sure MySQL is running and the .env DB settings are correct.');
        console.error('Hint: import backend/anka.sql first to create the database & tables.');
        process.exit(1);
    }
})();
