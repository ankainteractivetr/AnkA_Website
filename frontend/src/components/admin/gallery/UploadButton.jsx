import { useId } from 'react';
import { useLanguage } from '../../../i18n/useLanguage';
import { buttonClass } from '../../ui/styles';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

/** Hands the picked file to onFile, then clears the picker so the same file can be picked again. */
function pickFile(event, onFile)
{
  const [file] = event.target.files;
  if (file) onFile(file);
  event.target.value = '';
}

export function UploadButton({ busy, onFile })
{
  const { t } = useLanguage(), id = useId();
  return (
    <><label htmlFor={id} className={buttonClass('ghost', 'cursor-pointer')}>{busy ? t('Working…', 'İşleniyor…') : `＋ ${t('Upload Image', 'Görsel Yükle')}`}</label><input id={id} type="file" accept={ACCEPT} className="sr-only" disabled={busy} onChange={(event) => pickFile(event, onFile)} /></>
  );
}
