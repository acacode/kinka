function merge() {
  var obj3 = {}
  for (
    var args = Array.prototype.slice.call(arguments), x = 0;
    x < args.length;
    x++
  ) {
    if (typeof args[x] === 'object')
      for (var attr in args[x]) obj3[attr] = args[x][attr]
  }
  return obj3
}

function isObject(value) {
  return value && typeof value === 'object'
}

function pick(object, keys) {
  var obj = {}
  for (var x in keys) obj[keys[x]] = object[keys[x]]
  return obj
}

module.exports = {
  merge: merge,
  isObject: isObject,
  pick: pick,
}
