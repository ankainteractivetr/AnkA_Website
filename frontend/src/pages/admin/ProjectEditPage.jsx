import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { GalleryManager } from '../../components/admin/gallery/GalleryManager';
import { ProjectFields } from '../../components/admin/projects/ProjectFields';
import { ProjectForm } from '../../components/admin/projects/ProjectForm';
import { AdminPage } from '../../components/admin/ui/AdminPage';
import { EditorGate } from '../../components/admin/ui/EditorGate';
import { MARKUP_HINT } from '../../components/admin/ui/markupHint';
import { useEntryEditor } from '../../hooks/admin/useEntryEditor';
import { useLanguage } from '../../i18n/useLanguage';
import { admin } from '../../services';

// A new project moves to its own address once created, where its screenshots can be added.
const PROJECT = Object.freeze({ collection: admin.projects, form: ProjectForm, path: '/admin/projects', notFound: 'Project not found.' });

function Screenshots({ projectId, title })
{
  const { t } = useLanguage(), gallery = useMemo(() => admin.projectImages(projectId), [projectId]);
  return <GalleryManager gallery={gallery} title={t('Screenshots & Media', 'Ekran Görüntüleri & Medya')} altText={title} />;
}

export function ProjectEditPage()
{
  const { id } = useParams(), { t, pick } = useLanguage(), editor = useEntryEditor(id, PROJECT), isNew = id === 'new';
  const back = <Link to="/admin/projects" className="text-xs text-ash/60 hover:text-phoenix tracking-wider uppercase">← {t('Back to projects', 'Projelere dön')}</Link>;
  return (
    <AdminPage eyebrow={back} title={isNew ? t('New Project', 'Yeni Proje') : editor.value?.title || t('Untitled', 'Adsız')} description={pick(MARKUP_HINT)}>
      <EditorGate editor={editor}>{(form) => <ProjectFields editor={editor} form={form} />}</EditorGate>{!isNew && editor.value && <Screenshots projectId={id} title={editor.value.title} />}
    </AdminPage>
  );
}
