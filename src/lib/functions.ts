import path from 'path';

type NodeElement = {
  tag:
    | 'a'
    | 'aside'
    | 'b'
    | 'blockquote'
    | 'br'
    | 'code'
    | 'em'
    | 'figcaption'
    | 'figure'
    | 'h3'
    | 'h4'
    | 'hr'
    | 'i'
    | 'iframe'
    | 'img'
    | 'li'
    | 'ol'
    | 'p'
    | 'pre'
    | 's'
    | 'strong'
    | 'u'
    | 'ul'
    | 'video';
  attrs?: {
    href?: string;
    src?: string;
  };
  children?: Node[];
};

export type Node = string | NodeElement;

type Page = {
  path: string;
  url: string;
  title: string;
  description: string;
  content: Node[];
  views: number;
  author_name?: string;
  author_url?: string;
  image_url?: string;
};

export type PageContent = Page['content'];

export type APIResponse = {
  ok: boolean;
  result?: Page;
  error?: string;
};

export const getApiUrl = (pageUrl: string) => {
  const apiUrl = new URL(pageUrl);

  if (apiUrl.hostname !== 'telegra.ph') {
    throw new Error("url must contain 'telegra.ph' hostname");
  }

  const pathname = apiUrl.pathname.slice(1).trim();

  if (!pathname) {
    throw new Error('url must contain pathname');
  }

  return `https://api.telegra.ph/getPage/${pathname}?return_content=true`;
};

export const getAssetName = (src: string) => src.replace('/file/', '');

export const getTelegraphUrl = (pathname: string) =>
  `https://telegra.ph${pathname}`;

export const getParagraphMd = (prevMd: string) => `${prevMd}\n\n`;

export const fixWhiteSpaces = (str: string, cb: (v: string) => string) =>
  str.replace(/^(\s*)(.*?)(\s*)$/gm, ['$1', cb('$2'), '$3'].join(''));

export const getLinkMd = (prevMd: string, node: NodeElement) => {
  // just for type-checking. API always return href for links
  if (node.attrs && node.attrs.href) {
    const { href } = node.attrs;

    return fixWhiteSpaces(prevMd, (v) => `[${v}](${href})`);
  }

  return '';
};

export const getBoldMd = (prevMd: string) =>
  fixWhiteSpaces(prevMd, (v) => `**${v}**`);

export const getBlockquoteMd = (prevMd: string) => `> ${prevMd}\n\n`;

export const getCodeMd = (prevMd: string) =>
  fixWhiteSpaces(prevMd, (v) => '`' + v + '`');

export const getItalicMd = (prevMd: string) =>
  fixWhiteSpaces(prevMd, (v) => `*${v}*`);

export const getH3Md = (prevMd: string) => `### ${prevMd}\n\n`;

export const getH4Md = (prevMd: string) => `#### ${prevMd}\n\n`;

export const getHrMd = () => `---\n\n`;

export const getListMd = (prevMd: string, tag: 'ul' | 'ol') => {
  const res = prevMd
    .trim()
    .split('\n')
    .map((v, i) => {
      return tag === 'ul' ? `- ${v}` : `${i + 1}. ${v}`;
    })
    .join('\n');

  return res + '\n\n';
};

export const getListItemMd = (prevMd: string) => `${prevMd}\n`;

export const getBrMd = () => '<br>';

export const getUnderlinedMd = (prevMd: string) =>
  fixWhiteSpaces(prevMd, (v) => `<ins>${v}</ins>`);

export const getStrikethroughMd = (prevMd: string) =>
  fixWhiteSpaces(prevMd, (v) => `~~${v}~~`);

export const getPreMd = (prevMd: string) => '```\n' + prevMd + '```\n\n';

export const getFigureMd = (prevMd: string) => `${prevMd}\n\n`;

export const getPathToAsset = (src: string, assetsDir?: string) => {
  if (assetsDir) {
    return path.join('/', assetsDir, getAssetName(src)).replace(/\\/g, '/');
  }

  return getTelegraphUrl(src);
};

export const getImgMd = (node: NodeElement, assetsDir?: string) => {
  // just for type-checking. API always return src for images
  if (node.attrs && node.attrs.src) {
    const { src } = node.attrs;

    return `![img](${getPathToAsset(src, assetsDir)})`;
  }

  return '';
};

export const getVideoMd = (node: NodeElement, assetsDir?: string) => {
  // just for type-checking. API always return src for videos
  if (node.attrs && node.attrs.src) {
    const { src } = node.attrs;

    return `[Video](${getPathToAsset(src, assetsDir)})`;
  }

  return '';
};

export const getIframeMd = (node: NodeElement) => {
  // just for type-checking. API always return src for iframes
  if (node.attrs && node.attrs.src) {
    const iframeUrl = new URL(getTelegraphUrl(node.attrs.src)).searchParams.get(
      'url',
    ) as string;

    switch (new URL(iframeUrl).hostname) {
      case 'www.youtube.com':
        return `[Youtube video](${iframeUrl})`;
      case 'vimeo.com':
        return `[Vimeo video](${iframeUrl})`;
      case 'twitter.com':
        return `[Twitter post](${iframeUrl})`;
      default:
        return '';
    }
  }

  return '';
};

export const getFigcaptionMd = (prevMd: string) => {
  if (prevMd.trim()) {
    return fixWhiteSpaces(prevMd, (v) => `\n\n${v}`);
  }

  return '';
};

export const getAsideMd = (prevMd: string) => `${prevMd}\n\n`;

export const getNodeMd = (prevMd: string, node: Node, assetsDir?: string) => {
  if (typeof node === 'string') {
    return node;
  }

  if (typeof node === 'object') {
    switch (node.tag) {
      case 'p':
        return getParagraphMd(prevMd);
      case 'a':
        return getLinkMd(prevMd, node);
      case 'b':
      case 'strong':
        return getBoldMd(prevMd);
      case 'blockquote':
        return getBlockquoteMd(prevMd);
      case 'code':
        return getCodeMd(prevMd);
      case 'em':
      case 'i':
        return getItalicMd(prevMd);
      case 'h3':
        return getH3Md(prevMd);
      case 'h4':
        return getH4Md(prevMd);
      case 'hr':
        return getHrMd();
      case 'ul':
      case 'ol':
        return getListMd(prevMd, node.tag);
      case 'li':
        return getListItemMd(prevMd);
      case 'aside':
        return getAsideMd(prevMd);
      case 'br':
        return getBrMd();
      case 's':
        return getStrikethroughMd(prevMd);
      case 'u':
        return getUnderlinedMd(prevMd);
      case 'pre':
        return getPreMd(prevMd);
      case 'figure':
        return getFigureMd(prevMd);
      case 'img':
        return getImgMd(node, assetsDir);
      case 'video':
        return getVideoMd(node, assetsDir);
      case 'iframe':
        return getIframeMd(node);
      case 'figcaption':
        return getFigcaptionMd(prevMd);
      default:
        return '';
    }
  }
};

export const getContentMd = (data: PageContent, assetsDir?: string) => {
  const cb = (prevMd: string, node: Node) => {
    let res = '';

    if (typeof node === 'object' && node.children) {
      res = node.children.reduce(cb, '');
    }

    if (
      typeof node === 'object' &&
      (node.tag === 'img' || node.tag === 'video') &&
      node.attrs &&
      node.attrs.src
    ) {
      const { src } = node.attrs;

      assets.push({
        url: getTelegraphUrl(src),
        name: getAssetName(src),
      });
    }

    return prevMd + getNodeMd(res, node, assetsDir);
  };

  const assets: { url: string; name: string }[] = [];

  const markdown = data.reduce(cb, '').trim();

  return { markdown, assets };
};

export const getMarkdown = (
  data: APIResponse,
  options?: { assetsDir?: string },
) => {
  if (data.error) {
    throw new Error(data.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, views, ...meta } = data.result as Page; // API always return data.result when no data.error. So type-checking is not necessarily

  const { markdown, assets } = getContentMd(content, options?.assetsDir);

  return { meta, markdown, assets };
};
