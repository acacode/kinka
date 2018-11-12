const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'lib/kinka.js'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'kinka.min.js',
    library: 'kinka',
    libraryTarget: 'commonjs2',
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
  //   optimization: {
  //     minimizer: [
  //       new UglifyJsPlugin({
  //         cache: true,
  //         parallel: true,
  //         uglifyOptions: { output: { comments: false } },
  //       }),
  //     ],
  //   },
}
