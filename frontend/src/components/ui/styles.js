// Shared Tailwind class strings for the site's reusable building blocks (panel, buttons, inputs, gradients …).

export const WRAP = 'max-w-6xl mx-auto px-6 sm:px-8';
export const WRAP_WIDE = 'max-w-7xl mx-auto px-4 sm:px-8';
export const LAYER = 'relative z-[2]';

export const TEXT_GRADIENT_PHOENIX = 'bg-[linear-gradient(135deg,#ffd66b_0%,#f5a524_50%,#c02d00_100%)] bg-clip-text text-transparent';
export const TEXT_GRADIENT_EMBER = 'bg-[linear-gradient(135deg,#ff7a3d_0%,#c02d00_60%,#751a00_100%)] bg-clip-text text-transparent';

/** The dark glass card with an ember-to-phoenix gradient hairline around it. */
export const PANEL = 'relative rounded-md border border-parchment/6 backdrop-blur-sm bg-[linear-gradient(180deg,rgb(26_23_34/0.85)_0%,rgb(12_10_16/0.85)_100%)] '
  + 'before:absolute before:inset-0 before:rounded-md before:p-px before:pointer-events-none '
  + 'before:bg-[linear-gradient(135deg,rgb(192_45_0/0.4),transparent_30%,transparent_70%,rgb(245_165_36/0.3))] '
  + 'before:[mask:linear-gradient(#fff_0_0)_content-box_exclude,linear-gradient(#fff_0_0)]';

export const INPUT = 'w-full px-4 py-3 bg-ink-700/70 border border-ink-400 rounded-xs text-parchment font-sans transition-all duration-200 '
  + 'placeholder:text-parchment/35 focus:outline-hidden focus:border-ember focus:shadow-[0_0_0_3px_rgb(192_45_0/0.15)]';

export const LINK = 'text-phoenix no-underline border-b border-dashed border-phoenix/50 transition-all duration-200 hover:text-phoenix-light hover:border-phoenix-light';

const BUTTON = 'relative overflow-hidden inline-flex items-center justify-center gap-2 font-heading text-base tracking-widest uppercase px-7 py-3 rounded-xs '
  + 'transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

const BUTTON_VARIANTS = {
  primary: 'text-white border border-phoenix/30 bg-[linear-gradient(135deg,#c02d00_0%,#751a00_100%)] shadow-[0_4px_20px_-4px_rgb(192_45_0/0.4)] '
    + 'hover:-translate-y-px hover:border-phoenix/60 hover:shadow-[0_8px_30px_-4px_rgb(192_45_0/0.7)] '
    + 'after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_0%,rgb(255_214_107/0.25)_50%,transparent_100%)] '
    + 'after:bg-size-[200%_100%] after:bg-position-[-200%_0] after:transition-[background-position] after:duration-500 hover:after:bg-position-[200%_0]',
  ghost: 'bg-transparent text-parchment border border-parchment/20 hover:border-phoenix hover:text-phoenix hover:bg-phoenix/5',
};

/** The site's call-to-action button: 'primary' (ember, with a shimmer on hover) or 'ghost' (outlined). */
export function buttonClass(variant, extra = '')
{
  return `${BUTTON} ${BUTTON_VARIANTS[variant]} ${extra}`.trim();
}
