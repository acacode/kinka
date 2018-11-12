const path = require('path')

module.exports = {
  entry: ['./lib/kinka.js'],
  mode: 'production',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'kinka.min.js',
    library: 'kinka',
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
