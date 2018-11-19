/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var baseHelpers = require('./helpers/base')
var requestHelpers = require('./helpers/request')
var isUndefined = baseHelpers.isUndefined

function Kinka(instanceOptions) {
  if (!(this instanceof Kinka)) {
    return new Kinka(instanceOptions)
  }
  if (!instanceOptions) instanceOptions = {}
  var customMethods = instanceOptions.customMethods
  this.baseURL = isUndefined(
    instanceOptions.baseURL,
    location ? location.origin : ''
  )
  this.options = {
    omitCatches: isUndefined(instanceOptions.omitCatches, true),
    headers: isUndefined(instanceOptions.headers, {}),
    timeout: isUndefined(instanceOptions.timeout, 0),
  }
  if (customMethods)
    for (var i in customMethods)
      this[customMethods[i]] = createMethodHandler(customMethods[i])
  this.inspectors = instanceOptions.inspectors || {}
  if (instanceOptions.auth) this.auth = instanceOptions.auth
  return this
}

function createMethodHandler(methodName, hasBody) {
  return function(path, arg1, arg2) {
    var config = hasBody ? [arg2, arg1] : [arg1]
    return this.custom(methodName, path, config[0], config[1])
  }
}

Kinka.prototype = {
  abort: requestHelpers.abortRequest,
  all: Promise.all,
  create: Kinka,
  custom: requestHelpers.createRequest,
  delete: createMethodHandler('delete'),
  get: createMethodHandler('get'),
  head: createMethodHandler('head'),
  options: createMethodHandler('options'),
  patch: createMethodHandler('patch', true),
  post: createMethodHandler('post', true),
  put: createMethodHandler('put', true),
}

module.exports = window.kinka = new Kinka()
