// ============================================================================
//  Upload middleware — multer for image uploads, stored in /uploads
// ============================================================================
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const { generateThumbnail } = require('../lib/thumbnail');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeName = crypto.randomBytes(12).toString('hex');
        cb(null, `${Date.now()}-${safeName}${ext}`);
    },
});

const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext)) {
        return cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed.'));
    }
    cb(null, true);
}

const maxMB = Number(process.env.MAX_UPLOAD_SIZE_MB) || 10;
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxMB * 1024 * 1024 },
});

/**
 * Express middleware: after multer has stored an upload, create a `_thumb`
 * variant next to it. A thumbnail failure must never block the upload — we log
 * a warning and continue (the frontend falls back to the full image).
 *
 * Use it right after `upload.single('image')`:
 *     router.post('/x/images', upload.single('image'), makeThumbnail, handler)
 */
async function makeThumbnail(req, res, next) {
    try {
        if (req.file && req.file.path) {
            await generateThumbnail(req.file.path);
        }
    } catch (err) {
        console.warn(`[thumb] could not generate thumbnail for ${req.file && req.file.filename}: ${err.message}`);
    }
    next();
}

module.exports = { upload, UPLOAD_DIR, makeThumbnail };
