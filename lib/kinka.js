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

var DEFAULT_CHARSET = 'utf-8'

/**
 * Create new instance of Kinka
 * which will have own instance options
 * @class
 * @param {object} instanceOptions
 */
function Kinka(instanceOptions) {
  if (!instanceOptions) instanceOptions = {}
  var customMethods = instanceOptions.customMethods
  this.baseURL = instanceOptions.baseURL || (location && location.origin) || ''
  this.instanceOptions = {
    omitCatches: isUndefined(instanceOptions.omitCatches, true),
    headers: isUndefined(instanceOptions.headers, {}),
    timeout: isUndefined(instanceOptions.timeout, 0),
    charset: isUndefined(instanceOptions.charset, DEFAULT_CHARSET),
  }
  if (customMethods)
    for (var i in customMethods)
      this[customMethods[i]] = createMethodHandler(customMethods[i])
  this.inspectors = instanceOptions.inspectors || {}
  if (instanceOptions.auth) this.auth = instanceOptions.auth
}

function createMethodHandler(methodName, hasBody) {
  return function(path, optionsOrData, data) {
    var config = hasBody ? [data, optionsOrData] : [optionsOrData]
    return this.custom(methodName, path, config[0], config[1])
  }
}

var kinkaPrototype = {
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

Kinka.prototype = kinkaPrototype

var kinka = new Kinka()

if (window) {
  window.kinka = kinka
}

module.exports = kinka
