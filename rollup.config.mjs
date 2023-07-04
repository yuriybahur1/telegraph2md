import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const pkg = require('./package.json');

const plugins = [commonjs(), nodeResolve(), typescript()];

export default defineConfig([
  {
    input: 'src/lib/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    plugins,
  },
  {
    input: 'dist/lib/index.d.ts',
    output: {
      file: pkg.types,
      format: 'esm',
    },
    plugins: [dts()],
  },
  {
    input: 'src/cli/index.ts',
    output: {
      file: pkg.bin,
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
    plugins,
  },
]);
