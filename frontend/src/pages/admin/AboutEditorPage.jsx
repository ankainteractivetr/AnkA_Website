import { GalleryManager } from '../../components/admin/gallery/GalleryManager';
import { AdminPage } from '../../components/admin/ui/AdminPage';
import { EditorGate } from '../../components/admin/ui/EditorGate';
import { LocalizedField } from '../../components/admin/ui/LocalizedField';
import { MARKUP_HINT } from '../../components/admin/ui/markupHint';
import { SaveBar } from '../../components/admin/ui/SaveBar';
import { CARD } from '../../components/admin/ui/styles';
import { TextField } from '../../components/admin/ui/TextField';
import { useEditor } from '../../hooks/admin/useEditor';
import { useLanguage } from '../../i18n/useLanguage';
import { admin } from '../../services';

const loadAbout = () => admin.about.load();
const saveAbout = ({ title, body }) => admin.about.save({ title, body });

function AboutFields({ editor, about })
{
  const { t } = useLanguage(), set = (field) => (value) => editor.change({ ...about, [field]: value });
  return (
    <div className={CARD}>
      <TextField label={t('Section Title', 'Bölüm Başlığı')} value={about.title} onChange={set('title')} placeholder="AnkA Interactive" />
      <LocalizedField label={t('Body', 'Metin')} value={about.body} onChange={set('body')} multiline rows={14} mono /><SaveBar editor={editor} />
    </div>
  );
}

export function AboutEditorPage()
{
  const { t, pick } = useLanguage(), editor = useEditor(loadAbout, saveAbout);
  return (
    <AdminPage eyebrow={t('Edit', 'Düzenle')} title={t('About Section', 'Hakkında Bölümü')} description={pick(MARKUP_HINT)}>
      <EditorGate editor={editor}>{(about) => <AboutFields editor={editor} about={about} />}</EditorGate><GalleryManager gallery={admin.aboutImages} title={t('Gallery Images', 'Galeri Görselleri')} />
    </AdminPage>
  );
}
