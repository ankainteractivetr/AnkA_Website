// CMS classes, built from the site's tokens; form controls reuse the site's input style.
import { PANEL } from '../../ui/styles';

export { INPUT } from '../../ui/styles';
export const LABEL = 'block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2';
export const HINT = 'block text-[11px] text-ash/50 mt-1.5';
export const CARD = `${PANEL} p-6 md:p-8 flex flex-col gap-6`;
export const TILE = `${PANEL} overflow-hidden`;
export const CARD_TITLE = 'font-display text-xl tracking-[0.2em] uppercase text-parchment';
export const MUTED = 'text-ash/60';
export const ICON_BUTTON = 'p-1.5 text-ash/70 hover:text-phoenix disabled:opacity-30 disabled:cursor-not-allowed';

const CHIP = 'inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm border transition-all disabled:opacity-50';
const CHIP_VARIANTS = Object.freeze({
  neutral: 'border-white/20 text-ash hover:border-phoenix hover:text-phoenix',
  accent: 'border-phoenix/40 text-phoenix hover:bg-phoenix/10',
  danger: 'border-ember/30 text-ember hover:bg-ember/10',
  muted: 'border-white/20 text-ash/70 hover:bg-white/5',
});

/** A small uppercase action button or link (Edit, Delete, Publish …). */
export function chipClass(variant, extra = '')
{
  return `${CHIP} ${CHIP_VARIANTS[variant]} ${extra}`.trim();
}

const BADGE = 'text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 rounded border';
const BADGE_VARIANTS = Object.freeze({
  ember: 'bg-ember/15 text-ember border-ember/30',
  phoenix: 'bg-phoenix/15 text-phoenix border-phoenix/30',
  muted: 'bg-white/5 text-ash/60 border-white/10',
});

/** A small uppercase label of a list row (a project's type, "Draft" …). */
export function badgeClass(variant)
{
  return `${BADGE} ${BADGE_VARIANTS[variant]}`;
}
