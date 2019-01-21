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

if (process.env.NODE_ENV !== 'production') {
  console.log('FIRREEEDD')
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
  globalObject.typeCheck = function(
    value,
    type,
    varName,
    checkOnExist,
    checkOnUndef
  ) {
    var isExist = !checkOnExist || value
    var isDefined = !checkOnUndef || typeof value !== 'undefined'
    if (isExist && isDefined) {
      var actualType = typeof value
      if (actualType !== type) {
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

/**
 * Create new instance of Kinka
 * which will have own instance options
 * @class
 * @param {object} instanceOptions
 * default kinka instance options:
 * {
 *  omitCatches: true,
 *  headers: {},
 *  timeout: 0,
 *  charset: 'utf-8',
 * }
 */
function Kinka(instanceOptions) {
  if (!instanceOptions) instanceOptions = {}
  var customMethods = instanceOptions.customMethods
  this.baseURL = instanceOptions.baseURL || (location && location.origin) || ''
  typeCheck(instanceOptions.baseURL, 'string', 'baseURL', false, true)
  this.instanceOptions = {
    omitCatches: isUndefined(instanceOptions.omitCatches, true),
    headers: isUndefined(instanceOptions.headers, {}),
    timeout: isUndefined(instanceOptions.timeout, 0),
    charset: isUndefined(instanceOptions.charset, 'utf-8'),
  }
  if (customMethods)
    for (var i in customMethods)
      this[customMethods[i]] = createMethodHandler(customMethods[i])
  this.inspectors = instanceOptions.inspectors || {}

  typeCheck(this.inspectors.request, 'function', 'request inspector', true)
  typeCheck(this.inspectors.response, 'function', 'response inspector', true)
  typeCheck(
    this.instanceOptions.headers,
    'object',
    'headers in your kinka instance'
  )
  typeCheck(
    this.instanceOptions.timeout,
    'number',
    'timeout in your kinka instance'
  )
  typeCheck(
    this.instanceOptions.charset,
    'string',
    'charset in your kinka instance'
  )
  if (instanceOptions.auth) {
    this.auth = instanceOptions.auth
    typeCheck(this.auth, 'function', 'auth mixin')
  }
}

function createMethodHandler(methodName, hasBody) {
  return function(path, optionsOrData, data) {
    var config = hasBody ? [data, optionsOrData] : [optionsOrData]
    return this.custom(methodName, path, config[0], config[1])
  }
}

Kinka.prototype = {
  abort: helpers.abortRequest,
  all: Promise.all,
  create: function(instanceOptions) {
    typeCheck(instanceOptions, 'object', 'instanceOptions', false, true)
    return new Kinka(instanceOptions)
  },
  custom: helpers.createRequest,
  delete: createMethodHandler('delete'),
  get: createMethodHandler('get'),
  head: createMethodHandler('head'),
  options: createMethodHandler('options'),
  patch: createMethodHandler('patch', true),
  post: createMethodHandler('post', true),
  put: createMethodHandler('put', true),
}

var kinka = new Kinka()

if (window) {
  window.kinka = kinka
}

module.exports = kinka
