// ============================================================================
//  Upload middleware — multer for image uploads, stored in /uploads
// ============================================================================
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

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

module.exports = { upload, UPLOAD_DIR };
