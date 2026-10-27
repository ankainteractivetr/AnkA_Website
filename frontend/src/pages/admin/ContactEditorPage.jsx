import { ContactInfoCard } from '../../components/admin/contact/ContactInfoCard';
import { SocialLinksCard } from '../../components/admin/contact/SocialLinksCard';
import { AdminPage } from '../../components/admin/ui/AdminPage';
import { useLanguage } from '../../i18n/useLanguage';

export function ContactEditorPage()
{
  const { t } = useLanguage();
  return <AdminPage eyebrow={t('Edit', 'Düzenle')} title={t('Contact & Social', 'İletişim & Sosyal')}><ContactInfoCard /><SocialLinksCard /></AdminPage>;
}
