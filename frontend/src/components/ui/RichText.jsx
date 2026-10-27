import { InlineMarkup } from '../../domain/InlineMarkup';
import { LINK } from './styles';

const EXTERNAL = Object.freeze({ target: '_blank', rel: 'noopener noreferrer' });

// One renderer per InlineMarkup token kind.
const RENDERERS = Object.freeze({
  text: (token) => token.text,
  bold: (token, key) => <strong key={key}>{token.text}</strong>,
  italic: (token, key) => <em key={key}>{token.text}</em>,
  link: (token, key) => <a key={key} className={LINK} href={token.url} {...(token.external ? EXTERNAL : {})}>{token.text}</a>,
});

/** Renders the CMS's light markup (paragraphs, [links](url), **bold**, *italic*) as React elements, never as raw HTML. */
export function RichText({ text, className = '' })
{
  const paragraphs = InlineMarkup.paragraphs(text);
  if (paragraphs.length === 0) return null;
  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((tokens, index) => <p key={index} className="leading-relaxed text-parchment/90 text-justify">{tokens.map((token, position) => RENDERERS[token.kind](token, position))}</p>)}
    </div>
  );
}
