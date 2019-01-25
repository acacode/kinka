const resolve = require('path').resolve
const path = dir => resolve(__dirname, dir)

const createConfig = (mode, configration) => {
  if (!configration) configration = {}
  const isProd = mode === 'production'
  let filename = configration.filename || 'kinka'
  const plugins = configration.plugins || []
  if (configration.withoutPromises) {
    filename += '.non-promise'
  }
  return {
    entry: path('lib/kinka.js'),
    mode: mode,
    output: {
      path: path('dist'),
      filename: (isProd ? `${filename}.min` : filename) + '.js',
      library: 'kinka',
      libraryTarget: 'umd',
    },
    resolveLoader: {
      modules: ['node_modules', path('loaders')],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loaders: [
            'babel-loader',
            isProd && 'production-js-loader',
            'non-promise-js-loader?exclude-promises=' +
              !!configration.withoutPromises,
          ].filter(loader => loader),
          exclude: /node_modules/,
        },
      ],
    },
    plugins,
  }
}

module.exports = [
  createConfig('production'),
  createConfig('development'),
  createConfig('production', {
    withoutPromises: true,
  }),
  createConfig('development', {
    withoutPromises: true,
  }),
]
