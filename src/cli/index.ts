#!/usr/bin/env node

import fs from 'fs';
import https from 'https';
import path from 'path';
import { getApiUrl, getMarkdown } from '../lib';
import { Command } from 'commander';
import { createRequire } from 'module';
import { APIResponse } from '../lib/functions';

const pkg = createRequire(import.meta.url)('../package.json');

type Options = {
  url: string;
  file?: string;
  meta?: boolean;
  assetsDir?: string;
};

type OptionsKeys = keyof Required<Options>;

const optionsData: {
  [k in OptionsKeys]: {
    flags: string;
    description: string;
    required?: boolean;
  };
} = {
  url: {
    flags: '-u, --url <url>',
    description: 'telegra.ph page url',
    required: true,
  },
  file: {
    flags: '-f, --file <filename>',
    description: 'converted markdown will be written to this file',
  },
  meta: {
    flags: '-m, --meta',
    description: 'adds page meta to generated markdown file',
  },
  assetsDir: {
    flags: '-a, --assets-dir <dirname>',
    description: 'photos and videos will be downloaded to this directory',
  },
};

const flags = Object.keys(optionsData).reduce((acc, k) => {
  const key = k as OptionsKeys;

  acc[key] = optionsData[key].flags;

  return acc;
}, {} as { [k in OptionsKeys]: string });

const setupOptions = () => {
  const program = new Command();

  program.name(pkg.name).description(pkg.description).version(pkg.version);

  Object.keys(optionsData).forEach((key) => {
    const opt = optionsData[key as OptionsKeys];

    program[opt.required ? 'requiredOption' : 'option'](
      opt.flags,
      opt.description,
    );
  });

  program.configureOutput({
    outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`),
  });

  program.parse();

  return {
    opts: program.opts<Options>(),
    showError: program.error.bind(program),
  };
};

const hasMdExtension = (filePath: string) => {
  const res = /(?:\.([^.]+))?$/.exec(filePath);

  return res ? res[1] === 'md' : false;
};

const getJSON = <T>(url: string) =>
  new Promise<T>((resolve, reject) => {
    let data = '';

    https
      .get(url, (res) => {
        res.on('data', (chunk) => (data += chunk));

        res.on('end', () => resolve(JSON.parse(data)));
      })
      .on('error', reject);
  });

const getMetaMd = (meta: object) =>
  '---\n' + JSON.stringify(meta, null, 2) + '\n---\n\n';

const downloadAsset = (url: string, name: string, assetsDir: string) => {
  const dest = path.join(assetsDir, name);

  const file = fs.createWriteStream(dest);

  https.get(url, (res) => {
    res.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log(`Download asset: ${dest.replace(/\\/g, '/')}`);
    });
  });
};

const handleCLI = async () => {
  const { opts, showError } = setupOptions();

  try {
    const apiUrl = getApiUrl(opts.url);

    if (!opts.file && !opts.assetsDir) {
      throw new Error(
        `specify at least '${flags.file}' option or '${flags.assetsDir}' option (or both options)`,
      );
    }

    if (opts.file && !hasMdExtension(opts.file)) {
      throw new Error(
        `add .md extension to filename in '${flags.file}' option`,
      );
    }

    if (!opts.file && opts.meta) {
      throw new Error(
        `to use '${flags.meta}' option specify '${flags.file}' option`,
      );
    }

    const apiData = await getJSON<APIResponse>(apiUrl);

    const { markdown, meta, assets } = getMarkdown(apiData, {
      assetsDir: opts.assetsDir,
    });

    if (opts.assetsDir) {
      const assetsDir = opts.assetsDir;

      if (assets.length === 0) {
        throw new Error(
          `to use '${flags.assetsDir}' option add some photos or videos to telegra.ph page`,
        );
      }

      assets.forEach((a) => downloadAsset(a.url, a.name, assetsDir));
    }

    if (opts.file) {
      const metaMd = opts.meta ? getMetaMd(meta) : '';

      fs.writeFileSync(opts.file, metaMd + markdown);

      console.log(`Write markdown to ${opts.file}`);
    }
  } catch (err) {
    showError(err as string);
  }
};

handleCLI();
