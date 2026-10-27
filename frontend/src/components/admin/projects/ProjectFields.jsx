import { Slug } from '../../../domain/Slug';
import { useLanguage } from '../../../i18n/useLanguage';
import { CheckboxField } from '../ui/CheckboxField';
import { LocalizedField } from '../ui/LocalizedField';
import { SaveBar } from '../ui/SaveBar';
import { SelectField } from '../ui/SelectField';
import { CARD } from '../ui/styles';
import { TextField } from '../ui/TextField';

function IdentityFields({ form, set, onTitleBlur })
{
  const { t } = useLanguage(), types = [{ value: 'game', label: t('Game', 'Oyun') }, { value: 'software', label: t('Software', 'Yazılım') }];
  return (
    <>
      <div className="grid md:grid-cols-3 gap-4"><SelectField label={t('Type', 'Tür')} value={form.type} options={types} onChange={set('type')} /><TextField className="md:col-span-2" label={t('Title', 'Başlık')} required value={form.title} onChange={set('title')} onBlur={onTitleBlur} /></div>
      <div className="grid md:grid-cols-2 gap-4"><TextField label={t('Slug', 'URL Kısaltma')} value={form.slug} onChange={set('slug')} mono placeholder="shahmaran" /><TextField label={t('Display Order', 'Görüntü Sırası')} type="number" min="0" value={form.displayOrder} onChange={set('displayOrder')} /></div>
    </>
  );
}

function TextFields({ form, set })
{
  const { t } = useLanguage();
  return (
    <>
      <LocalizedField label={t('Tagline', 'Slogan')} value={form.tagline} onChange={set('tagline')} /><LocalizedField label={t('Status', 'Durum')} value={form.status} onChange={set('status')} placeholder={t('In Development', 'Geliştirme Aşamasında')} />
      <LocalizedField label={t('Description', 'Açıklama')} value={form.description} onChange={set('description')} multiline rows={8} mono /><LocalizedField label={t('Features', 'Özellikler')} value={form.features} onChange={set('features')} multiline rows={4} mono />
    </>
  );
}

const LINK_FIELDS = Object.freeze([
  { key: 'steamWidget', label: { en: 'Steam Widget URL', tr: 'Steam Widget URL' }, placeholder: 'https://store.steampowered.com/widget/3061480/' },
  { key: 'trailer', label: { en: 'Trailer URL', tr: 'Fragman URL' }, placeholder: 'https://youtu.be/...' },
  { key: 'download', label: { en: 'Download URL', tr: 'İndirme URL' }, placeholder: '/ayzit-1_0_0.exe' },
  { key: 'microsoftStore', label: { en: 'Microsoft Store URL', tr: 'Microsoft Store URL' }, placeholder: 'https://apps.microsoft.com/detail/...', hint: { en: 'Shown as a Microsoft Store badge (great for software).', tr: 'Microsoft Store rozeti olarak gösterilir (programlar için ideal).' } },
  { key: 'sourceforgeName', label: { en: 'SourceForge Project Name', tr: 'SourceForge Proje Adı' }, placeholder: 'ayzit', hint: { en: 'Badge opens https://sourceforge.net/p/<name>/ in a new tab.', tr: 'Rozet, https://sourceforge.net/p/<ad>/ adresini yeni sekmede açar.' } },
  { key: 'sourceforgeGroupId', label: { en: 'SourceForge Group ID', tr: 'SourceForge Grup ID' }, placeholder: '4115303', hint: { en: 'Numeric id of the sflogo badge image. Both SourceForge fields are needed for the badge.', tr: 'Sflogo rozet görselinin sayısal id\'si. Rozet için iki SourceForge alanı da gereklidir.' } },
]);

function LinkFields({ links, onChange })
{
  const { pick } = useLanguage();
  return <div className="grid md:grid-cols-3 gap-4">{LINK_FIELDS.map(({ key, label, hint, placeholder }) => <TextField key={key} label={pick(label)} hint={hint && pick(hint)} placeholder={placeholder} value={links[key]} onChange={(value) => onChange({ ...links, [key]: value })} />)}</div>;
}

function ProjectSaveBar({ editor, form, set })
{
  const { t } = useLanguage();
  return <SaveBar editor={editor} label={form.id ? t('Save Changes', 'Değişiklikleri Kaydet') : t('Create Project', 'Proje Oluştur')}><CheckboxField label={t('Published (visible on site)', 'Yayında (sitede görünür)')} checked={form.isPublished} onChange={set('isPublished')} /></SaveBar>;
}

/** Every field of a project; leaving the title of a new project fills in its slug. */
export function ProjectFields({ editor, form })
{
  const set = (field) => (value) => editor.change({ ...form, [field]: value });
  const fillSlug = () => !form.id && !form.slug && form.title && editor.change({ ...form, slug: Slug.from(form.title) });
  return (
    <div className={CARD}>
      <IdentityFields form={form} set={set} onTitleBlur={fillSlug} /><TextFields form={form} set={set} /><LinkFields links={form.links} onChange={set('links')} /><ProjectSaveBar editor={editor} form={form} set={set} />
    </div>
  );
}
