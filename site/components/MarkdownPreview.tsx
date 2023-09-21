'use client';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import mdLang from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import nightOwl from 'react-syntax-highlighter/dist/esm/styles/hljs/night-owl';
import { ClipboardButton } from '@/components/ClipboardButton';

type Props = {
  markdown: string;
};

SyntaxHighlighter.registerLanguage('markdown', mdLang);

export const MarkdownPreview = ({ markdown }: Props) => {
  if (!markdown) return null;

  return (
    <div className="relative">
      <SyntaxHighlighter
        language="markdown"
        style={nightOwl}
        customStyle={{ paddingTop: '3em' }}
        wrapLongLines
      >
        {markdown}
      </SyntaxHighlighter>
      <ClipboardButton textToCopy={markdown} />
    </div>
  );
};
