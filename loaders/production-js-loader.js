module.exports = function(source) {
  return source.replace(/typeCheck\([\w\r\n., ']+\)/g, '')
}
