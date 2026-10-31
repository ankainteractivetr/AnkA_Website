import { CALCULATOR } from '../../../content/restoran.tr';
import { formatLira } from '../../../domain/commission';

function Result({ label, amount, strong = false })
{
  return <div className={`rounded-xl p-4 ${strong ? 'bg-accent text-white' : 'bg-cream'}`}><dt className={strong ? 'text-white/90' : 'text-muted'}>{label}</dt><dd className="mt-1 text-2xl sm:text-3xl font-extrabold tabular-nums">{formatLira(amount)}</dd></div>;
}

/** The three results ("—" until every field is valid), read out to screen readers as they change, and the estimate's caveats. */
export function CalculatorResults({ estimate })
{
  const { results, disclaimer } = CALCULATOR;
  return (
    <div aria-live="polite"><dl className="grid gap-3"><Result label={results.monthly} amount={estimate?.monthly} /><Result label={results.yearly} amount={estimate?.yearly} /><Result label={results.savings} amount={estimate?.savings} strong /></dl>
      <p className="mt-4 text-sm text-muted">{disclaimer}</p></div>
  );
}
