const packageJson = require('./package.json')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const terser = require('rollup-plugin-terser').terser
// const commonjs = require('rollup-plugin-commonjs')

const deps = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
]

const inputOutputConfig = (outputFile, outputFormat, commonOutput = {}) => ({
  input: 'src/kinka.js',
  output: {
    file: `${outputFile}`,
    format: outputFormat,
    ...commonOutput,
  },
})

const productionBuildPlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  terser({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
      arguments: true,
      toplevel: true,
      unsafe_Function: true,
      module: true,
      unsafe_proto: true,
    },
    mangle: {
      properties: {
        reserved: [
          'kinka',
          // methods
          'get',
          'post',
          'put',
          'patch',
          'delete',
          'head',
          'options',
          // instance
          'abort',
          'all',
          'create',
          'baseURL',
          'config',
          'omitCatches',
          'middlewares',
          'credentials',
          'headers',
          'timeout',
          'charset',
          'inspectors',
          'clone',
          'custom',
          'auth',
          'response',
          'request',
          // response
          'status',
          'responseType',
          'responseText',
          //  'getResponseHeader'f
          'data',
          'err',
          'isError',
          'isSuccess',
          'statusText',
          'type',
          // request
          'query',
          'cancelToken',
          'onDownloadProgress',
          'onUploadProgress',
          'successStatus',
        ],
      },
      module: true,
      toplevel: true,
    },
  }),
]

module.exports = [
  // Common JS builds
  {
    ...inputOutputConfig('lib/kinka.js', 'cjs'),
    external: deps,
    plugins: [babel()],
  },
  {
    ...inputOutputConfig('lib/kinka.min.js', 'cjs'),
    external: deps,
    plugins: [babel(), ...productionBuildPlugins],
  },

  // EcmaScript builds
  {
    ...inputOutputConfig('es/kinka.js', 'es'),
    external: deps,
    plugins: [babel()],
  },
  {
    ...inputOutputConfig('es/kinka.mjs', 'es'),
    external: deps,
    plugins: [resolve(), babel(), ...productionBuildPlugins],
  },

  // UMD builds
  {
    ...inputOutputConfig('dist/kinka.js', 'umd', {
      name: 'kinka',
    }),
    external: deps,
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  },
  {
    ...inputOutputConfig('dist/kinka.min.js', 'umd', {
      name: 'kinka',
    }),
    external: deps,
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      ...productionBuildPlugins,
    ],
  },
]
