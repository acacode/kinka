/** **********************************************************************/
/*                              base helpers                             */
/** **********************************************************************/

export function typeCheck(value, expectedType, varName, checkOnUndef) {
  if (!checkOnUndef || typeof value !== 'undefined') {
    var actualType = typeof value
    const typeIsInvalid =
      (expectedType === 'array' && !(value instanceof Array)) ||
      (expectedType === 'object' &&
        (value === null ||
          value instanceof Array ||
          actualType !== expectedType)) ||
      actualType !== expectedType
    if (typeIsInvalid) {
      console.warn(
        '[kinka warning] ' + varName + ' should have type ' + expectedType
      )
    }
  }
}

export function emptyCheck(value, varName) {
  const valueType = typeof value
  var isString = valueType === 'string'
  var isObject = valueType === 'object'
  if (
    valueType !== 'undefined' &&
    (isObject ? value === null || !Object.keys(value).length : !value)
  ) {
    console.warn(
      '[kinka warning] ' +
        varName +
        ' should not ' +
        (isString || isObject ? 'be empty' : 'have falsy value')
    )
  }
}

/**
 * Merge all objects into one object
 *
 *
 * @param {...object[]} objects - array of objects which needed for merge together
 * @returns {object} merged all argument objects into one object
 */
export function merge() {
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

/**
 * Check type of value on object type
 *
 *
 * returns true if value have type object otherwise false
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isObject(value) {
  return value !== null && typeof value === 'object'
}

/**
 * Try to parse string and returns parsed object
 * otherwise return first arguments
 *
 * @param {string|any} data
 * @returns {object|any}
 */
export function parseJSON(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

/**
 * Check value on undefined
 *
 *
 * if value is undefined returns default value (second argument)
 * otherwise return value
 *
 * @param {any} value
 * @param {any} defaultValue
 * @returns {any}
 */
export function isUndefined(value, defaultValue) {
  return typeof value === 'undefined' ? defaultValue : value
}

/**
 * Check value on type which contains in arrayOfTypeNames
 *
 *
 * Examples:
 * valueIs('example', ['String']) -> true
 * valueIs({}, ['String', 'Number']) -> false
 *
 * @param {any} value
 * @param {string[]} arrayOfTypeNames
 * @returns {boolean} true/false
 */
export function valueIs(value, arrayOfTypeNames) {
  return includes(
    arrayOfTypeNames,
    {}.toString.call(value).replace(/object|[ [\]]/g, '')
  )
}

/**
 * Check string or array on contains includedValue
 * It is polyfill for {string|array}.includes(value)
 * 'cause string.includes method is not supported in IE11-
 *
 *
 * Example:
 * includes('abc', 'a') -> true
 * includes([1,2,3,4], 3) -> true
 *
 * @param {string|array} value
 * @param {any} includedValue
 * @returns {boolean} true if includedValue contains in value otherwise false
 */
export function includes(value, includedValue) {
  return value.indexOf(includedValue) > -1
}
