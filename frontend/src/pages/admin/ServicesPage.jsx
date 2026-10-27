import { Link } from 'react-router';
import { ClientWorkRow } from '../../components/admin/services/ClientWorkRow';
import { AdminPage } from '../../components/admin/ui/AdminPage';
import { ErrorNotice, Loading } from '../../components/admin/ui/Notice';
import { CARD, CARD_TITLE, MUTED } from '../../components/admin/ui/styles';
import { WorkShowcase } from '../../components/home/services/WorkShowcase';
import { buttonClass } from '../../components/ui/styles';
import { useAdminList } from '../../hooks/admin/useAdminList';
import { useListActions } from '../../hooks/admin/useListActions';
import { useLanguage } from '../../i18n/useLanguage';
import { admin } from '../../services';

const loadWorks = () => admin.clientWorks.list();

function NewWorkLink({ children })
{
  const { t } = useLanguage();
  return <Link to="/admin/services/new" className={buttonClass('primary')}>{children ?? `＋ ${t('New Work', 'Yeni İş')}`}</Link>;
}

function WorkRows({ works, actions })
{
  const { t } = useLanguage();
  if (works === null) return <Loading />;
  if (works.length === 0) return <div className={`${CARD} items-center text-center`}><div className={MUTED}>{t('No works yet.', 'Henüz iş yok.')}</div><NewWorkLink>{t('Add your first work', 'İlk işinizi ekleyin')}</NewWorkLink></div>;
  return <div className="space-y-3">{works.map((work, index) => <ClientWorkRow key={work.id} work={work} index={index} works={works} actions={actions} />)}</div>;
}

/** The section as visitors see it: the published works only. */
function SitePreview({ works })
{
  const { t } = useLanguage(), published = (works ?? []).filter((work) => work.isPublished);
  if (published.length === 0) return null;
  return <section className="flex flex-col gap-4"><h2 className={CARD_TITLE}>{t('On the Site', 'Sitedeki Görünüm')}</h2><WorkShowcase works={published} /></section>;
}

export function ServicesPage()
{
  const { t } = useLanguage(), list = useAdminList(loadWorks), actions = useListActions(list, admin.clientWorks);
  const description = t('Works done for clients: a website is shown in a frame, an app by its YouTube video.', 'Müşteriler için yapılan işler: web siteleri bir çerçeve içinde, uygulamalar YouTube videosuyla gösterilir.');
  return (
    <AdminPage eyebrow={t('Manage', 'Yönet')} title={t('Services', 'Hizmetler')} description={description} actions={<NewWorkLink />}>
      <ErrorNotice error={list.error} /><WorkRows works={list.items} actions={actions} /><SitePreview works={list.items} />
    </AdminPage>
  );
}
