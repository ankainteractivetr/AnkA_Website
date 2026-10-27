/** Checkbox with its label on the right; onChange receives the new boolean. */
export function CheckboxField({ label, checked, onChange })
{
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input type="checkbox" className="w-4 h-4 accent-ember" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} /><span className="text-sm text-ash">{label}</span>
    </label>
  );
}
