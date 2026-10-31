/** The 0–100 % slider for the share of orders that could move to the restaurant's own channel; its value is shown beside the label. */
export function ShareSlider({ field, value, onChange })
{
  return (
    <div className="sm:col-span-2"><label htmlFor="share" className="flex justify-between gap-4 font-semibold"><span>{field.label}</span><output htmlFor="share" className="text-accent font-bold">%{value}</output></label>
      <input id="share" type="range" min="0" max="100" step="5" value={value} onChange={(event) => onChange('share', event.target.value)} className="mt-3 w-full h-11 accent-accent cursor-pointer" /></div>
  );
}
