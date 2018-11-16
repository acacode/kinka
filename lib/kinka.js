/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var baseHelpers = require('./helpers/base')
var createRequest = require('./helpers/request').createRequest

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
  return this
}

function createMethodHandler(methodName, hasBody) {
  return function(path, arg1, arg2) {
    var config = hasBody ? [arg2, arg1] : [arg1]
    return this.custom(methodName, path, config[0], config[1])
  }
}

Kinka.prototype = {
  get: createMethodHandler('get'),
  options: createMethodHandler('options'),
  head: createMethodHandler('head'),
  post: createMethodHandler('post', true),
  put: createMethodHandler('put', true),
  patch: createMethodHandler('patch', true),
  delete: createMethodHandler('delete'),
  all: Promise.all,
  custom: createRequest,
  create: Kinka,
}

module.exports = window.kinka = new Kinka()
