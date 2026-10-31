// Shared Tailwind class strings for /restoran's building blocks: large type, plenty of room, one warm accent.

export const WRAP = 'max-w-5xl mx-auto px-4 sm:px-6';
export const H2 = 'text-3xl sm:text-4xl font-bold tracking-tight text-balance';
export const LEAD = 'mt-4 text-lg sm:text-xl text-muted max-w-2xl';
export const CARD = 'rounded-2xl bg-paper border border-line p-6';
export const LINK = 'text-accent font-semibold underline underline-offset-4 decoration-2 hover:text-accent-dark';

const BUTTON = 'inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-full font-semibold text-lg text-center motion-safe:transition-colors';

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  secondary: 'bg-paper text-ink border-2 border-ink/15 hover:border-accent hover:text-accent',
};

/** A call-to-action button: 'primary' (filled accent) or 'secondary' (outlined). */
export function buttonClass(variant, extra = '')
{
  return `${BUTTON} ${BUTTON_VARIANTS[variant]} ${extra}`.trim();
}
