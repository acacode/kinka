module.exports = function(source) {
  return source
    .replace(/typeCheck\([\w\r\n., ']+\)/g, '')
    .replace(
      /if \(process.env.NODE_ENV !== 'production'\) {[\w\r\n., /*@{}|!&=;()[\]+']+(\}\n)/g,
      ''
    )
    .replace(/emptyCheck\([\w\r\n., ']+\)/g, '')
}
