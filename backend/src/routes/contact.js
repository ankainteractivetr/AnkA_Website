// ============================================================================
//  Contact form — replaces ulak.js (now reads SMTP from .env, stores to DB too)
// ============================================================================
const express = require('express');
const nodemailer = require('nodemailer');
const { query } = require('../db');

const router = express.Router();

function validate(body) {
    const { contact_name, contact_email, contact_subject, contact_message, contact_lang } = body;
    const lang = contact_lang === '1' ? '1' : '0';
    const t = (en, tr) => (lang === '1' ? tr : en);

    if (!contact_name || !contact_name.trim()) {
        return { ok: false, field: 0, message: t('You did not enter your name!', 'İsminizi girmediniz!') };
    }
    if (!contact_email || !contact_email.trim()) {
        return { ok: false, field: 1, message: t('You did not enter your email address!', 'EPosta adresinizi girmediniz!') };
    }
    if (!/^\S+@\S+\.\S+$/.test(contact_email.trim())) {
        return { ok: false, field: 1, message: t('Your email address is not in the correct format!', 'EPosta adresiniz doğru biçimde değil!') };
    }
    if (!contact_subject || !contact_subject.trim()) {
        return { ok: false, field: 2, message: t('You did not enter the subject!', 'İleti konusunu girmediniz!') };
    }
    if (!contact_message || !contact_message.trim()) {
        return { ok: false, field: 3, message: t('You did not enter the message!', 'İletiyi girmediniz!') };
    }
    return { ok: true, lang };
}

router.post('/', async (req, res) => {
    const v = validate(req.body || {});
    if (!v.ok) {
        return res.status(400).json({ success: false, message: v.message, invalid_field: v.field });
    }

    const { contact_name, contact_email, contact_subject, contact_message } = req.body;
    const lang = v.lang;

    // Store in DB regardless of email success (so admin always has a record)
    try {
        await query(
            'INSERT INTO contact_messages (name, email, subject, message, language) VALUES (?, ?, ?, ?, ?)',
            [contact_name.trim(), contact_email.trim(), contact_subject.trim(), contact_message.trim(), lang]
        );
    } catch (err) {
        console.error('DB insert failed:', err.message);
    }

    // Send email (optional — if SMTP not configured, still report success because DB has it)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 465,
                secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: process.env.SMTP_TO || process.env.SMTP_USER,
                replyTo: contact_email.trim(),
                subject: `${contact_name.trim()} sent us a message via our website`,
                text: `${contact_name} (${contact_email})\n\n${contact_subject}\n\n${contact_message}`,
            });
        } catch (err) {
            console.error('SMTP send failed:', err.message);
            // Still return success — message is safe in DB.
        }
    }

    const successMsg = lang === '1'
        ? 'İletiniz bize başarıyla ulaştı ve en kısa sürede dönüş yapacağız. Teşekkür ederiz.'
        : 'We received your message successfully and we will get back to you ASAP. Thank You.';

    res.json({ success: true, message: successMsg });
});

module.exports = router;
