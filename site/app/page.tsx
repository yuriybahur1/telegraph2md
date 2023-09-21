'use client';

import { Form } from '@/components/Form';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { useState } from 'react';

const Home = () => {
  const [markdown, setMarkdown] = useState('');

  return (
    <>
      <Form setMarkdown={setMarkdown} />
      <MarkdownPreview markdown={markdown} />
    </>
  );
};

export default Home;
