const getOptions = require('loader-utils').getOptions

module.exports = function(source) {
  const isExcludePromises = !!getOptions(this)['exclude-promises']
  const commitBlockName = isExcludePromises ? 'promise' : 'non-promise'
  const commentCodeStarted = line =>
    new RegExp('(// <' + commitBlockName + '>)', 'g').test(line)
  const commentCodeEnded = line =>
    new RegExp('(// </' + commitBlockName + '>)', 'g').test(line)

  const result = source
    .replace(/(process.env.EXCLUDE_PROMISES)/g, +isExcludePromises)
    .split('\n')
    .reduce(
      ({ lines, isNeedToComment }, line) => {
        isNeedToComment = isNeedToComment || commentCodeStarted(line)
        lines.push((isNeedToComment ? '// ' : '') + line)
        return {
          lines,
          isNeedToComment:
            isNeedToComment && commentCodeEnded(line) ? false : isNeedToComment,
        }
      },
      { lines: [], isNeedToComment: false }
    )
    .lines.join('\n')
  // console.warn(process.env.EXCLUDE_PROMISES, process.env.NODE_ENV)
  // console.log(result)
  return result
}
