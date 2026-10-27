// [label](url) | **bold** | *italic* — each capture group marks which one matched.
const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/;
const PARTS_PER_MATCH = 5; // the text before a match, then its four capture groups
const PARAGRAPH_BREAK = /\n\s*\n/;
const EXTERNAL = /^https?:\/\//;

/**
 * Parses the CMS's light markup: a blank line splits paragraphs; inside them [label](url) is a link, **text** bold and *text* italic.
 * Paragraphs are lists of tokens: { kind: 'text' | 'bold' | 'italic', text } or { kind: 'link', text, url, external }.
 */
export class InlineMarkup
{
  static paragraphs(text)
  {
    return String(text ?? '').split(PARAGRAPH_BREAK).filter((paragraph) => paragraph.trim()).map((paragraph) => InlineMarkup.tokens(paragraph));
  }

  static tokens(paragraph)
  {
    const parts = paragraph.split(TOKEN);
    const tokens = [];
    for (let index = 0; index < parts.length; index += PARTS_PER_MATCH) tokens.push(...InlineMarkup.#tokensOf(parts.slice(index, index + PARTS_PER_MATCH)));
    return tokens;
  }

  static #tokensOf([text, label, url, bold, italic])
  {
    const tokens = text ? [{ kind: 'text', text }] : [];
    if (label !== undefined) tokens.push({ kind: 'link', text: label, url, external: EXTERNAL.test(url) });
    if (bold !== undefined) tokens.push({ kind: 'bold', text: bold });
    if (italic !== undefined) tokens.push({ kind: 'italic', text: italic });
    return tokens;
  }
}
