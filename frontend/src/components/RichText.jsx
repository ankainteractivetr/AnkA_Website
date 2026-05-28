// ============================================================================
//  Tiny renderer for the CMS body fields. Supports:
//    [text](url)   → <a>
//    **text**      → <strong>
//    *text*        → <em>
//    Blank lines split paragraphs.
// ============================================================================
import React from 'react';

function renderInline(text) {
    // Process [text](url) links, **bold**, *italic*
    const nodes = [];
    let cursor = 0;
    const regex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
    let m;
    let key = 0;
    while ((m = regex.exec(text)) !== null) {
        if (m.index > cursor) nodes.push(text.slice(cursor, m.index));
        if (m[1]) {
            const linkText = m[2];
            const url = m[3];
            const external = /^https?:\/\//.test(url);
            nodes.push(
                <a key={`l-${key++}`} href={url} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
                    {linkText}
                </a>
            );
        } else if (m[4]) {
            nodes.push(<strong key={`b-${key++}`}>{m[5]}</strong>);
        } else if (m[6]) {
            nodes.push(<em key={`i-${key++}`}>{m[7]}</em>);
        }
        cursor = m.index + m[0].length;
    }
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
}

export default function RichText({ text, className = '' }) {
    if (!text) return null;
    const paragraphs = String(text).split(/\n\s*\n/);
    return (
        <div className={`prose-anka space-y-4 ${className}`}>
            {paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed text-parchment/90">
                    {renderInline(p)}
                </p>
            ))}
        </div>
    );
}
