const path = require('path')

const createConfig = (mode, configration) => {
  const isProd = mode === 'production'
  const filename = configration ? configration.filename : 'kinka'
  const plugins = (configration && configration.plugins) || []
  return {
    entry: path.resolve(__dirname, 'lib/kinka.js'),
    mode: mode,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: (isProd ? `${filename}.min` : filename) + '.js',
      library: 'kinka',
      libraryTarget: 'umd',
    },
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, 'loaders')],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loaders: isProd
            ? ['babel-loader', 'production-js-loader']
            : ['babel-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    plugins,
  }
}

module.exports = [createConfig('production'), createConfig('development')]
