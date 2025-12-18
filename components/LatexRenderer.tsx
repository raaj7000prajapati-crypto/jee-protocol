
import React from 'react';
import katex from 'katex';

interface LatexRendererProps {
  text: string;
  className?: string;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ text, className = "" }) => {
  // Enhanced regex to capture $$, $, \[, and \( delimiters
  // Using s flag (dotAll) or [\s\S] to match newlines in block math
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$.*?\$|\\\(.*?\\\))/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Block math: $$...$$ or \[...\]
        if ((part.startsWith('$$') && part.endsWith('$$')) || (part.startsWith('\\[') && part.endsWith('\\]'))) {
          const formula = part.startsWith('$$') ? part.slice(2, -2) : part.slice(2, -2);
          try {
            const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
            return <div key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-4 overflow-x-auto custom-scrollbar" />;
          } catch (e) {
            return <span key={index}>{part}</span>;
          }
        } 
        // Inline math: $...$ or \(...\)
        else if ((part.startsWith('$') && part.endsWith('$')) || (part.startsWith('\\(') && part.endsWith('\\)'))) {
          const formula = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
          try {
            const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="inline-block mx-0.5" />;
          } catch (e) {
            return <span key={index}>{part}</span>;
          }
        }
        
        // Plain text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default LatexRenderer;
