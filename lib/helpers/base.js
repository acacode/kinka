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

function isUndefined(value, defaultValue) {
  return value === undefined ? defaultValue : value
}

function valueIs(value, arrayOfTypeNames) {
  var stringifiedValue = ({}).toString.call(value) // eslint-disable-line prettier/prettier
  for(var i in arrayOfTypeNames){
    if()
  }
}

module.exports = {
  merge: merge,
  isObject: isObject,
  parseJSON: parseJSON,
  isUndefined: isUndefined,
  valueIs: valueIs,
}
