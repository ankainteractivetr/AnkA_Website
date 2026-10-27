import { useLanguage } from '../../../i18n/useLanguage';
import { WORK_KINDS } from '../../home/services/workKinds';
import { CheckboxField } from '../ui/CheckboxField';
import { SaveBar } from '../ui/SaveBar';
import { SelectField } from '../ui/SelectField';
import { CARD } from '../ui/styles';
import { TextField } from '../ui/TextField';

function KindAndTitle({ form, set })
{
  const { t, pick } = useLanguage(), kinds = Object.entries(WORK_KINDS).map(([value, kind]) => ({ value, label: pick(kind.label) }));
  return <div className="grid md:grid-cols-3 gap-4"><SelectField label={t('Kind', 'Tür')} value={form.kind} options={kinds} onChange={set('kind')} /><TextField className="md:col-span-2" label={t('Title', 'Başlık')} required value={form.title} onChange={set('title')} placeholder="De Pizzazz" /></div>;
}

/** The address the frame shows; its placeholder and hint follow the chosen kind. */
function AddressField({ form, set })
{
  const { t, pick } = useLanguage(), kind = WORK_KINDS[form.kind];
  return <TextField label={t('Address', 'Adres')} required mono value={form.url} onChange={set('url')} placeholder={kind.urlPlaceholder} hint={pick(kind.urlHint)} />;
}

/** Every field of a client work, with its save button. */
export function ClientWorkFields({ editor, form })
{
  const { t } = useLanguage(), set = (field) => (value) => editor.change({ ...form, [field]: value });
  const published = <CheckboxField label={t('Published (visible on site)', 'Yayında (sitede görünür)')} checked={form.isPublished} onChange={set('isPublished')} />;
  return (
    <div className={CARD}>
      <KindAndTitle form={form} set={set} /><AddressField form={form} set={set} /><SaveBar editor={editor} label={form.id ? t('Save Changes', 'Değişiklikleri Kaydet') : t('Create Work', 'İş Oluştur')}>{published}</SaveBar>
    </div>
  );
}
