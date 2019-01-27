/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

var helpers = require('./helpers')
var isUndefined = helpers.isUndefined

// <non-promise>
if (process.env.EXCLUDE_PROMISES) {
  require('./promise')
}
// </non-promise>

// <dev-code>
if (process.env.NODE_ENV !== 'production') {
  var globalObject = typeof global !== 'undefined' ? global : window
  /**
   * Internal helper for logging arguments in helpers
   *
   *
   * Is exist only in development build (dist/kinka.js)
   *
   * @param {any} value
   * @param {string} type
   * @param {string} varName
   */
  globalObject.typeCheck = function(value, type, varName, checkOnUndef) {
    function validateType() {
      var actualType = typeof value
      switch (type) {
        case 'array': {
          return !(value instanceof Array)
        }
        case 'object': {
          return value === null || value instanceof Array || actualType !== type
        }
        default: {
          return actualType !== type
        }
      }
    }
    if (!checkOnUndef || typeof value !== 'undefined') {
      if (validateType()) {
        console.warn('[kinka warning] ' + varName + ' should have type ' + type)
      }
    }
  }
  globalObject.emptyCheck = function(value, varName) {
    var isString = typeof value === 'string'
    var isObject = typeof value === 'object'
    if (
      typeof value !== 'undefined' &&
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
}
// </dev-code>

/**
 * Create new instance of Kinka
 * which will have own instance options
 *
 *
 * default kinka instance options:
 * {
 *  omitCatches: true,
 *  headers: {},
 *  timeout: 0,
 *  charset: 'utf-8',
 * }
 *
 * @class
 * @param {object?} config Configuration of your api (See documentation: https://github.com/acacode/kinka/blob/master/docs/documentation.md)
 * @param {boolean?} config.omitCatches Enable/Disable catching your request (See documentation)
 * @param {boolean?} config.credentials Sets the withCredentials flag for each requests
 * @param {function?} config.auth Attach the auth mixin (See documentation)
 * @param {number?} config.timeout Sets the timeout for each request
 * @param {object?} config.headers Sets the request headers for each request created via api.
 * @param {object?} config.inspectors Sets the inspectors (See documentation)
 * @param {string?} config.baseURL Sets the base url address for api.
 * @param {string?} config.charset Sets the charset
 * @param {string[]?} config.customMethods Sets the custom methods for api.
 */
function createInstance(config) {
  typeCheck(config, 'object', 'instance options', true)
  if (!config) config = {}

  typeCheck(
    config.inspectors,
    'object',
    'inspectors for your kinka instance',
    true
  )
  typeCheck(config.baseURL, 'string', 'baseURL', true)

  var customMethods = config.customMethods

  var instance = {
    abort: helpers.abortRequest,
    all: Promise.all,
    create: createInstance,
    baseURL: config.baseURL || (location && location.origin) || '',
    clone: createInstance.bind(null, config),
    config: {
      credentials: !!config.credentials,
      omitCatches: isUndefined(config.omitCatches, true),
      headers: isUndefined(config.headers, {}),
      timeout: isUndefined(config.timeout, 0),
      charset: isUndefined(config.charset, 'utf-8'),
    },
    inspectors: config.inspectors || {},
  }

  var methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

  if (customMethods) {
    typeCheck(
      customMethods,
      'array',
      'option "customMethods" in your kinka instance'
    )
    methods.push.apply(methods, customMethods)
  }

  instance.custom = helpers.createRequest.bind(instance)

  for (var x in methods) {
    var method = methods[x]
    typeCheck(
      method,
      'string',
      'custom method with name "' +
        method +
        '" in your kinka instance option customMethods'
    )
    if (!instance[method])
      instance[method] = helpers.createRequest.bind(instance, method)
  }

  if (config.auth) {
    typeCheck(config.auth, 'function', 'auth mixin')
    instance.auth = config.auth.bind(instance)
  }

  typeCheck(instance.inspectors.request, 'function', 'request inspector', true)
  typeCheck(
    instance.inspectors.response,
    'function',
    'response inspector',
    true
  )
  typeCheck(
    instance.config.headers,
    'object',
    'headers in your kinka instance',
    true
  )
  typeCheck(instance.config.timeout, 'number', 'timeout in your kinka instance')
  typeCheck(instance.config.charset, 'string', 'charset in your kinka instance')

  return instance
}

var kinka = createInstance()

if (window) {
  window.kinka = kinka
}

module.exports = kinka
