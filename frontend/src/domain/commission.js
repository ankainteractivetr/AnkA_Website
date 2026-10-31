// The /restoran commission calculator's arithmetic: plain numbers in, plain numbers out. Runs in the browser only; nothing is sent or stored.

/** What a month of platform orders costs in commission: orders × average basket × rate (%). */
export function monthlyCommission(orders, basket, rate)
{
  return orders * basket * rate / 100;
}

export function yearlyCommission(monthly)
{
  return monthly * 12;
}

/** The part of a year's commission kept by moving `share` (%) of those orders to the restaurant's own channel. */
export function yearlySavings(yearly, share)
{
  return yearly * share / 100;
}

/** A form field's value as a number from 0 to `max`, or null when it is empty, not a number, negative or above `max`. */
export function toAmount(value, max = Infinity)
{
  const amount = String(value).trim() === '' ? NaN : Number(value);
  return Number.isFinite(amount) && amount >= 0 && amount <= max ? amount : null;
}

/** The three results from raw field values ({ orders, basket, rate, share }), or null while any of them is missing or invalid. */
export function estimateCommission(fields)
{
  const [orders, basket, rate, share] = [toAmount(fields.orders), toAmount(fields.basket), toAmount(fields.rate, 100), toAmount(fields.share, 100)];
  if ([orders, basket, rate, share].includes(null)) return null;
  const monthly = monthlyCommission(orders, basket, rate), yearly = yearlyCommission(monthly);
  return { monthly, yearly, savings: yearlySavings(yearly, share) };
}

// Both fraction digits given: older mobile browsers throw a RangeError when only one of them is.
const LIRA = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 });

/** Whole Turkish lira (₺24.000), or "—" when there is no amount. */
export function formatLira(amount)
{
  return amount == null ? '—' : LIRA.format(amount);
}
