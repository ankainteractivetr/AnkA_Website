import { useLanguage } from '../../../i18n/useLanguage';
import { PANEL } from '../../ui/styles';
import { RowControls } from '../ui/RowControls';
import { chipClass, INPUT } from '../ui/styles';
import { IconSelect } from './IconSelect';

/** Platform and address save when the field is left (only if changed), the icon as soon as it is picked. */
function SocialLinkInputs({ link, update })
{
  const { t } = useLanguage(), saveOnBlur = (field) => (event) => event.target.value !== link[field] && update({ [field]: event.target.value });
  return (
    <>
      <input defaultValue={link.platform} onBlur={saveOnBlur('platform')} className={`${INPUT} md:col-span-2 text-sm py-2`} placeholder="LinkedIn" aria-label={t('Platform', 'Platform')} /><input defaultValue={link.url} onBlur={saveOnBlur('url')} className={`${INPUT} md:col-span-5 text-sm py-2 font-mono`} placeholder="https://..." aria-label="URL" />
      <IconSelect className="md:col-span-2" value={link.iconName} onChange={(event) => update({ iconName: event.target.value })} />
    </>
  );
}

/** One social link of the CMS list; every change is saved at once. */
export function SocialLinkRow({ link, index, links, actions })
{
  const { t } = useLanguage(), update = (patch) => actions.save({ ...link, ...patch });
  const remove = () => window.confirm(t('Delete this link?', 'Bu link silinsin mi?')) && actions.remove(link);
  return (
    <div className={`${PANEL} p-4 grid md:grid-cols-12 gap-3 items-center`}><SocialLinkInputs link={link} update={update} />
      <div className="md:col-span-3 flex items-center justify-end gap-2"><button type="button" onClick={() => update({ isActive: !link.isActive })} className={chipClass(link.isActive ? 'accent' : 'muted')} title={link.isActive ? t('Active', 'Aktif') : t('Hidden', 'Gizli')}>{link.isActive ? t('On', 'Açık') : t('Off', 'Kapalı')}</button><RowControls index={index} count={links.length} onMove={(position, delta) => actions.move(links, position, delta)} onRemove={remove} /></div>
    </div>
  );
}
