import { useEffect, useState, useRef } from 'react';
import { api, resolveMedia } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutEditor() {
  const { t } = useLanguage();
  const [data, setData] = useState({ title: '', body_en: '', body_tr: '' });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/about');
      setData({
        title: res.data.title || '',
        body_en: res.data.body_en || '',
        body_tr: res.data.body_tr || '',
      });
      setImages(res.data.images || []);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/about', data);
      showFlash('ok', t('Saved.', 'Kaydedildi.'));
    } catch (err) {
      showFlash('err', err?.response?.data?.message || t('Save failed.', 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('image', file);
    form.append('alt_text', '');
    try {
      await api.post('/admin/about/images', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await load();
      showFlash('ok', t('Image added.', 'Görsel eklendi.'));
    } catch (err) {
      showFlash('err', err?.response?.data?.message || t('Upload failed.', 'Yükleme başarısız.'));
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDeleteImage = async (id) => {
    if (!confirm(t('Delete this image?', 'Bu görseli sil?'))) return;
    try {
      await api.delete(`/admin/about/images/${id}`);
      await load();
      showFlash('ok', t('Deleted.', 'Silindi.'));
    } catch (err) {
      showFlash('err', t('Delete failed.', 'Silinemedi.'));
    }
  };

  const moveImage = async (id, direction) => {
    const idx = images.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const reordered = [...images];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    setImages(reordered);
    try {
      await api.put('/admin/about/images/reorder', {
        order: reordered.map((i) => i.id),
      });
    } catch (err) {
      console.error(err);
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
          {t('About Section', 'Hakkında Bölümü')}
        </h1>
        <p className="text-ash/60 mt-2 text-sm">
          {t(
            'Story text supports inline links via [label](url), and **bold** / *italic*. Use blank lines for paragraphs.',
            'Hikaye metni satır içi linkleri [etiket](url), kalın **metin** ve italik *metin* destekler. Paragraf için boş satır bırakın.'
          )}
        </p>
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

      <div className="card-panel p-6 md:p-8 space-y-6 mb-10">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
            {t('Section Title', 'Bölüm Başlığı')}
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="input-anka"
            placeholder="About AnkA"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Body — English', 'Metin — İngilizce')}
            </label>
            <textarea
              value={data.body_en}
              onChange={(e) => setData({ ...data, body_en: e.target.value })}
              rows={14}
              className="input-anka font-mono text-sm leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Body — Turkish', 'Metin — Türkçe')}
            </label>
            <textarea
              value={data.body_tr}
              onChange={(e) => setData({ ...data, body_tr: e.target.value })}
              rows={14}
              className="input-anka font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t('Saving…', 'Kaydediliyor…') : t('Save', 'Kaydet')}
          </button>
        </div>
      </div>

      {/* Images */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <h2 className="font-display text-xl tracking-[0.2em] uppercase text-parchment">
            {t('Gallery Images', 'Galeri Görselleri')}
          </h2>
          <label className="btn-ghost cursor-pointer">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            ＋ {t('Upload Image', 'Görsel Yükle')}
          </label>
        </div>

        {images.length === 0 ? (
          <div className="card-panel p-8 text-center text-ash/60">
            {t('No images yet.', 'Henüz görsel yok.')}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="card-panel overflow-hidden">
                <div className="aspect-video bg-ink-900 overflow-hidden">
                  <img
                    src={resolveMedia(img.image_url)}
                    alt={img.alt_text}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="text-xs text-ash/60 truncate flex-1">
                    {img.alt_text || `#${idx + 1}`}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveImage(img.id, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-ash/70 hover:text-phoenix disabled:opacity-30 disabled:cursor-not-allowed"
                      title={t('Move up', 'Yukarı')}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveImage(img.id, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1.5 text-ash/70 hover:text-phoenix disabled:opacity-30 disabled:cursor-not-allowed"
                      title={t('Move down', 'Aşağı')}
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-1.5 text-ash/70 hover:text-ember"
                      title={t('Delete', 'Sil')}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
