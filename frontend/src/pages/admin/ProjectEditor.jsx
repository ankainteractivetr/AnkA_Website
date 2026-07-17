import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, resolveMedia } from '../../api/client';
import ThumbImage from '../../components/ThumbImage';
import { useLanguage } from '../../context/LanguageContext';

const emptyProject = {
  slug: '',
  type: 'game',
  title: '',
  tagline_en: '',
  tagline_tr: '',
  description_en: '',
  description_tr: '',
  features_en: '',
  features_tr: '',
  steam_widget_url: '',
  microsoft_store_url: '',
  sourceforge_name: '',
  sourceforge_group_id: '',
  trailer_url: '',
  download_url: '',
  status_en: '',
  status_tr: '',
  display_order: 0,
  is_published: 1,
};

export default function ProjectEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [project, setProject] = useState(emptyProject);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileRef = useRef(null);

  const load = async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/projects/${id}`);
      setProject({
        ...emptyProject,
        ...res.data,
        is_published: res.data.is_published ? 1 : 0,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const showFlash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) :
      e.target.type === 'number' ? Number(e.target.value) :
      e.target.value;
    setProject({ ...project, [field]: value });
  };

  const slugify = (s) =>
    s
      .toLowerCase()
      .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
      .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleTitleBlur = () => {
    if (isNew && !project.slug && project.title) {
      setProject((p) => ({ ...p, slug: slugify(p.title) }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const res = await api.post('/admin/projects', project);
        navigate(`/admin/projects/${res.data.id}`);
      } else {
        await api.put(`/admin/projects/${id}`, project);
        showFlash('ok', t('Saved.', 'Kaydedildi.'));
      }
    } catch (err) {
      showFlash('err', err?.response?.data?.message || t('Save failed.', 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || isNew) return;
    const form = new FormData();
    form.append('image', file);
    form.append('alt_text', project.title || '');
    try {
      await api.post(`/admin/projects/${id}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await load();
      showFlash('ok', t('Image added.', 'Görsel eklendi.'));
    } catch (err) {
      showFlash('err', t('Upload failed.', 'Yükleme başarısız.'));
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDeleteImage = async (imgId) => {
    if (!confirm(t('Delete this image?', 'Bu görseli sil?'))) return;
    try {
      await api.delete(`/admin/projects/${id}/images/${imgId}`);
      await load();
    } catch (err) {
      showFlash('err', t('Delete failed.', 'Silinemedi.'));
    }
  };

  const moveImage = async (imgId, direction) => {
    const idx = images.findIndex((i) => i.id === imgId);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const reordered = [...images];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    setImages(reordered);
    try {
      await api.put(`/admin/projects/${id}/images/reorder`, {
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
        <Link
          to="/admin/projects"
          className="text-xs text-ash/60 hover:text-phoenix tracking-wider uppercase"
        >
          ← {t('Back to projects', 'Projelere dön')}
        </Link>
        <h1 className="font-display text-3xl md:text-4xl tracking-wider uppercase text-parchment mt-3">
          {isNew ? t('New Project', 'Yeni Proje') : project.title || t('Untitled', 'Adsız')}
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

      <div className="card-panel p-6 md:p-8 space-y-6 mb-10">
        {/* Type + slug + title row */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Type', 'Tür')}
            </label>
            <select
              value={project.type}
              onChange={handleChange('type')}
              className="input-anka"
            >
              <option value="game">{t('Game', 'Oyun')}</option>
              <option value="software">{t('Software', 'Yazılım')}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Title', 'Başlık')}
            </label>
            <input
              type="text"
              value={project.title}
              onChange={handleChange('title')}
              onBlur={handleTitleBlur}
              className="input-anka"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Slug', 'URL Kısaltma')}
            </label>
            <input
              type="text"
              value={project.slug}
              onChange={handleChange('slug')}
              className="input-anka font-mono text-sm"
              placeholder="shahmaran"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Display Order', 'Görüntü Sırası')}
            </label>
            <input
              type="number"
              value={project.display_order}
              onChange={handleChange('display_order')}
              className="input-anka"
            />
          </div>
        </div>

        {/* Tagline */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Tagline — EN', 'Slogan — İngilizce')}
            </label>
            <input
              type="text"
              value={project.tagline_en}
              onChange={handleChange('tagline_en')}
              className="input-anka"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Tagline — TR', 'Slogan — Türkçe')}
            </label>
            <input
              type="text"
              value={project.tagline_tr}
              onChange={handleChange('tagline_tr')}
              className="input-anka"
            />
          </div>
        </div>

        {/* Status */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Status — EN', 'Durum — İngilizce')}
            </label>
            <input
              type="text"
              value={project.status_en}
              onChange={handleChange('status_en')}
              className="input-anka"
              placeholder="In Development"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Status — TR', 'Durum — Türkçe')}
            </label>
            <input
              type="text"
              value={project.status_tr}
              onChange={handleChange('status_tr')}
              className="input-anka"
              placeholder="Geliştirme Aşamasında"
            />
          </div>
        </div>

        {/* Description */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Description — EN', 'Açıklama — İngilizce')}
            </label>
            <textarea
              value={project.description_en}
              onChange={handleChange('description_en')}
              rows={8}
              className="input-anka font-mono text-sm leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Description — TR', 'Açıklama — Türkçe')}
            </label>
            <textarea
              value={project.description_tr}
              onChange={handleChange('description_tr')}
              rows={8}
              className="input-anka font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Features — EN', 'Özellikler — İngilizce')}
            </label>
            <textarea
              value={project.features_en}
              onChange={handleChange('features_en')}
              rows={4}
              className="input-anka font-mono text-sm leading-relaxed"
              placeholder={t('Short blurb shown italicized', 'Kısa, italik gösterilen yazı')}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Features — TR', 'Özellikler — Türkçe')}
            </label>
            <textarea
              value={project.features_tr}
              onChange={handleChange('features_tr')}
              rows={4}
              className="input-anka font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Steam Widget URL', 'Steam Widget URL')}
            </label>
            <input
              type="text"
              value={project.steam_widget_url}
              onChange={handleChange('steam_widget_url')}
              className="input-anka text-sm"
              placeholder="https://store.steampowered.com/widget/3061480/"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Trailer URL', 'Fragman URL')}
            </label>
            <input
              type="text"
              value={project.trailer_url}
              onChange={handleChange('trailer_url')}
              className="input-anka text-sm"
              placeholder="https://youtu.be/..."
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Download URL', 'İndirme URL')}
            </label>
            <input
              type="text"
              value={project.download_url}
              onChange={handleChange('download_url')}
              className="input-anka text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Microsoft Store URL', 'Microsoft Store URL')}
            </label>
            <input
              type="text"
              value={project.microsoft_store_url}
              onChange={handleChange('microsoft_store_url')}
              className="input-anka text-sm"
              placeholder="https://apps.microsoft.com/detail/..."
            />
            <p className="text-[11px] text-ash/50 mt-1.5">
              {t(
                'Shown as a Microsoft Store badge (great for software).',
                'Microsoft Store rozeti olarak gösterilir (programlar için ideal).'
              )}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('SourceForge Project Name', 'SourceForge Proje Adı')}
            </label>
            <input
              type="text"
              value={project.sourceforge_name}
              onChange={handleChange('sourceforge_name')}
              className="input-anka text-sm"
              placeholder="ayzit"
            />
            <p className="text-[11px] text-ash/50 mt-1.5">
              {t(
                'Badge opens https://sourceforge.net/p/<name>/ in a new tab.',
                'Rozet, https://sourceforge.net/p/<ad>/ adresini yeni sekmede açar.'
              )}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('SourceForge Group ID', 'SourceForge Grup ID')}
            </label>
            <input
              type="text"
              value={project.sourceforge_group_id}
              onChange={handleChange('sourceforge_group_id')}
              className="input-anka text-sm"
              placeholder="4115303"
            />
            <p className="text-[11px] text-ash/50 mt-1.5">
              {t(
                'Numeric id used by the sflogo badge image. Both fields are required for the badge to show.',
                'Sflogo rozet görseli için sayısal id. Rozetin görünmesi için iki alan da gereklidir.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!project.is_published}
              onChange={handleChange('is_published')}
              className="w-4 h-4 accent-ember"
            />
            <span className="text-sm text-ash">
              {t('Published (visible on site)', 'Yayında (sitede görünür)')}
            </span>
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? t('Saving…', 'Kaydediliyor…')
              : isNew
              ? t('Create Project', 'Proje Oluştur')
              : t('Save Changes', 'Değişiklikleri Kaydet')}
          </button>
        </div>
      </div>

      {/* Images section, only after creation */}
      {!isNew && (
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="font-display text-xl tracking-[0.2em] uppercase text-parchment">
              {t('Screenshots & Media', 'Ekran Görüntüleri & Medya')}
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
                    <ThumbImage
                      image={img.image_url}
                      alt={img.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="text-xs text-ash/60 truncate flex-1">
                      #{idx + 1}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveImage(img.id, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-ash/70 hover:text-phoenix disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveImage(img.id, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1.5 text-ash/70 hover:text-phoenix disabled:opacity-30"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1.5 text-ash/70 hover:text-ember"
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
      )}
    </div>
  );
}
