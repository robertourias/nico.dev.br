'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      showLineNumbers
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
        fontSize: '0.8125rem',
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
