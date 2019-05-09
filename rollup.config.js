import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'

const env = process.env.NODE_ENV

export default {
  input: 'src/index.js',
  output: {
    file: {
      es: pkg.module,
      cjs: pkg.main,
    }[env],
    format: env,
  },
  external: ['crypto', 'util'],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      externalHelpers: true,
    }),
    commonjs(),
    filesize(),
  ],
}
