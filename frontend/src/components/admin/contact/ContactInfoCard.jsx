import { useEditor } from '../../../hooks/admin/useEditor';
import { useLanguage } from '../../../i18n/useLanguage';
import { admin } from '../../../services';
import { EditorGate } from '../ui/EditorGate';
import { LocalizedField } from '../ui/LocalizedField';
import { SaveBar } from '../ui/SaveBar';
import { CARD, CARD_TITLE } from '../ui/styles';
import { TextField } from '../ui/TextField';

const loadInfo = () => admin.contactInfo.load();
const saveInfo = ({ intro, outro, email, mapEmbedUrl }) => admin.contactInfo.save({ intro, outro, email: email ?? '', mapEmbedUrl: mapEmbedUrl ?? '' });

function ContactInfoFields({ editor, info })
{
  const { t } = useLanguage(), set = (field) => (value) => editor.change({ ...info, [field]: value });
  return (
    <>
      <LocalizedField label={t('Intro', 'Giriş')} value={info.intro} onChange={set('intro')} multiline rows={3} /><LocalizedField label={t('Outro', 'Kapanış')} value={info.outro} onChange={set('outro')} multiline rows={3} />
      <div className="grid md:grid-cols-2 gap-4"><TextField label={t('Public Email', 'Açık E-posta')} type="email" value={info.email} onChange={set('email')} placeholder="contact@ankainteractive.com" /><TextField label="Google Map Embed URL" mono value={info.mapEmbedUrl} onChange={set('mapEmbedUrl')} placeholder="https://www.google.com/maps/embed?pb=..." /></div>
    </>
  );
}

/** The contact section's texts, public e-mail and map. */
export function ContactInfoCard()
{
  const { t } = useLanguage(), editor = useEditor(loadInfo, saveInfo);
  return (
    <section className={CARD}><h2 className={CARD_TITLE}>{t('Contact Section Texts', 'İletişim Bölümü Metinleri')}</h2>
      <EditorGate editor={editor}>{(info) => <><ContactInfoFields editor={editor} info={info} /><SaveBar editor={editor} label={t('Save Contact Info', 'İletişim Bilgisini Kaydet')} /></>}</EditorGate>
    </section>
  );
}
