import {
  getApiUrl,
  getAssetName,
  getTelegraphUrl,
  getParagraphMd,
  fixWhiteSpaces,
  getLinkMd,
  getBoldMd,
  getBlockquoteMd,
  getCodeMd,
  getItalicMd,
  getH3Md,
  getH4Md,
  getHrMd,
  getListMd,
  getListItemMd,
  getBrMd,
  getUnderlinedMd,
  getStrikethroughMd,
  getPreMd,
  getFigureMd,
  getPathToAsset,
  getImgMd,
  getVideoMd,
  getIframeMd,
  getFigcaptionMd,
  getAsideMd,
  getNodeMd,
  Node,
  getContentMd,
  PageContent,
  getMarkdown,
  APIResponse,
} from './functions';

describe('getApiUrl', () => {
  it('return telegra.ph page API url', () => {
    expect(getApiUrl('https://telegra.ph/Test-page-06-16-8')).toBe(
      'https://api.telegra.ph/getPage/Test-page-06-16-8?return_content=true',
    );
  });

  it('fails when passed url is not valid', () => {
    const exp = 'Invalid URL';

    expect(() => getApiUrl('')).toThrow(exp);

    expect(() => getApiUrl('  ')).toThrow(exp);

    expect(() => getApiUrl('test')).toThrow(exp);

    expect(() => getApiUrl('https://')).toThrow(exp);
  });

  it('fails when passed url not contain telegra.ph hostname', () => {
    expect(() => getApiUrl('https://youtube.com')).toThrow(
      "url must contain 'telegra.ph' hostname",
    );
  });

  it('fails when passed url not contain pathname', () => {
    expect(() => getApiUrl('https://telegra.ph')).toThrow(
      'url must contain pathname',
    );
  });
});

describe('getAssetName', () => {
  it('get img name', () => {
    expect(getAssetName('/file/e0c4a951dd2642a3e1aea.jpg')).toBe(
      'e0c4a951dd2642a3e1aea.jpg',
    );
  });

  it('get video name', () => {
    expect(getAssetName('/file/42ee5dec2f950df9c5113.mp4')).toBe(
      '42ee5dec2f950df9c5113.mp4',
    );
  });
});

describe('getTelegraphUrl', () => {
  const data = [
    {
      desc: 'image',
      pathname: '/file/d0e78e2e420c8398e6e4a.jpg',
      exp: 'https://telegra.ph/file/d0e78e2e420c8398e6e4a.jpg',
    },
    {
      desc: 'video',
      pathname: '/file/b69e2e8ea65dcfaded70e.mp4',
      exp: 'https://telegra.ph/file/b69e2e8ea65dcfaded70e.mp4',
    },
    {
      desc: 'iframe',
      pathname:
        '/embed/youtube?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D09839DpTctU%26ab_channel%3DEagles',
      exp: 'https://telegra.ph/embed/youtube?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D09839DpTctU%26ab_channel%3DEagles',
    },
  ];

  it.each(data)('get telegra.ph url to $desc', ({ pathname, exp }) => {
    expect(getTelegraphUrl(pathname)).toBe(exp);
  });
});

describe('getParagraphMd', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'Text',
      exp: 'Text\n\n',
    },
    {
      desc: 'link',
      prevMd: '[Link](https://github.com/yuriybahur3)',
      exp: '[Link](https://github.com/yuriybahur3)\n\n',
    },
    {
      desc: 'bold text',
      prevMd: '**bold**',
      exp: '**bold**\n\n',
    },
    {
      desc: 'code text',
      prevMd: '`code`',
      exp: '`code`\n\n',
    },
    {
      desc: 'italic text',
      prevMd: '*italic*',
      exp: '*italic*\n\n',
    },
    {
      desc: 'br tag',
      prevMd: '<br>',
      exp: '<br>\n\n',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '<ins>underlined</ins>\n\n',
    },
    {
      desc: 'all supported elements',
      prevMd:
        'Plain text, [link](https://github.com/yuriybahur3), **bold**, `code`, *italic*, <ins>underlined</ins>',
      exp: 'Plain text, [link](https://github.com/yuriybahur3), **bold**, `code`, *italic*, <ins>underlined</ins>\n\n',
    },
  ];

  it.each(data)('return paragraph md with $desc', ({ prevMd, exp }) => {
    expect(getParagraphMd(prevMd)).toBe(exp);
  });
});

describe('fixWhiteSpaces', () => {
  const data = [
    {
      desc: 'plain text without spaces',
      args: {
        prevMd: 'plain text',
        cb: (v: string) => `${v}`,
      },
      exp: 'plain text',
    },
    {
      desc: 'plain text with left space',
      args: {
        prevMd: '  plain text',
        cb: (v: string) => `${v}`,
      },
      exp: '  plain text',
    },
    {
      desc: 'plain text with right space',
      args: {
        prevMd: 'plain text  ',
        cb: (v: string) => `${v}`,
      },
      exp: 'plain text  ',
    },
    {
      desc: 'plain text with spaces from both sides',
      args: {
        prevMd: ' plain text ',
        cb: (v: string) => `${v}`,
      },
      exp: ' plain text ',
    },
    {
      desc: 'bold text with spaces from both sides',
      args: {
        prevMd: ' bold ',
        cb: (v: string) => `**${v}**`,
      },
      exp: ' **bold** ',
    },
    {
      desc: 'code text with spaces from both sides',
      args: {
        prevMd: ' code ',
        cb: (v: string) => '`' + v + '`',
      },
      exp: ' `code` ',
    },
    {
      desc: 'figcaption text with spaces from both sides',
      args: {
        prevMd: ' figcaption ',
        cb: (v: string) => `\n\n${v}`,
      },
      exp: ' \n\nfigcaption ',
    },
    {
      desc: 'italic text with spaces from both sides',
      args: {
        prevMd: ' italic ',
        cb: (v: string) => `*${v}*`,
      },
      exp: ' *italic* ',
    },
    {
      desc: 'link with spaces from both sides',
      args: {
        prevMd: ' link ',
        cb: (v: string) => `[${v}](https://github.com/yuriybahur3)`,
      },
      exp: ' [link](https://github.com/yuriybahur3) ',
    },
    {
      desc: 'strikethrough text with spaces from both sides',
      args: {
        prevMd: ' strikethrough ',
        cb: (v: string) => `~~${v}~~`,
      },
      exp: ' ~~strikethrough~~ ',
    },
    {
      desc: 'underlined text with spaces from both sides',
      args: {
        prevMd: ' underlined ',
        cb: (v: string) => `<ins>${v}</ins>`,
      },
      exp: ' <ins>underlined</ins> ',
    },
  ];

  it.each(data)('for $desc', ({ args, exp }) => {
    expect(fixWhiteSpaces(args.prevMd, args.cb)).toBe(exp);
  });
});

describe('getLinkMd', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'link',
      exp: '[link](https://github.com/yuriybahur3)',
    },
    {
      desc: 'bold text',
      prevMd: '**bold**',
      exp: '[**bold**](https://github.com/yuriybahur3)',
    },
    {
      desc: 'code text',
      prevMd: '`code`',
      exp: '[`code`](https://github.com/yuriybahur3)',
    },
    {
      desc: 'italic text',
      prevMd: '*italic*',
      exp: '[*italic*](https://github.com/yuriybahur3)',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '[<ins>underlined</ins>](https://github.com/yuriybahur3)',
    },
    {
      desc: 'all supported elements in one line',
      prevMd: 'Plain, **bold**, `code`, *italic*, <ins>underlined</ins>',
      exp: '[Plain, **bold**, `code`, *italic*, <ins>underlined</ins>](https://github.com/yuriybahur3)',
    },
    {
      desc: 'all supported elements nested on each other',
      prevMd: '***<ins>`Link`</ins>***',
      exp: '[***<ins>`Link`</ins>***](https://github.com/yuriybahur3)',
    },
  ];

  it.each(data)('return link md with $desc', ({ prevMd, exp }) => {
    const res = getLinkMd(prevMd, {
      tag: 'a',
      attrs: { href: 'https://github.com/yuriybahur3' },
    });

    expect(res).toBe(exp);
  });

  it('return empty link md when no node.attrs.href', () => {
    expect(getLinkMd('Link', { tag: 'a' })).toBe('');
  });
});

describe('getBoldMd', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'bold',
      exp: '**bold**',
    },
    {
      desc: 'code text',
      prevMd: '`bold`',
      exp: '**`bold`**',
    },
    {
      desc: 'italic text',
      prevMd: '*bold*',
      exp: '***bold***',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>bold</ins>',
      exp: '**<ins>bold</ins>**',
    },
    {
      desc: 'all supported elements in one line',
      prevMd: 'plain, `code`, *italic*, <ins>underlined</ins>',
      exp: '**plain, `code`, *italic*, <ins>underlined</ins>**',
    },
    {
      desc: 'all supported elements nested on each other',
      prevMd: '*<ins>`bold`</ins>*',
      exp: '***<ins>`bold`</ins>***',
    },
  ];

  it.each(data)('return bold md with $desc', ({ prevMd, exp }) => {
    expect(getBoldMd(prevMd)).toBe(exp);
  });
});

describe('getBlockquoteMd', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'Blockquote',
      exp: '> Blockquote\n\n',
    },
    {
      desc: 'link',
      prevMd: '[Link](https://github.com/yuriybahur3)',
      exp: '> [Link](https://github.com/yuriybahur3)\n\n',
    },
    {
      desc: 'bold text',
      prevMd: '**bold**',
      exp: '> **bold**\n\n',
    },
    {
      desc: 'code text',
      prevMd: '`code`',
      exp: '> `code`\n\n',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '> <ins>underlined</ins>\n\n',
    },
    {
      desc: 'all supported elements',
      prevMd:
        'Plain, [link](https://github.com/yuriybahur3), **bold**, `code`, <ins>underlined</ins>',
      exp: '> Plain, [link](https://github.com/yuriybahur3), **bold**, `code`, <ins>underlined</ins>\n\n',
    },
  ];

  it.each(data)('return blockquote md with $desc', ({ prevMd, exp }) => {
    expect(getBlockquoteMd(prevMd)).toBe(exp);
  });
});

describe('getCodeMd', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'Code',
      exp: '`Code`',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '`<ins>underlined</ins>`',
    },
  ];

  it.each(data)('return code md with $desc', ({ prevMd, exp }) => {
    expect(getCodeMd(prevMd)).toBe(exp);
  });
});

describe('getItalicMd', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'Italic',
      exp: '*Italic*',
    },
    {
      desc: 'code text',
      prevMd: '`Code`',
      exp: '*`Code`*',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '*<ins>underlined</ins>*',
    },
    {
      desc: 'all supported elements in one row',
      prevMd: 'Plain italic, `code`, <ins>underlined</ins>',
      exp: '*Plain italic, `code`, <ins>underlined</ins>*',
    },
    {
      desc: 'all supported elements nested on each other',
      prevMd: '<ins>`Italic`</ins>',
      exp: '*<ins>`Italic`</ins>*',
    },
  ];

  it.each(data)('return italic md with $desc', ({ prevMd, exp }) => {
    expect(getItalicMd(prevMd)).toBe(exp);
  });
});

describe('getH3Md', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'Heading',
      exp: '### Heading\n\n',
    },
    {
      desc: 'link',
      prevMd: '[Link](https://github.com/yuriybahur3)',
      exp: '### [Link](https://github.com/yuriybahur3)\n\n',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '### <ins>underlined</ins>\n\n',
    },
    {
      desc: 'all supported elements in one row',
      prevMd:
        'Plain text, [link](https://github.com/yuriybahur3), <ins>underlined</ins>',
      exp: '### Plain text, [link](https://github.com/yuriybahur3), <ins>underlined</ins>\n\n',
    },
  ];

  it.each(data)('return h3 md with $desc', ({ prevMd, exp }) => {
    expect(getH3Md(prevMd)).toBe(exp);
  });
});

describe('getH4Md', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'Heading',
      exp: '#### Heading\n\n',
    },
    {
      desc: 'link',
      prevMd: '[Link](https://github.com/yuriybahur3)',
      exp: '#### [Link](https://github.com/yuriybahur3)\n\n',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '#### <ins>underlined</ins>\n\n',
    },
    {
      desc: 'all supported elements in one row',
      prevMd:
        'Plain text, [link](https://github.com/yuriybahur3), <ins>underlined</ins>',
      exp: '#### Plain text, [link](https://github.com/yuriybahur3), <ins>underlined</ins>\n\n',
    },
  ];

  it.each(data)('return h4 md with $desc', ({ prevMd, exp }) => {
    expect(getH4Md(prevMd)).toBe(exp);
  });
});

describe('getHrMd', () => {
  it('return hr md', () => {
    expect(getHrMd()).toBe('---\n\n');
  });
});

describe('getListMd', () => {
  it('return ul list md', () => {
    expect(getListMd('First\nSecond\nThird\n', 'ul')).toBe(
      '- First\n- Second\n- Third\n\n',
    );
  });

  it('return ol list md', () => {
    expect(getListMd('First\nSecond\nThird\n', 'ol')).toBe(
      '1. First\n2. Second\n3. Third\n\n',
    );
  });
});

describe('getListItemMd', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'Text',
      exp: 'Text\n',
    },
    {
      desc: 'link',
      prevMd: '[link](https://github.com/yuriybahur3)',
      exp: '[link](https://github.com/yuriybahur3)\n',
    },
    {
      desc: 'bold text',
      prevMd: '**bold**',
      exp: '**bold**\n',
    },
    {
      desc: 'code text',
      prevMd: '`code`',
      exp: '`code`\n',
    },
    {
      desc: 'italic text',
      prevMd: '*italic*',
      exp: '*italic*\n',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '<ins>underlined</ins>\n',
    },
    {
      desc: 'all supported elemenets in one row',
      prevMd:
        'plain text, [link](https://github.com/yuriybahur3), **bold**, `code`, *italic*, <ins>underlined</ins>',
      exp: 'plain text, [link](https://github.com/yuriybahur3), **bold**, `code`, *italic*, <ins>underlined</ins>\n',
    },
  ];

  it.each(data)('return li md with $desc', ({ prevMd, exp }) => {
    expect(getListItemMd(prevMd)).toBe(exp);
  });
});

describe('getBrMd', () => {
  it('return br md', () => {
    expect(getBrMd()).toBe('<br>');
  });
});

describe('getUnderlinedMd', () => {
  it('return underlined md', () => {
    expect(getUnderlinedMd('underlined')).toBe('<ins>underlined</ins>');
  });
});

describe('getStrikethroughMd', () => {
  it('return strikethrough md', () => {
    expect(getStrikethroughMd('text')).toBe('~~text~~');
  });
});

describe('getPreMd', () => {
  it('return pre md', () => {
    expect(getPreMd('pre')).toBe('```\npre```\n\n');
  });
});

describe('getFigureMd', () => {
  const data = [
    {
      desc: 'image',
      prevMd: '![img](https://telegra.ph/file/032fbc34649ecff8ec0f1.jpg)',
      exp: '![img](https://telegra.ph/file/032fbc34649ecff8ec0f1.jpg)\n\n',
    },
    {
      desc: 'image with figcaption',
      prevMd:
        '![img](https://telegra.ph/file/8942187e83f674caf07f9.jpg)\n\nFigcaption',
      exp: '![img](https://telegra.ph/file/8942187e83f674caf07f9.jpg)\n\nFigcaption\n\n',
    },
    {
      desc: 'video',
      prevMd: '[Video](https://telegra.ph/file/46d59a75008f833385dab.mp4)',
      exp: '[Video](https://telegra.ph/file/46d59a75008f833385dab.mp4)\n\n',
    },
    {
      desc: 'iframe',
      prevMd:
        '[Youtube video](https://www.youtube.com/watch?v=09839DpTctU&ab_channel=Eagles)',
      exp: '[Youtube video](https://www.youtube.com/watch?v=09839DpTctU&ab_channel=Eagles)\n\n',
    },
  ];

  it.each(data)('return figure md with $desc', ({ prevMd, exp }) => {
    expect(getFigureMd(prevMd)).toBe(exp);
  });
});

describe('getPathToAsset', () => {
  const data = [
    {
      desc: 'img telegra.ph absolute url',
      src: '/file/c46b8074774738a766c2c.jpg',
      exp: 'https://telegra.ph/file/c46b8074774738a766c2c.jpg',
    },
    {
      desc: 'img relative fs dest',
      src: '/file/c46b8074774738a766c2c.jpg',
      assetsDir: 'assets-dir/',
      exp: '/assets-dir/c46b8074774738a766c2c.jpg',
    },
    {
      desc: 'video telegra.ph absolute url',
      src: '/file/69fcb6fff911b4c046d7f.mp4',
      exp: 'https://telegra.ph/file/69fcb6fff911b4c046d7f.mp4',
    },
    {
      desc: 'video relative fs dest',
      src: '/file/69fcb6fff911b4c046d7f.mp4',
      assetsDir: 'assets-dir/',
      exp: '/assets-dir/69fcb6fff911b4c046d7f.mp4',
    },
  ];

  it.each(data)('return path to $desc', ({ src, assetsDir, exp }) => {
    expect(getPathToAsset(src, assetsDir)).toBe(exp);
  });
});

describe('getImgMd', () => {
  const data = [
    {
      desc: 'with absolute telegra.ph url',
      exp: '![img](https://telegra.ph/file/d0e78e2e420c8398e6e4a.jpg)',
    },
    {
      desc: 'with relative fs path',
      assetsDir: 'assets-dir/',
      exp: '![img](/assets-dir/d0e78e2e420c8398e6e4a.jpg)',
    },
  ];

  it.each(data)('return img md $desc', ({ exp, assetsDir }) => {
    const res = getImgMd(
      {
        tag: 'img',
        attrs: { src: '/file/d0e78e2e420c8398e6e4a.jpg' },
      },
      assetsDir,
    );

    expect(res).toBe(exp);
  });

  it('return empty img md when no node.attrs.src', () => {
    expect(getImgMd({ tag: 'img' })).toBe('');
  });
});

describe('getVideoMd', () => {
  const data = [
    {
      desc: 'with absolute telegra.ph url',
      exp: '[Video](https://telegra.ph/file/42ee5dec2f950df9c5113.mp4)',
    },
    {
      desc: 'with relative fs path',
      assetsDir: 'assets-dir/',
      exp: '[Video](/assets-dir/42ee5dec2f950df9c5113.mp4)',
    },
  ];

  it.each(data)('return video md $desc', ({ exp, assetsDir }) => {
    const res = getVideoMd(
      {
        tag: 'video',
        attrs: { src: '/file/42ee5dec2f950df9c5113.mp4' },
      },
      assetsDir,
    );

    expect(res).toBe(exp);
  });

  it('return empty video md when no node.attrs.src', () => {
    expect(getVideoMd({ tag: 'video' })).toBe('');
  });
});

describe('getIframeMd', () => {
  const data = [
    {
      desc: 'youtube video',
      src: '/embed/youtube?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D09839DpTctU%26ab_channel%3DEagles',
      exp: '[Youtube video](https://www.youtube.com/watch?v=09839DpTctU&ab_channel=Eagles)',
    },
    {
      desc: 'vimeo video',
      src: '/embed/vimeo?url=https%3A%2F%2Fvimeo.com%2F556809690',
      exp: '[Vimeo video](https://vimeo.com/556809690)',
    },
    {
      desc: 'twitter post',
      src: '/embed/twitter?url=https%3A%2F%2Ftwitter.com%2Fnodejs%2Fstatus%2F1669750569165103110%3Fcxt%3DHHwWjIC9qfjSkqwuAAAA',
      exp: '[Twitter post](https://twitter.com/nodejs/status/1669750569165103110?cxt=HHwWjIC9qfjSkqwuAAAA)',
    },
    {
      desc: 'empty content when hostname not match',
      src: '/embed/test?url=https://test.com',
      exp: '',
    },
  ];

  it.each(data)('return iframe md with $desc', ({ src, exp }) => {
    expect(getIframeMd({ tag: 'iframe', attrs: { src } })).toBe(exp);
  });

  it('return empty iframe md when no node.attrs.src', () => {
    expect(getIframeMd({ tag: 'iframe' })).toBe('');
  });
});

describe('getFigcaptionMd', () => {
  it('return figcaption md', () => {
    expect(getFigcaptionMd('Figcaption text')).toBe('\n\nFigcaption text');
  });

  it('return empty figcaption md when no figcaption text', () => {
    expect(getFigcaptionMd('')).toBe('');
  });
});

describe('getAsideMd', () => {
  const data = [
    {
      desc: 'plain text',
      prevMd: 'Text',
      exp: 'Text\n\n',
    },
    {
      desc: 'link',
      prevMd: '[Link](https://github.com/yuriybahur3)',
      exp: '[Link](https://github.com/yuriybahur3)\n\n',
    },
    {
      desc: 'bold text',
      prevMd: '**bold**',
      exp: '**bold**\n\n',
    },
    {
      desc: 'code text',
      prevMd: '`code`',
      exp: '`code`\n\n',
    },
    {
      desc: 'underlined text',
      prevMd: '<ins>underlined</ins>',
      exp: '<ins>underlined</ins>\n\n',
    },
    {
      desc: 'all supported elements',
      prevMd:
        'Plain text, [link](https://github.com/yuriybahur3), **bold**, `code`, <ins>underlined</ins>',
      exp: 'Plain text, [link](https://github.com/yuriybahur3), **bold**, `code`, <ins>underlined</ins>\n\n',
    },
  ];

  it.each(data)('return aside md with $desc', ({ prevMd, exp }) => {
    expect(getAsideMd(prevMd)).toBe(exp);
  });
});

describe('getNodeMd', () => {
  const data = [
    {
      desc: 'paragraph md',
      args: {
        prevMd: 'Paragraph text',
        node: { tag: 'p' },
      },
      exp: 'Paragraph text\n\n',
    },
    {
      desc: 'link md',
      args: {
        prevMd: 'Link text',
        node: {
          tag: 'a',
          attrs: {
            href: 'https://github.com/yuriybahur3',
          },
        },
      },
      exp: '[Link text](https://github.com/yuriybahur3)',
    },
    {
      desc: 'blockquote md',
      args: {
        prevMd: 'Blockquote text',
        node: {
          tag: 'blockquote',
        },
      },
      exp: '> Blockquote text\n\n',
    },
    {
      desc: 'bold md',
      args: {
        prevMd: 'bold text',
        node: {
          tag: 'b',
        },
      },
      exp: '**bold text**',
    },
    {
      desc: 'code md',
      args: {
        prevMd: 'code text',
        node: {
          tag: 'code',
        },
      },
      exp: '`code text`',
    },
    {
      desc: 'italic md',
      args: {
        prevMd: 'italic text',
        node: {
          tag: 'em',
        },
      },
      exp: '*italic text*',
    },
    {
      desc: 'h3 md',
      args: {
        prevMd: 'Heading text',
        node: {
          tag: 'h3',
        },
      },
      exp: '### Heading text\n\n',
    },
    {
      desc: 'h4 md',
      args: {
        prevMd: 'Heading text',
        node: {
          tag: 'h4',
        },
      },
      exp: '#### Heading text\n\n',
    },
    {
      desc: 'hr md',
      args: {
        prevMd: '',
        node: {
          tag: 'hr',
        },
      },
      exp: '---\n\n',
    },
    {
      desc: 'ul md',
      args: {
        prevMd: 'First\nSecond\nThird\n',
        node: {
          tag: 'ul',
        },
      },
      exp: '- First\n- Second\n- Third\n\n',
    },
    {
      desc: 'ol md',
      args: {
        prevMd: 'First\nSecond\nThird\n',
        node: {
          tag: 'ol',
        },
      },
      exp: '1. First\n2. Second\n3. Third\n\n',
    },
    {
      desc: 'li md',
      args: {
        prevMd: 'Li text',
        node: {
          tag: 'li',
        },
      },
      exp: 'Li text\n',
    },
    {
      desc: 'aside md',
      args: {
        prevMd: 'Aside text',
        node: {
          tag: 'aside',
        },
      },
      exp: 'Aside text\n\n',
    },
    {
      desc: 'br md',
      args: {
        prevMd: '',
        node: {
          tag: 'br',
        },
      },
      exp: '<br>',
    },
    {
      desc: 'strikethrough md',
      args: {
        prevMd: 'strikethrough text',
        node: {
          tag: 's',
        },
      },
      exp: '~~strikethrough text~~',
    },
    {
      desc: 'underlined md',
      args: {
        prevMd: 'underlined text',
        node: {
          tag: 'u',
        },
      },
      exp: '<ins>underlined text</ins>',
    },
    {
      desc: 'pre md',
      args: {
        prevMd: 'pre text',
        node: {
          tag: 'pre',
        },
      },
      exp: '```\npre text```\n\n',
    },
    {
      desc: 'figure md',
      args: {
        prevMd: '![img](https://telegra.ph/file/d0e78e2e420c8398e6e4a.jpg)',
        node: {
          tag: 'figure',
        },
      },
      exp: '![img](https://telegra.ph/file/d0e78e2e420c8398e6e4a.jpg)\n\n',
    },
    {
      desc: 'img md (with absolute telegra.ph urls)',
      args: {
        prevMd: '',
        node: {
          tag: 'img',
          attrs: {
            src: '/file/d0e78e2e420c8398e6e4a.jpg',
          },
        },
      },
      exp: '![img](https://telegra.ph/file/d0e78e2e420c8398e6e4a.jpg)',
    },
    {
      desc: 'img md (with relative fs path to img)',
      args: {
        prevMd: '',
        node: {
          tag: 'img',
          attrs: {
            src: '/file/d0e78e2e420c8398e6e4a.jpg',
          },
        },
        assetsDir: 'assets-dir/',
      },
      exp: '![img](/assets-dir/d0e78e2e420c8398e6e4a.jpg)',
    },
    {
      desc: 'video md',
      args: {
        prevMd: '',
        node: {
          tag: 'video',
          attrs: {
            src: '/file/42ee5dec2f950df9c5113.mp4',
          },
        },
      },
      exp: '[Video](https://telegra.ph/file/42ee5dec2f950df9c5113.mp4)',
    },
    {
      desc: 'iframe md',
      args: {
        prevMd: '',
        node: {
          tag: 'iframe',
          attrs: {
            src: '/embed/youtube?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D09839DpTctU%26ab_channel%3DEagles',
          },
        },
      },
      exp: '[Youtube video](https://www.youtube.com/watch?v=09839DpTctU&ab_channel=Eagles)',
    },
    {
      desc: 'figcaption md',
      args: {
        prevMd: 'Figcaption text',
        node: {
          tag: 'figcaption',
        },
      },
      exp: '\n\nFigcaption text',
    },
    {
      desc: 'empty md when unknown tag',
      args: {
        prevMd: 'Prev md...',
        node: {
          tag: 'test',
        },
      },
      exp: '',
    },
    {
      desc: 'plain text md (when typeof node === string)',
      args: {
        prevMd: 'Prev md...',
        node: 'Plain text',
      },
      exp: 'Plain text',
    },
  ];

  it.each(data)('return $desc', ({ args, exp }) => {
    const res = getNodeMd(args.prevMd, args.node as Node, args.assetsDir);

    expect(res).toBe(exp);
  });
});

describe('getContentMd', () => {
  it('return correct markdown', () => {
    const data = [
      {
        tag: 'p',
        children: ['First paragraph'],
      },
      {
        tag: 'p',
        children: ['Second paragraph'],
      },
    ];

    const exp = {
      markdown: 'First paragraph\n\nSecond paragraph',
      assets: [],
    };

    expect(getContentMd(data as PageContent)).toEqual(exp);
  });

  it('return correct assets arr', () => {
    const data = [
      {
        tag: 'figure',
        children: [
          {
            tag: 'img',
            attrs: {
              src: '/file/95fda67ba633459eff80d.jpg',
            },
          },
          {
            tag: 'figcaption',
            children: [''],
          },
        ],
      },
      {
        tag: 'figure',
        children: [
          {
            tag: 'video',
            attrs: {
              src: '/file/c3e758fc2ea798bd4fff3.mp4',
              preload: 'auto',
              controls: 'controls',
            },
          },
          {
            tag: 'figcaption',
            children: [''],
          },
        ],
      },
    ];

    const exp = {
      markdown:
        '![img](https://telegra.ph/file/95fda67ba633459eff80d.jpg)\n\n[Video](https://telegra.ph/file/c3e758fc2ea798bd4fff3.mp4)',
      assets: [
        {
          url: 'https://telegra.ph/file/95fda67ba633459eff80d.jpg',
          name: '95fda67ba633459eff80d.jpg',
        },
        {
          url: 'https://telegra.ph/file/c3e758fc2ea798bd4fff3.mp4',
          name: 'c3e758fc2ea798bd4fff3.mp4',
        },
      ],
    };

    expect(getContentMd(data as PageContent)).toEqual(exp);
  });
});

const meta = {
  path: 'Test-page-06-16-8',
  url: 'https://telegra.ph/Test-page-06-16-8',
  title: 'Test page',
  author_name: 'Yuriy',
};

describe('getMarkdown', () => {
  it('fails when API return error', () => {
    const apiData = { ok: false, error: 'PAGE_NOT_FOUND' };

    expect(() => getMarkdown(apiData)).toThrow('PAGE_NOT_FOUND');
  });

  it('return correct page meta', () => {
    const apiData = {
      ok: true,
      result: {
        path: 'Test-page-06-16-8',
        url: 'https://telegra.ph/Test-page-06-16-8',
        title: 'Test page',
        author_name: 'Yuriy',
        content: [{ tag: 'p', children: ['Text'] }],
        views: 111,
      },
    } as APIResponse;

    const exp = {
      meta,
      markdown: 'Text',
      assets: [],
    };

    expect(getMarkdown(apiData)).toEqual(exp);
  });

  it('return correct markdown and assets data arr', () => {
    const apiData = {
      ok: true,
      result: {
        path: 'Test-page-06-16-8',
        url: 'https://telegra.ph/Test-page-06-16-8',
        title: 'Test page',
        author_name: 'Yuriy',
        content: [
          {
            tag: 'p',
            children: [
              'Plain text, ',
              {
                tag: 'a',
                attrs: {
                  href: 'https://github.com/yuriybahur3',
                  target: '_blank',
                },
                children: ['link'],
              },
              ', ',
              { tag: 'strong', children: ['bold'] },
              ', ',
              { tag: 'code', children: ['code'] },
              ', ',
              { tag: 'em', children: ['italic'] },
              ', ',
              { tag: 'u', children: ['underlined'] },
            ],
          },
          { tag: 'blockquote', children: ['Blockquote'] },
          { tag: 'aside', children: ['Aside'] },
          { tag: 'h3', attrs: { id: 'H3' }, children: ['H3'] },
          { tag: 'h4', attrs: { id: 'H4' }, children: ['H4'] },
          { tag: 'p', children: [{ tag: 'br' }] },
          {
            tag: 'ul',
            children: [
              { tag: 'li', children: ['Ul item'] },
              { tag: 'li', children: ['Ul item'] },
            ],
          },
          {
            tag: 'ol',
            children: [
              { tag: 'li', children: ['Ol item'] },
              { tag: 'li', children: ['Ol item'] },
            ],
          },
          { tag: 'hr' },
          {
            tag: 'figure',
            children: [
              { tag: 'img', attrs: { src: '/file/40ca95683d1442bfe172c.jpg' } },
              { tag: 'figcaption', children: ['Figcaption text'] },
            ],
          },
          {
            tag: 'figure',
            children: [
              {
                tag: 'video',
                attrs: {
                  src: '/file/28f2a2ec603132c95123c.mp4',
                  preload: 'auto',
                  controls: 'controls',
                },
              },
              { tag: 'figcaption', children: [''] },
            ],
          },
          {
            tag: 'figure',
            children: [
              {
                tag: 'iframe',
                attrs: {
                  src: '/embed/youtube?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D09839DpTctU%26ab_channel%3DEagles',
                  width: '640',
                  height: '360',
                  frameborder: '0',
                  allowtransparency: 'true',
                  allowfullscreen: 'true',
                  scrolling: 'no',
                },
              },
              { tag: 'figcaption', children: [''] },
            ],
          },
          { tag: 'pre', children: ['const calcSum = (a,b) => a + b;\n'] },
        ],
        views: 111,
      },
    } as APIResponse;

    const exp = {
      meta,
      markdown:
        'Plain text, [link](https://github.com/yuriybahur3), **bold**, `code`, *italic*, <ins>underlined</ins>\n\n' +
        '> Blockquote\n\n' +
        'Aside\n\n' +
        '### H3\n\n' +
        '#### H4\n\n' +
        '<br>\n\n' +
        '- Ul item\n' +
        '- Ul item\n\n' +
        '1. Ol item\n' +
        '2. Ol item\n\n' +
        '---\n\n' +
        '![img](https://telegra.ph/file/40ca95683d1442bfe172c.jpg)\n\n' +
        'Figcaption text\n\n' +
        '[Video](https://telegra.ph/file/28f2a2ec603132c95123c.mp4)\n\n' +
        '[Youtube video](https://www.youtube.com/watch?v=09839DpTctU&ab_channel=Eagles)\n\n' +
        '```\n' +
        'const calcSum = (a,b) => a + b;\n' +
        '```',
      assets: [
        {
          url: 'https://telegra.ph/file/40ca95683d1442bfe172c.jpg',
          name: '40ca95683d1442bfe172c.jpg',
        },
        {
          url: 'https://telegra.ph/file/28f2a2ec603132c95123c.mp4',
          name: '28f2a2ec603132c95123c.mp4',
        },
      ],
    };

    expect(getMarkdown(apiData)).toEqual(exp);
  });

  it('return correct markdown with relative fs path to assets', () => {
    const apiData = {
      ok: true,
      result: {
        path: 'Test-page-06-16-8',
        url: 'https://telegra.ph/Test-page-06-16-8',
        title: 'Test page',
        author_name: 'Yuriy',
        content: [
          {
            tag: 'figure',
            children: [
              { tag: 'img', attrs: { src: '/file/84e9aebf24fe2af7c0b7a.jpg' } },
              { tag: 'figcaption', children: [''] },
            ],
          },
        ],
        views: 111,
      },
    } as APIResponse;

    const exp = {
      meta,
      markdown: '![img](/assets-dir/84e9aebf24fe2af7c0b7a.jpg)',
      assets: [
        {
          url: 'https://telegra.ph/file/84e9aebf24fe2af7c0b7a.jpg',
          name: '84e9aebf24fe2af7c0b7a.jpg',
        },
      ],
    };

    expect(getMarkdown(apiData, { assetsDir: 'assets-dir/' })).toEqual(exp);
  });
});
