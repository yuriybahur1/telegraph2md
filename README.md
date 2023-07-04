# telegraph2md

Converts [telegra.ph](http://telegra.ph/) page to markdown and downloads assets.

- [CLI usage](#cli-usage)
  - [Installation](#installation)
  - [Examples](#examples)
    - [Generate markdown file](#generate-markdown-file)
    - [Generate markdown file with meta](#generate-markdown-file-with-meta)
    - [Download assets (photos and videos)](#download-assets-photos-and-videos)
    - [Generate markdown file and download assets](#generate-markdown-file-and-download-assets)
    - [Generate markdown file with meta and download assets](#generate-markdown-file-with-meta-and-download-assets)
  - [All CLI flags](#all-cli-flags)
- [Lib usage](#lib-usage)
  - [Installation](#installation-1)
  - [Examples](#examples-1)
    - [Generate markdown file](#generate-markdown-file-1)
    - [Generate markdown file with meta](#generate-markdown-file-with-meta-1)
    - [Download assets (photos and videos)](#download-assets-photos-and-videos-1)
    - [Generate markdown file and download assets](#generate-markdown-file-and-download-assets-1)
    - [Generate markdown file with meta and download assets](#generate-markdown-file-with-meta-and-download-assets-1)
  - [API](#api)
    - [getApiUrl](#getapiurl)
    - [getMarkdown](#getmarkdown)
- [License](#license)

## CLI usage

### Installation

Use CLI with `npx` tool (preferred way).

Or install CLI globally via `npm`:

```bash
npm i -g telegraph2md
```

or via `yarn`:

```bash
yarn global add telegraph2md
```

### Examples

#### Generate markdown file

```bash
npx telegraph2md --url https://telegra.ph/Test-telegraph2md-06-30 --file foo.md
```

(be sure to create `content` directory before run CLI):

```bash
npx telegraph2md --url https://telegra.ph/Test-telegraph2md-06-30 --file content/foo.md
```

#### Generate markdown file with meta

```bash
npx telegraph2md --url https://telegra.ph/Test-telegraph2md-06-30 --file foo.md --meta
```

[API](https://telegra.ph/api) return some useful [page data](https://telegra.ph/api#Page). Run CLI with `--meta` flag if you want to write this data at start of markdown file.

Data will be written as `JSON` in `YAML` (`JSON` is compatible with `YAML`). If you want to write data as plain `YAML` [use lib](#generate-markdown-file-with-meta-1).

`content` field from [page data API](https://telegra.ph/api#Page) will not be included into markdown file because field size might be too large. By the way, `telegraph2md` use this field to convert [telegraph.ph](http://telegra.ph/) page content to markdown.

#### Download assets (photos and videos)

```bash
npx telegraph2md --url https://telegra.ph/Test-telegraph2md-06-30 --assets-dir .
```

(be sure to create `assets` directory before run CLI):

```bash
npx telegraph2md --url https://telegra.ph/Test-telegraph2md-06-30 --assets-dir assets
```

#### Generate markdown file and download assets

```bash
npx telegraph2md --url https://telegra.ph/Test-telegraph2md-06-30 --file foo.md --assets-dir .
```

Above code also creates local relative paths to assets in markdown:

- `--assets-dir .`: `/3828001c8c972670d9edd.jpg` instead of `https://telegra.ph/file/3828001c8c972670d9edd.jpg`

- `--assets-dir assets`: `/assets/3828001c8c972670d9edd.jpg`

- `--assets-dir outer/inner`: `/outer/inner/3828001c8c972670d9edd.jpg`

#### Generate markdown file with meta and download assets

```bash
npx telegraph2md --url https://telegra.ph/Test-telegraph2md-06-30 --file foo.md  --meta --assets-dir .
```

### All CLI flags

Run below code to view all flags and short description for each of them:

```bash
npx telegraph2md --help
```

Outputs:

```bash
Usage: telegraph2md [options]

Converts telegra.ph page to markdown and downloads assets

Options:
  -V, --version               output the version number
  -u, --url <url>             telegra.ph page url
  -f, --file <filename>       converted markdown will be written to this file
  -m, --meta                  adds page meta to generated markdown file
  -a, --assets-dir <dirname>  photos and videos will be downloaded to this directory
  -h, --help                  display help for command
```

## Lib usage

### Installation

Install lib via `npm`:

```bash
npm i telegraph2md
```

or via `yarn`:

```bash
yarn add telegraph2md
```

After installation you can use lib in `ESM` modules:

```typescript
import { getApiUrl, getMarkdown } from 'telegraph2md';
```

or in `CommonJS` modules:

```typescript
const { getApiUrl, getMarkdown } = require('telegraph2md');
```

### Examples

#### Generate markdown file

```typescript
import { getApiUrl, getMarkdown } from 'telegraph2md';
import axios from 'axios';
import fs from 'fs';

const fn = async () => {
  // builds API url (https://telegra.ph/api#getPage) from page url
  const apiUrl = getApiUrl('https://telegra.ph/Test-telegraph2md-06-30'); // https://api.telegra.ph/getPage/Test-telegraph2md-06-30?return_content=true

  // you can use any HTTP client
  const { data: apiData } = await axios.get(apiUrl);

  // returns converted markdown
  const { markdown } = getMarkdown(apiData);

  // generate markdown file
  fs.writeFileSync('foo.md', markdown);
};

fn();
```

#### Generate markdown file with meta

[What is meta?](#generate-markdown-file-with-meta)

```typescript
import { getApiUrl, getMarkdown } from 'telegraph2md';
import axios from 'axios';
import fs from 'fs';

const fn = async () => {
  // builds API url (https://telegra.ph/api#getPage) from page url
  const apiUrl = getApiUrl('https://telegra.ph/Test-telegraph2md-06-30'); // https://api.telegra.ph/getPage/Test-telegraph2md-06-30?return_content=true

  // you can use any HTTP client
  const { data: apiData } = await axios.get(apiUrl);

  // returns converted markdown and page meta
  const { markdown, meta } = getMarkdown(apiData);

  // convert meta to JSON in YAML (JSON is compatible with YAML)
  // If you want convert meta to plain YAML do it yourself
  const metaYAML = '---\n' + JSON.stringify(meta, null, 2) + '\n---\n\n';

  fs.writeFileSync('foo.md', metaYAML + markdown);
};

fn();
```

#### Download assets (photos and videos)

```typescript
import { getApiUrl, getMarkdown } from 'telegraph2md';
import axios from 'axios';
import fs from 'fs';
import https from 'https';

// It's just example: write logic for downloading assets like you want
const downloadAsset = (url: string, name: string) => {
  const file = fs.createWriteStream(name);

  https.get(url, (res) => {
    res.pipe(file);

    file.on('finish', () => {
      file.close();
    });
  });
};

const fn = async () => {
  // builds API url (https://telegra.ph/api#getPage) from page url
  const apiUrl = getApiUrl('https://telegra.ph/Test-telegraph2md-06-30'); // https://api.telegra.ph/getPage/Test-telegraph2md-06-30?return_content=true

  // you can use any HTTP client
  const { data: apiData } = await axios.get(apiUrl);

  // returns assets data
  const { assets } = getMarkdown(apiData);

  // download photos and videos
  assets.forEach((a) => downloadAsset(a.url, a.name));
};

fn();
```

#### Generate markdown file and download assets

```typescript
import { getApiUrl, getMarkdown } from 'telegraph2md';
import axios from 'axios';
import fs from 'fs';
import https from 'https';

// It's just example: write logic for downloading assets like you want
const downloadAsset = (url: string, name: string) => {
  const file = fs.createWriteStream(name);

  https.get(url, (res) => {
    res.pipe(file);

    file.on('finish', () => {
      file.close();
    });
  });
};

const fn = async () => {
  // builds API url (https://telegra.ph/api#getPage) from page url
  const apiUrl = getApiUrl('https://telegra.ph/Test-telegraph2md-06-30'); // https://api.telegra.ph/getPage/Test-telegraph2md-06-30?return_content=true

  // you can use any HTTP client
  const { data: apiData } = await axios.get(apiUrl);

  // returns converted markdown and assets data
  // Pass assetsDir option if you want to create local relative paths to assets in markdown:
  // assetsDir: '.' -> /3828001c8c972670d9edd.jpg instead of https://telegra.ph/file/3828001c8c972670d9edd.jpg
  // assetsDir: 'assets' -> /assets/3828001c8c972670d9edd.jpg
  // assetsDir: 'outer/inner' -> /outer/inner/3828001c8c972670d9edd.jpg
  const { markdown, assets } = getMarkdown(apiData, { assetsDir: '.' });

  // download photos and videos
  assets.forEach((a) => downloadAsset(a.url, a.name));

  // generate markdown file
  fs.writeFileSync('foo.md', markdown);
};

fn();
```

#### Generate markdown file with meta and download assets

```typescript
import { getApiUrl, getMarkdown } from 'telegraph2md';
import axios from 'axios';
import fs from 'fs';
import https from 'https';

// It's just example: write logic for downloading assets like you want
const downloadAsset = (url: string, name: string) => {
  const file = fs.createWriteStream(name);

  https.get(url, (res) => {
    res.pipe(file);

    file.on('finish', () => {
      file.close();
    });
  });
};

const fn = async () => {
  // builds API url (https://telegra.ph/api#getPage) from page url
  const apiUrl = getApiUrl('https://telegra.ph/Test-telegraph2md-06-30'); // https://api.telegra.ph/getPage/Test-telegraph2md-06-30?return_content=true

  // you can use any HTTP client
  const { data: apiData } = await axios.get(apiUrl);

  // returns converted markdown, page meta and assets data
  // Pass assetsDir option if you want to create local relative paths to assets in markdown:
  // assetsDir: '.' -> /3828001c8c972670d9edd.jpg instead of https://telegra.ph/file/3828001c8c972670d9edd.jpg
  // assetsDir: 'assets' -> /assets/3828001c8c972670d9edd.jpg
  // assetsDir: 'outer/inner' -> /outer/inner/3828001c8c972670d9edd.jpg
  const { markdown, assets, meta } = getMarkdown(apiData, { assetsDir: '.' });

  // download photos and videos
  assets.forEach((a) => downloadAsset(a.url, a.name));

  // convert meta to JSON in YAML (JSON is compatible with YAML)
  // If you want convert meta to plain YAML do it yourself
  const metaYAML = '---\n' + JSON.stringify(meta, null, 2) + '\n---\n\n';

  // generate markdown file
  fs.writeFileSync('foo.md', metaYAML + markdown);
};

fn();
```

### API

#### getApiUrl

Builds [API url](https://telegra.ph/api#getPage) from [page url](http://telegra.ph/)

```typescript
(pageUrl: string) => string;
```

#### getMarkdown

Returns converted markdown, page meta and assets data.

```typescript
(data: APIResponse, options?: {
    assetsDir?: string;
}) => {
    meta: {
        path: string;
        url: string;
        title: string;
        description: string;
        author_name?: string | undefined;
        author_url?: string | undefined;
        image_url?: string | undefined;
    };
    markdown: string;
    assets: {
        url: string;
        name: string;
    }[];
}
```

## License

This project licensed under [MIT License](./LICENSE)
