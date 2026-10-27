import { useAdminList } from '../../../hooks/admin/useAdminList';
import { useListActions } from '../../../hooks/admin/useListActions';
import { useLanguage } from '../../../i18n/useLanguage';
import { admin } from '../../../services';
import { PANEL } from '../../ui/styles';
import { ErrorNotice, Loading } from '../ui/Notice';
import { CARD_TITLE, MUTED } from '../ui/styles';
import { NewSocialLinkForm } from './NewSocialLinkForm';
import { SocialLinkRow } from './SocialLinkRow';

const loadLinks = () => admin.socialLinks.list();

function SocialLinkList({ links, actions })
{
  const { t } = useLanguage();
  if (links === null) return <Loading />;
  if (links.length === 0) return <div className={`${PANEL} p-6 text-center ${MUTED}`}>{t('No links yet. Add one below.', 'Henüz link yok. Aşağıdan ekleyin.')}</div>;
  return <div className="space-y-3">{links.map((link, index) => <SocialLinkRow key={link.id} link={link} index={index} links={links} actions={actions} />)}</div>;
}

/** The footer's social links: edit, show / hide, reorder, delete and add; each change is saved at once. */
export function SocialLinksCard()
{
  const { t } = useLanguage(), list = useAdminList(loadLinks), actions = useListActions(list, admin.socialLinks);
  return (
    <section className="flex flex-col gap-4"><h2 className={CARD_TITLE}>{t('Social Links', 'Sosyal Linkler')}</h2><ErrorNotice error={list.error} />
      <SocialLinkList links={list.items} actions={actions} /><NewSocialLinkForm onAdd={(link) => actions.add(() => admin.socialLinks.save(link))} />
    </section>
  );
}
