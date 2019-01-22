module.exports = function(source) {
  const isDevCodeStarted = line =>
    new RegExp('(// <dev-version-code>)', 'g').test(line)
  const isDevCodeEnded = line =>
    new RegExp('(// </dev-version-code>)', 'g').test(line)
  const prodSource = source
    .replace(/typeCheck\([\w\r\n., '[\]+]+\)/g, '')
    .replace(/emptyCheck\([\w\r\n., '[\]+]+\)/g, '')
  return prodSource
    .split('\n')
    .reduce(
      ({ lines, isDevCode }, line) => {
        isDevCode = isDevCode || isDevCodeStarted(line)
        lines.push((isDevCode ? '// ' : '') + line)
        return {
          lines,
          isDevCode: isDevCode && isDevCodeEnded(line) ? false : isDevCode,
        }
      },
      { lines: [], isDevCode: false }
    )
    .lines.join('\n')
}
