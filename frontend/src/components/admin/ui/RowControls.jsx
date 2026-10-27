import { useLanguage } from '../../../i18n/useLanguage';
import { ICON_BUTTON } from './styles';

function RowButton({ label, symbol, className = '', ...rest })
{
  return <button type="button" className={`${ICON_BUTTON} ${className}`} title={label} aria-label={label} {...rest}>{symbol}</button>;
}

/** Move up / move down / delete buttons for one row of an ordered list. */
export function RowControls({ index, count, onMove, onRemove })
{
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-1">
      <RowButton label={t('Move up', 'Yukarı')} symbol="▲" disabled={index === 0} onClick={() => onMove(index, -1)} /><RowButton label={t('Move down', 'Aşağı')} symbol="▼" disabled={index === count - 1} onClick={() => onMove(index, 1)} />
      <RowButton label={t('Delete', 'Sil')} symbol="✕" className="hover:text-ember" onClick={onRemove} />
    </div>
  );
}
