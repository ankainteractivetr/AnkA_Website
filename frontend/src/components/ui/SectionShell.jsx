import { Separator } from './Separator';
import { TEXT_GRADIENT_PHOENIX, WRAP, WRAP_WIDE } from './styles';

// Class names are written out in full: Tailwind finds them by scanning the source, so they cannot be assembled at runtime.
const TITLE_ROW = 'relative flex justify-center mb-12 '
  + 'before:absolute before:top-1/2 before:left-0 before:w-1/4 before:h-px before:bg-[linear-gradient(90deg,transparent,rgb(245_165_36/0.5),transparent)] '
  + 'after:absolute after:top-1/2 after:right-0 after:w-1/4 after:h-px after:bg-[linear-gradient(90deg,transparent,rgb(245_165_36/0.5),transparent)]';
const TITLE = `font-deco font-black uppercase tracking-[0.15em] text-center text-3xl sm:text-4xl ${TEXT_GRADIENT_PHOENIX}`;

/**
 * A home page section: the separator above it, its centred title between two fading lines, then its content.
 * Each section owns its leading separator, so a section without content hides it too — never doubled, never orphaned.
 */
export function SectionShell({ id, title, wide = false, children })
{
  return (
    <>
      <Separator /><section id={id} className="relative scroll-mt-24"><div className={`${wide ? WRAP_WIDE : WRAP} py-16 sm:py-20`}>
        <div className={TITLE_ROW}><h2 className={TITLE}>{title}</h2></div>{children}
      </div></section>
    </>
  );
}
