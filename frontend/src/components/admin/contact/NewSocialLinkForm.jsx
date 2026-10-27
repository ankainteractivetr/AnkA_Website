import { useState } from 'react';
import { useLanguage } from '../../../i18n/useLanguage';
import { buttonClass, PANEL } from '../../ui/styles';
import { Notice } from '../ui/Notice';
import { INPUT, LABEL } from '../ui/styles';
import { IconSelect } from './IconSelect';

function readLink(form)
{
  const data = new FormData(form), text = (name) => String(data.get(name) ?? '').trim();
  return { platform: text('platform'), url: text('url'), iconName: text('iconName'), isActive: true };
}

/** Adds the link (platform and URL are required); the form empties once it is saved. */
async function submitLink(event, onAdd, setMissing)
{
  event.preventDefault();
  const form = event.currentTarget, link = readLink(form);
  setMissing(!link.platform || !link.url);
  if (link.platform && link.url && (await onAdd(link))) form.reset();
}

function NewLinkInputs()
{
  const { t } = useLanguage();
  return (
    <div className="grid md:grid-cols-12 gap-3 items-end"><label className="md:col-span-3"><span className={LABEL}>{t('Platform', 'Platform')}</span><input name="platform" className={`${INPUT} text-sm py-2`} placeholder="LinkedIn" /></label><label className="md:col-span-5"><span className={LABEL}>URL</span><input name="url" className={`${INPUT} text-sm py-2 font-mono`} placeholder="https://..." /></label>
      <label className="md:col-span-2"><span className={LABEL}>{t('Icon', 'İkon')}</span><IconSelect name="iconName" allowEmpty defaultValue="" /></label><button type="submit" className={buttonClass('primary', 'md:col-span-2 text-sm py-2.5')}>＋ {t('Add', 'Ekle')}</button>
    </div>
  );
}

export function NewSocialLinkForm({ onAdd })
{
  const { t } = useLanguage(), [missing, setMissing] = useState(false);
  return (
    <form onSubmit={(event) => submitLink(event, onAdd, setMissing)} className={`${PANEL} p-4 flex flex-col gap-3`}><div className="text-xs tracking-[0.2em] uppercase text-ash/70">{t('Add New Link', 'Yeni Link Ekle')}</div>
      <NewLinkInputs />{missing && <Notice kind="error">{t('Platform and URL are required.', 'Platform ve URL gerekli.')}</Notice>}
    </form>
  );
}
