import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, resolveMedia } from '../../api/client';
import ThumbImage from '../../components/ThumbImage';
import { useLanguage } from '../../context/LanguageContext';

export default function ProjectsList() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/projects');
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(t(`Delete "${title}"? This cannot be undone.`, `"${title}" silinsin mi? Geri alınamaz.`))) {
      return;
    }
    try {
      await api.delete(`/admin/projects/${id}`);
      await load();
    } catch (err) {
      alert(t('Delete failed.', 'Silinemedi.'));
    }
  };

  const togglePublished = async (project) => {
    try {
      await api.put(`/admin/projects/${project.id}`, {
        ...project,
        is_published: project.is_published ? 0 : 1,
      });
      await load();
    } catch (err) {
      alert(t('Update failed.', 'Güncellenemedi.'));
    }
  };

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.type === filter);

  return (
    <div>
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-phoenix text-xs tracking-[0.4em] uppercase mb-2">
            {t('Manage', 'Yönet')}
          </div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wider uppercase text-parchment">
            {t('Projects', 'Projeler')}
          </h1>
        </div>
        <Link to="/admin/projects/new" className="btn-primary">
          ＋ {t('New Project', 'Yeni Proje')}
        </Link>
      </header>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6">
        {[
          { val: 'all', label: t('All', 'Tümü') },
          { val: 'game', label: t('Games', 'Oyunlar') },
          { val: 'software', label: t('Software', 'Yazılımlar') },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`px-4 py-2 text-xs tracking-[0.2em] uppercase rounded border transition-all ${
              filter === f.val
                ? 'border-ember bg-ember/15 text-phoenix'
                : 'border-white/10 text-ash/70 hover:border-white/30 hover:text-parchment'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-ash/70 text-center py-12">{t('Loading…', 'Yükleniyor…')}</div>
      ) : filtered.length === 0 ? (
        <div className="card-panel p-12 text-center">
          <div className="text-ash/60 mb-4">{t('No projects yet.', 'Henüz proje yok.')}</div>
          <Link to="/admin/projects/new" className="btn-primary inline-flex">
            {t('Add your first project', 'İlk projenizi ekleyin')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const cover = p.images?.[0];
            return (
              <div
                key={p.id}
                className="card-panel p-4 flex items-start gap-4 hover:border-ember/40 transition-all"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-20 flex-shrink-0 bg-ink-900 rounded overflow-hidden">
                  {cover ? (
                    <ThumbImage
                      image={cover.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ash/40 text-xs">
                      —
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 rounded ${
                        p.type === 'game'
                          ? 'bg-ember/15 text-ember border border-ember/30'
                          : 'bg-phoenix/15 text-phoenix border border-phoenix/30'
                      }`}
                    >
                      {p.type}
                    </span>
                    {!p.is_published && (
                      <span className="text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 rounded bg-white/5 text-ash/60 border border-white/10">
                        {t('Draft', 'Taslak')}
                      </span>
                    )}
                    {p.status_en && (
                      <span className="text-[10px] text-ash/60 tracking-wider">
                        · {p.status_en}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/admin/projects/${p.id}`}
                    className="font-display text-lg tracking-wider text-parchment hover:text-phoenix transition-colors"
                  >
                    {p.title}
                  </Link>
                  <div className="text-sm text-ash/70 line-clamp-1 mt-0.5">
                    {p.tagline_en}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublished(p)}
                    className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded border transition-all ${
                      p.is_published
                        ? 'border-phoenix/40 text-phoenix hover:bg-phoenix/10'
                        : 'border-white/20 text-ash/70 hover:bg-white/5'
                    }`}
                  >
                    {p.is_published ? t('Published', 'Yayında') : t('Publish', 'Yayınla')}
                  </button>
                  <Link
                    to={`/admin/projects/${p.id}`}
                    className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded border border-white/20 text-ash hover:border-phoenix hover:text-phoenix transition-all"
                  >
                    {t('Edit', 'Düzenle')}
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded border border-ember/30 text-ember hover:bg-ember/10 transition-all"
                  >
                    {t('Delete', 'Sil')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
