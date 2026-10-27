// 24×24 icons as path data: stroked ones are drawn with currentColor lines, filled ones with currentColor fill.
const STROKED = Object.freeze({
  close: 'M18 6 6 18M6 6l12 12',
  menu: 'M3 6h18M3 12h18M3 18h18',
  previous: 'M15 18 9 12 15 6',
  next: 'M9 18 15 12 9 6',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  external: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  globe: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20',
});
const FILLED = Object.freeze({ play: 'M5 3 19 12 5 21Z' });

export function Icon({ name, size = 24, strokeWidth = 2, className = '' })
{
  const filled = name in FILLED;
  const paint = filled ? { fill: 'currentColor', stroke: 'none' } : { fill: 'none', stroke: 'currentColor', strokeWidth };
  return <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" {...paint}><path d={FILLED[name] ?? STROKED[name]} /></svg>;
}
