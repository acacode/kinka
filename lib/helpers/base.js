function merge() {
  var object = {}
  for (
    var args = Array.prototype.slice.call(arguments), x = 0;
    x < args.length;
    x++
  ) {
    if (isObject(args[x]))
      for (var attr in args[x]) object[attr] = args[x][attr]
  }
  return object
}

function isObject(value) {
  return value && typeof value === 'object'
}

function pick(object, keys) {
  var newObject = {}
  for (var x in keys) newObject[keys[x]] = object[keys[x]]
  return newObject
}

module.exports = {
  merge: merge,
  isObject: isObject,
  pick: pick,
}
