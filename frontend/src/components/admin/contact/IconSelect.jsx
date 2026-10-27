import { useLanguage } from '../../../i18n/useLanguage';
import { SOCIAL_ICON_NAMES } from '../../ui/socialIconNames';
import { INPUT } from '../ui/styles';

/** Picks a social link's icon; `allowEmpty` adds "—" (the icon then follows the platform's name). */
export function IconSelect({ allowEmpty = false, className = '', ...select })
{
  const { t } = useLanguage();
  return (
    <select className={`${INPUT} text-sm py-2 ${className}`} aria-label={t('Icon', 'İkon')} {...select}>
      {allowEmpty && <option value="">—</option>}{SOCIAL_ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
    </select>
  );
}
