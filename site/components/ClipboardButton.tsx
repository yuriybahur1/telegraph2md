'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type Props = {
  textToCopy: string;
};

export const ClipboardButton = ({ textToCopy }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);

      setCopied(true);

      const t = setTimeout(() => {
        setCopied(false);

        clearTimeout(t);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-2 right-2 p-2 z-10 text-white"
    >
      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
    </button>
  );
};
