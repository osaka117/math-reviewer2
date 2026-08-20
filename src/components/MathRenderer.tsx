import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = '', block = false }) => {
  const renderedContent = useMemo(() => {
    if (!text) return '';

    // If text starts and ends with $$ or is purely a formula
    if (text.startsWith('$$') && text.endsWith('$$')) {
      const math = text.slice(2, -2);
      try {
        return katex.renderToString(math, { displayMode: true, throwOnError: false });
      } catch {
        return text;
      }
    }

    // Process inline $...$ or $$...$$ expressions inside regular text
    try {
      let processed = text;

      // Replace block math $$...$$
      processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
          return `<div class="my-2">${katex.renderToString(math, { displayMode: true, throwOnError: false })}</div>`;
        } catch {
          return `$$${math}$$`;
        }
      });

      // Replace inline math $...$
      processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
        try {
          return katex.renderToString(math, { displayMode: false, throwOnError: false });
        } catch {
          return `$${math}$`;
        }
      });

      return processed;
    } catch {
      return text;
    }
  }, [text]);

  if (block) {
    return (
      <div
        className={`katex-wrapper leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    );
  }

  return (
    <span
      className={`katex-wrapper inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};
