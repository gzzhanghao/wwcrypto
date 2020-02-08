import babel from 'rollup-plugin-babel'

const KNOWN_EXTERNALS = ['crypto']
const PACKAGE_EXTERNALS = Object.keys(require('./package.json').dependencies)

const external = [
  ...KNOWN_EXTERNALS,
  ...PACKAGE_EXTERNALS,
]

export default [
  {
    input: './src/index.ts',
    external,
    output: {
      file: './dist/index.js',
      format: 'cjs',
    },
    plugins: [
      babel({ extensions: ['ts'] }),
    ],
  },
  {
    input: './src/index.ts',
    external,
    output: {
      file: './dist/index.mjs',
      format: 'esm',
    },
    plugins: [
      babel({ extensions: ['ts'] }),
    ],
  },
]
