module.exports = function(source) {
  const prodSource = source
    .replace(/typeCheck\([\w\r\n., '[\]+]+\)/g, '')
    .replace(
      new RegExp('(// <non-prod-code>)[^]*(// </non-prod-code>)', 'g'),
      ''
    )
    .replace(/emptyCheck\([\w\r\n., '[\]+]+\)/g, '')
  if (
    prodSource.indexOf('typeCheck') > -1 ||
    prodSource.indexOf('emptyCheck') > -1
  ) {
    console.log('see source ', prodSource)
    throw Error(
      'Occured an error linked with removing typeCheck and emptyCheck function from source file'
    )
  }
  return prodSource
}
