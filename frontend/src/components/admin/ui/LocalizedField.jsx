import { TextField } from './TextField';

const EMPTY_TEXT = Object.freeze({ en: '', tr: '' });

/** The English and Turkish versions of one text side by side; value and onChange use { en, tr }. */
export function LocalizedField({ label, value, onChange, ...options })
{
  const text = value ?? EMPTY_TEXT;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <TextField label={`${label} — EN`} value={text.en} onChange={(en) => onChange({ ...text, en })} {...options} /><TextField label={`${label} — TR`} value={text.tr} onChange={(tr) => onChange({ ...text, tr })} {...options} />
    </div>
  );
}
