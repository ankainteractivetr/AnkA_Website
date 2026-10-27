import { Link } from 'react-router';
import { useLanguage } from '../../../i18n/useLanguage';
import { PANEL } from '../../ui/styles';
import { AdminThumb } from '../ui/AdminThumb';
import { badgeClass, chipClass } from '../ui/styles';

const TYPE_BADGE = Object.freeze({ game: 'ember', software: 'phoenix' });

function ProjectCover({ image })
{
  const placeholder = <div className="w-full h-full flex items-center justify-center text-ash/40 text-xs">—</div>;
  return <div className="w-24 h-24 sm:w-32 sm:h-20 shrink-0 bg-ink-900 rounded overflow-hidden">{image ? <AdminThumb url={image.url} className="w-full h-full object-cover" /> : placeholder}</div>;
}

function ProjectSummary({ project })
{
  const { t } = useLanguage();
  return (
    <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1 flex-wrap"><span className={badgeClass(TYPE_BADGE[project.type])}>{project.type}</span>{!project.isPublished && <span className={badgeClass('muted')}>{t('Draft', 'Taslak')}</span>}{project.status.en && <span className="text-[10px] text-ash/60 tracking-wider">· {project.status.en}</span>}</div>
      <Link to={`/admin/projects/${project.id}`} className="font-display text-lg tracking-wider text-parchment hover:text-phoenix transition-colors">{project.title}</Link><div className="text-sm text-ash/70 line-clamp-1 mt-0.5">{project.tagline.en}</div>
    </div>
  );
}

function ProjectActions({ project, actions })
{
  const { t } = useLanguage(), remove = () => window.confirm(t(`Delete "${project.title}"? This cannot be undone.`, `"${project.title}" silinsin mi? Geri alınamaz.`)) && actions.remove(project);
  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
      <button type="button" onClick={() => actions.save({ ...project, isPublished: !project.isPublished })} className={chipClass(project.isPublished ? 'accent' : 'muted')}>{project.isPublished ? t('Published', 'Yayında') : t('Publish', 'Yayınla')}</button>
      <Link to={`/admin/projects/${project.id}`} className={chipClass('neutral')}>{t('Edit', 'Düzenle')}</Link><button type="button" onClick={remove} className={chipClass('danger')}>{t('Delete', 'Sil')}</button>
    </div>
  );
}

/** One project in the CMS list: cover, badges, title and its publish / edit / delete actions. */
export function ProjectRow({ project, actions })
{
  return <div className={`${PANEL} p-4 flex items-start gap-4`}><ProjectCover image={project.images[0]} /><ProjectSummary project={project} /><ProjectActions project={project} actions={actions} /></div>;
}
