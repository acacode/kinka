module.exports = function(source) {
  return process.env.NODE_ENV === 'production'
    ? source
        .replace(
          /(process.env.NODE_ENV === 'production')/g,
          +(process.env.NODE_ENV === 'production')
        )
        .replace(
          /(process.env.NODE_ENV !== 'production')/g,
          +(process.env.NODE_ENV !== 'production')
        )
    : source
}
