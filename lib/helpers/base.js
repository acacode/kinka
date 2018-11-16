function merge() {
  var object = {}
  for (
    var args = Array.prototype.slice.call(arguments), x = 0;
    x < args.length;
    x++
  ) {
    if (isObject(args[x]))
      for (var attr in args[x]) {
        var value = args[x][attr]
        object[attr] = isObject(value) ? merge(object[attr], value) : value
      }
  }
  return object
}

function isObject(value) {
  return value && typeof value === 'object'
}

// function pick(object, keys) {
//   var newObject = {}
//   for (var x in keys) newObject[keys[x]] = object[keys[x]]
//   return newObject
// }

function parseJSON(stringifiedData) {
  try {
    return JSON.parse(stringifiedData)
  } catch (e) {
    return stringifiedData
  }
}

function isUndefined(value, defaultValue) {
  return value === undefined ? defaultValue : value
}

module.exports = {
  merge: merge,
  isObject: isObject,
  // pick: pick,
  parseJSON: parseJSON,
  isUndefined: isUndefined,
}
