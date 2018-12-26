const path = require('path')

const createConfig = mode => {
  const isProd = mode === 'production'
  return {
    entry: path.resolve(__dirname, 'lib/kinka.js'),
    mode: mode,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: (isProd ? 'kinka.min' : 'kinka') + '.js',
      library: 'kinka',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
  }
}

module.exports = [createConfig('production'), createConfig('development')]
