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
  /**
   * Internal helper for logging arguments in helpers
   *
   * @param {any} value
   * @param {string} type
   * @param {string} varName
   */
  ;(window || global).typeCheck = function(
    value,
    type,
    varName,
    checkOnExist,
    checkOnUndef
  ) {
    if (
      checkOnExist &&
      value &&
      (checkOnUndef && typeof value !== 'undefined')
    ) {
      var actualType = typeof value
      if (actualType !== type) {
        console.log(varName + ' should have type ' + type)
      }
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

  if (process.env.NODE_ENV !== 'production') {
    if (
      this.inspectors.request &&
      typeof this.inspectors.request !== 'function'
    ) {
      console.log('request inspector should be a function')
    }
    if (
      this.inspectors.response &&
      typeof this.inspectors.response !== 'function'
    ) {
      console.log('response inspector should be a function')
    }
    if (typeof this.instanceOptions.headers !== 'object') {
      console.log('headers in your kinka instance should be object')
    }
    if (typeof this.instanceOptions.timeout !== 'number') {
      console.log('timeout in your kinka instance should be timeout')
    }
    if (typeof this.instanceOptions.charset !== 'string') {
      console.log('charset in your kinka instance should be string')
    }
  }
  if (instanceOptions.auth) {
    this.auth = instanceOptions.auth

    if (process.env.NODE_ENV !== 'production') {
      if (typeof this.auth !== 'function') {
        console.log('auth mixin should be a function')
      }
    }
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
