import { useState } from 'react';
import { Link } from 'react-router';
import { ProjectRow } from '../../components/admin/projects/ProjectRow';
import { AdminPage } from '../../components/admin/ui/AdminPage';
import { ErrorNotice, Loading } from '../../components/admin/ui/Notice';
import { CARD, MUTED } from '../../components/admin/ui/styles';
import { buttonClass } from '../../components/ui/styles';
import { useAdminList } from '../../hooks/admin/useAdminList';
import { useListActions } from '../../hooks/admin/useListActions';
import { useLanguage } from '../../i18n/useLanguage';
import { admin } from '../../services';

const FILTERS = Object.freeze([{ value: 'all', label: { en: 'All', tr: 'Tümü' } }, { value: 'game', label: { en: 'Games', tr: 'Oyunlar' } }, { value: 'software', label: { en: 'Software', tr: 'Yazılımlar' } }]);
const PILL = 'px-4 py-2 text-xs tracking-[0.2em] uppercase rounded border transition-all border-white/10 text-ash/70 hover:border-white/30 hover:text-parchment aria-pressed:border-ember aria-pressed:bg-ember/15 aria-pressed:text-phoenix';
const loadProjects = () => admin.projects.list();

function FilterPills({ value, onChange })
{
  const { pick } = useLanguage();
  return <div className="flex gap-2">{FILTERS.map((filter) => <button key={filter.value} type="button" className={PILL} aria-pressed={filter.value === value} onClick={() => onChange(filter.value)}>{pick(filter.label)}</button>)}</div>;
}

function ProjectList({ projects, filter, actions })
{
  const { t } = useLanguage();
  if (projects === null) return <Loading />;
  const shown = filter === 'all' ? projects : projects.filter((project) => project.type === filter);
  if (shown.length === 0) return <div className={`${CARD} items-center text-center`}><div className={MUTED}>{t('No projects yet.', 'Henüz proje yok.')}</div><Link to="/admin/projects/new" className={buttonClass('primary')}>{t('Add your first project', 'İlk projenizi ekleyin')}</Link></div>;
  return <div className="space-y-3">{shown.map((project) => <ProjectRow key={project.id} project={project} actions={actions} />)}</div>;
}

export function ProjectsPage()
{
  const { t } = useLanguage(), [filter, setFilter] = useState('all');
  const list = useAdminList(loadProjects), actions = useListActions(list, admin.projects);
  return (
    <AdminPage eyebrow={t('Manage', 'Yönet')} title={t('Projects', 'Projeler')} actions={<Link to="/admin/projects/new" className={buttonClass('primary')}>＋ {t('New Project', 'Yeni Proje')}</Link>}>
      <FilterPills value={filter} onChange={setFilter} /><ErrorNotice error={list.error} /><ProjectList projects={list.items} filter={filter} actions={actions} />
    </AdminPage>
  );
}
