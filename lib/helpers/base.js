if (!ArrayBuffer.isView) {
  ArrayBuffer.isView = function(data) {
    return (
      data !== null &&
      typeof data === 'object' &&
      data.buffer instanceof ArrayBuffer
    )
  }
}

function merge() {
  var object = {}
  for (var args = [].slice.call(arguments), x = 0; x < args.length; x++) {
    if (isObject(args[x]))
      for (var attr in args[x]) {
        var value = args[x][attr]
        object[attr] = isObject(value) ? merge(object[attr], value) : value
      }
  }
  return object
}

function isObject(value) {
  return value !== null && typeof value === 'object'
}

function parseJSON(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

function parseUrlEncodedForm(data) {
  var decoder = decodeURIComponent
  const obj = {}
  const pairs = data.split('&')
  let pair
  let pos

  for (let i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i]
    pos = pair.indexOf('=')
    if (pos === -1) {
      obj[decoder(pair)] = ''
    } else {
      obj[decoder(pair.slice(0, pos))] = decoder(pair.slice(pos + 1))
    }
  }

  return obj
}

function isUndefined(value, defaultValue) {
  return value === undefined ? defaultValue : value
}

function valueIs(value, arrayOfTypeNames) {
  // eslint-disable-next-line prettier/prettier
  var stringifiedValue = ({}).toString.call(value).replace(/object|[ [\]]/g, '')
  return includes(arrayOfTypeNames, stringifiedValue)
}

function includes(value, includedValue) {
  return value.indexOf(includedValue) > -1
}

module.exports = {
  merge: merge,
  isObject: isObject,
  parseJSON: parseJSON,
  isUndefined: isUndefined,
  valueIs: valueIs,
  parseUrlEncodedForm: parseUrlEncodedForm,
  includes: includes,
}
