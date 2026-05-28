import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

const emptyLink = { platform: '', url: '', icon_name: '', display_order: 0, is_active: 1 };

const ICON_OPTIONS = [
  'linkedin', 'instagram', 'twitter', 'x', 'youtube', 'facebook',
  'discord', 'steam', 'twitch', 'github', 'bluesky',
];

export default function ContactEditor() {
  const { t } = useLanguage();
  const [info, setInfo] = useState({
    intro_en: '', intro_tr: '', outro_en: '', outro_tr: '',
    email: '', map_embed_url: '',
  });
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [newLink, setNewLink] = useState(emptyLink);

  const load = async () => {
    setLoading(true);
    try {
      const [infoRes, linksRes] = await Promise.all([
        api.get('/admin/contact-info'),
        api.get('/admin/social-links'),
      ]);
      setInfo({
        intro_en: infoRes.data?.intro_en || '',
        intro_tr: infoRes.data?.intro_tr || '',
        outro_en: infoRes.data?.outro_en || '',
        outro_tr: infoRes.data?.outro_tr || '',
        email: infoRes.data?.email || '',
        map_embed_url: infoRes.data?.map_embed_url || '',
      });
      setLinks(linksRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showFlash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      await api.put('/admin/contact-info', info);
      showFlash('ok', t('Contact info saved.', 'İletişim bilgisi kaydedildi.'));
    } catch (err) {
      showFlash('err', t('Save failed.', 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.platform || !newLink.url) {
      showFlash('err', t('Platform and URL are required.', 'Platform ve URL gerekli.'));
      return;
    }
    try {
      await api.post('/admin/social-links', {
        ...newLink,
        icon_name: newLink.icon_name || newLink.platform.toLowerCase(),
      });
      setNewLink(emptyLink);
      await load();
      showFlash('ok', t('Link added.', 'Link eklendi.'));
    } catch (err) {
      showFlash('err', t('Add failed.', 'Eklenemedi.'));
    }
  };

  const handleUpdateLink = async (link, patch) => {
    try {
      await api.put(`/admin/social-links/${link.id}`, { ...link, ...patch });
      await load();
    } catch (err) {
      showFlash('err', t('Update failed.', 'Güncellenemedi.'));
    }
  };

  const handleDeleteLink = async (id) => {
    if (!confirm(t('Delete this link?', 'Bu linki sil?'))) return;
    try {
      await api.delete(`/admin/social-links/${id}`);
      await load();
    } catch (err) {
      showFlash('err', t('Delete failed.', 'Silinemedi.'));
    }
  };

  const moveLink = async (id, direction) => {
    const idx = links.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= links.length) return;
    const reordered = [...links];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    setLinks(reordered);
    try {
      await api.put('/admin/social-links/reorder', {
        order: reordered.map((l) => l.id),
      });
    } catch (err) {
      load();
    }
  };

  if (loading) {
    return <div className="text-ash/70 text-center py-12">{t('Loading…', 'Yükleniyor…')}</div>;
  }

  return (
    <div>
      <header className="mb-8">
        <div className="text-phoenix text-xs tracking-[0.4em] uppercase mb-2">
          {t('Edit', 'Düzenle')}
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-wider uppercase text-parchment">
          {t('Contact & Social', 'İletişim & Sosyal')}
        </h1>
      </header>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded border text-sm ${
            message.type === 'ok'
              ? 'border-phoenix/40 bg-phoenix/10 text-phoenix'
              : 'border-ember/40 bg-ember/10 text-ember'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Contact info */}
      <section className="card-panel p-6 md:p-8 space-y-6 mb-10">
        <h2 className="font-display text-xl tracking-[0.2em] uppercase text-parchment">
          {t('Contact Section Texts', 'İletişim Bölümü Metinleri')}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Intro — EN', 'Giriş — İngilizce')}
            </label>
            <textarea
              value={info.intro_en}
              onChange={(e) => setInfo({ ...info, intro_en: e.target.value })}
              rows={3}
              className="input-anka text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Intro — TR', 'Giriş — Türkçe')}
            </label>
            <textarea
              value={info.intro_tr}
              onChange={(e) => setInfo({ ...info, intro_tr: e.target.value })}
              rows={3}
              className="input-anka text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Outro — EN', 'Kapanış — İngilizce')}
            </label>
            <textarea
              value={info.outro_en}
              onChange={(e) => setInfo({ ...info, outro_en: e.target.value })}
              rows={3}
              className="input-anka text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Outro — TR', 'Kapanış — Türkçe')}
            </label>
            <textarea
              value={info.outro_tr}
              onChange={(e) => setInfo({ ...info, outro_tr: e.target.value })}
              rows={3}
              className="input-anka text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Public Email', 'Açık E-posta')}
            </label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              className="input-anka"
              placeholder="contact@ankainteractive.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Google Map Embed URL', 'Google Map Embed URL')}
            </label>
            <input
              type="text"
              value={info.map_embed_url}
              onChange={(e) => setInfo({ ...info, map_embed_url: e.target.value })}
              className="input-anka text-sm font-mono"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveInfo}
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t('Saving…', 'Kaydediliyor…') : t('Save Contact Info', 'İletişim Bilgisini Kaydet')}
          </button>
        </div>
      </section>

      {/* Social links */}
      <section>
        <h2 className="font-display text-xl tracking-[0.2em] uppercase text-parchment mb-4">
          {t('Social Links', 'Sosyal Linkler')}
        </h2>

        <div className="space-y-3 mb-6">
          {links.length === 0 ? (
            <div className="card-panel p-6 text-center text-ash/60">
              {t('No links yet. Add one below.', 'Henüz link yok. Aşağıdan ekleyin.')}
            </div>
          ) : (
            links.map((link, idx) => (
              <div key={link.id} className="card-panel p-4 grid md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-ash/60 mb-1 md:hidden">
                    {t('Platform', 'Platform')}
                  </label>
                  <input
                    type="text"
                    defaultValue={link.platform}
                    onBlur={(e) => e.target.value !== link.platform && handleUpdateLink(link, { platform: e.target.value })}
                    className="input-anka text-sm py-2"
                    placeholder="LinkedIn"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[10px] uppercase tracking-wider text-ash/60 mb-1 md:hidden">URL</label>
                  <input
                    type="text"
                    defaultValue={link.url}
                    onBlur={(e) => e.target.value !== link.url && handleUpdateLink(link, { url: e.target.value })}
                    className="input-anka text-sm py-2 font-mono"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-ash/60 mb-1 md:hidden">
                    {t('Icon', 'İkon')}
                  </label>
                  <select
                    defaultValue={link.icon_name}
                    onChange={(e) => handleUpdateLink(link, { icon_name: e.target.value })}
                    className="input-anka text-sm py-2"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleUpdateLink(link, { is_active: link.is_active ? 0 : 1 })}
                    className={`text-[10px] tracking-[0.2em] uppercase px-2 py-1.5 rounded border transition-all ${
                      link.is_active
                        ? 'border-phoenix/40 text-phoenix'
                        : 'border-white/20 text-ash/70'
                    }`}
                    title={link.is_active ? t('Active', 'Aktif') : t('Hidden', 'Gizli')}
                  >
                    {link.is_active ? t('On', 'Açık') : t('Off', 'Kapalı')}
                  </button>
                  <button
                    onClick={() => moveLink(link.id, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-ash/70 hover:text-phoenix disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveLink(link.id, 'down')}
                    disabled={idx === links.length - 1}
                    className="p-1.5 text-ash/70 hover:text-phoenix disabled:opacity-30"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-1.5 text-ash/70 hover:text-ember"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add new link */}
        <div className="card-panel p-4 border-dashed border-2 border-white/10">
          <div className="text-xs tracking-[0.2em] uppercase text-ash/70 mb-3">
            {t('Add New Link', 'Yeni Link Ekle')}
          </div>
          <div className="grid md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-3">
              <label className="block text-[10px] uppercase tracking-wider text-ash/60 mb-1">
                {t('Platform', 'Platform')}
              </label>
              <input
                type="text"
                value={newLink.platform}
                onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                className="input-anka text-sm py-2"
                placeholder="LinkedIn"
              />
            </div>
            <div className="md:col-span-5">
              <label className="block text-[10px] uppercase tracking-wider text-ash/60 mb-1">URL</label>
              <input
                type="text"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="input-anka text-sm py-2 font-mono"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wider text-ash/60 mb-1">
                {t('Icon', 'İkon')}
              </label>
              <select
                value={newLink.icon_name}
                onChange={(e) => setNewLink({ ...newLink, icon_name: e.target.value })}
                className="input-anka text-sm py-2"
              >
                <option value="">—</option>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button onClick={handleAddLink} className="btn-primary w-full justify-center text-sm py-2.5">
                ＋ {t('Add', 'Ekle')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
