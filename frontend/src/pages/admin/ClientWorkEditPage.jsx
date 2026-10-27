import { Link, useParams } from 'react-router';
import { ClientWorkFields } from '../../components/admin/services/ClientWorkFields';
import { ClientWorkForm } from '../../components/admin/services/ClientWorkForm';
import { AdminPage } from '../../components/admin/ui/AdminPage';
import { EditorGate } from '../../components/admin/ui/EditorGate';
import { CARD_TITLE } from '../../components/admin/ui/styles';
import { WorkFrame } from '../../components/home/services/WorkFrame';
import { PANEL } from '../../components/ui/styles';
import { useEntryEditor } from '../../hooks/admin/useEntryEditor';
import { useLanguage } from '../../i18n/useLanguage';
import { admin } from '../../services';

const WORK = Object.freeze({ collection: admin.clientWorks, form: ClientWorkForm, path: '/admin/services', notFound: 'Work not found.' });

/** The saved work in its frame, as the site shows it. */
function WorkPreview({ work })
{
  const { t } = useLanguage();
  return <section className="flex flex-col gap-4"><h2 className={CARD_TITLE}>{t('Preview', 'Önizleme')}</h2><div className={`${PANEL} overflow-hidden`}><WorkFrame work={work} /></div></section>;
}

export function ClientWorkEditPage()
{
  const { id } = useParams(), { t } = useLanguage(), editor = useEntryEditor(id, WORK), saved = editor.value?.saved;
  const back = <Link to="/admin/services" className="text-xs text-ash/60 hover:text-phoenix tracking-wider uppercase">← {t('Back to services', 'Hizmetlere dön')}</Link>;
  return (
    <AdminPage eyebrow={back} title={id === 'new' ? t('New Work', 'Yeni İş') : editor.value?.title || t('Untitled', 'Adsız')}>
      <EditorGate editor={editor}>{(form) => <ClientWorkFields editor={editor} form={form} />}</EditorGate>{saved && <WorkPreview work={saved} />}
    </AdminPage>
  );
}
