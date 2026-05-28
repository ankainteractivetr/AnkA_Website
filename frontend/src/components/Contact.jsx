import { useEffect, useState } from 'react';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import Separator from './Separator';

export default function Contact() {
    const { t, lang } = useLanguage();
    const [info, setInfo] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ kind: '', text: '' });
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        client.get('/public/contact-info').then(({ data }) => {
            if (data.success) setInfo(data.data);
        }).catch(() => {});
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function reset() {
        setForm({ name: '', email: '', subject: '', message: '' });
        setStatus({ kind: '', text: '' });
    }

    async function submit() {
        setBusy(true);
        setStatus({ kind: '', text: '' });
        try {
            const { data } = await client.post('/contact', {
                contact_name: form.name,
                contact_email: form.email,
                contact_subject: form.subject,
                contact_message: form.message,
                contact_lang: lang === 'tr' ? '1' : '0',
            });
            if (data.success) {
                setStatus({ kind: 'ok', text: data.message });
                setForm({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus({ kind: 'err', text: data.message || 'Error' });
            }
        } catch (e) {
            const msg = e.response?.data?.message || t('Network error. Please try again.', 'Bağlantı hatası. Lütfen tekrar deneyin.');
            setStatus({ kind: 'err', text: msg });
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <Separator />
            <section id="contact" className="relative scroll-mt-24">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
                <div className="section-title-wrap">
                    <h2 className="section-title text-3xl sm:text-4xl text-gradient-phoenix">
                        {t('Contact', 'İletişim')}
                    </h2>
                </div>

                <div className="card-panel p-6 sm:p-10">
                    <h3 className="font-deco text-3xl text-parchment text-center mb-6">
                        {t('Contact Us', 'Bize Ulaşın')}
                    </h3>

                    {info && (
                        <p className="text-center max-w-2xl mx-auto text-parchment/85 leading-relaxed mb-10 italic">
                            {lang === 'tr' ? info.intro_tr : info.intro_en}
                        </p>
                    )}

                    <div className="max-w-2xl mx-auto space-y-3">
                        <input
                            name="name"
                            type="text"
                            placeholder={t('Name', 'İsim')}
                            value={form.name}
                            onChange={handleChange}
                            className="input-anka"
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder={t('Email', 'EPosta')}
                            value={form.email}
                            onChange={handleChange}
                            className="input-anka"
                        />
                        <input
                            name="subject"
                            type="text"
                            placeholder={t('Subject', 'Konu')}
                            value={form.subject}
                            onChange={handleChange}
                            className="input-anka"
                        />
                        <textarea
                            name="message"
                            rows="8"
                            placeholder={t('Message', 'İleti')}
                            value={form.message}
                            onChange={handleChange}
                            className="input-anka resize-none"
                        />

                        {status.text && (
                            <div className={`p-4 rounded-sm border ${
                                status.kind === 'ok'
                                    ? 'bg-emerald-900/20 border-emerald-700/50 text-emerald-200'
                                    : 'bg-red-900/20 border-red-700/50 text-red-200'
                            }`}>
                                {status.text}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <button onClick={submit} disabled={busy} className="btn-primary disabled:opacity-50">
                                {busy ? t('Sending…', 'Gönderiliyor…') : t('Send', 'Gönder')}
                            </button>
                            <button onClick={reset} disabled={busy} className="btn-ghost">
                                {t('Reset', 'Sıfırla')}
                            </button>
                        </div>
                    </div>

                    {info && (
                        <p className="text-center max-w-2xl mx-auto text-parchment/80 italic mt-10 font-accent text-xl">
                            {lang === 'tr' ? info.outro_tr : info.outro_en}
                        </p>
                    )}

                    {/* Map */}
                    {info && info.map_embed_url && (
                        <div className="mt-10 max-w-3xl mx-auto rounded-sm overflow-hidden border border-ink-400 shadow-ember-sm">
                            <iframe
                                src={info.map_embed_url}
                                style={{ border: 0, width: '100%', height: '380px', filter: 'invert(0.92) hue-rotate(180deg)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Map"
                            />
                        </div>
                    )}

                    {info && info.email && (
                        <div className="text-center mt-6">
                            <a href={`mailto:${info.email}`} className="text-phoenix hover:text-phoenix-light font-heading tracking-widest">
                                {info.email}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </section>
        </>
    );
}
