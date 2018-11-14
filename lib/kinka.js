/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
const baseHelpers = require('./helpers/base')
const requestHelpers = require('./helpers/request')
const responseHelpers = require('./helpers/response')

var isObject = baseHelpers.isObject
var merge = baseHelpers.merge

var requestIsSuccess = requestHelpers.requestIsSuccess
var getAbortableRequest = requestHelpers.getAbortableRequest
var removeAbortableKey = requestHelpers.removeAbortableKey
var setHeaders = requestHelpers.setHeaders
var getUrl = requestHelpers.getUrl
var prepareBody = requestHelpers.prepareBody

var createResponse = responseHelpers.createResponse

const defaultOptions = {
  baseURL: location.origin,
  omitCatches: true,
}

function createRequest(method, path, options) {
  var request = options.abortableKey
    ? getAbortableRequest(options.abortableKey)
    : new XMLHttpRequest()
  return new Promise(function(resolve, reject) {
    request.withCredentials = !!options.withAuth
    request.onreadystatechange = function() {
      switch (request.readyState) {
        case XMLHttpRequest.DONE: {
          var isError = !requestIsSuccess(request, options.successStatus)
          var response = createResponse(request, isError)
          if (!options.omitCatches && isError) reject(response)
          else resolve(response)
          request = null
          if (options.abortableKey) removeAbortableKey(options.abortableKey)
          break
        }
        default:
          break
      }
    }
    request.open(
      method.toUpperCase(),
      getUrl(path, options.baseURL, options.query),
      true
    )
    if (isObject(options.headers)) setHeaders(request, options.headers)
    request.send(prepareBody(options.body))
  })
}

function Kinka(instanceOptions) {
  this.options = merge(defaultOptions, instanceOptions)
  var customMethods = this.options.customMethods
  if (customMethods)
    for (var i in customMethods)
      this[customMethods[i]] = createMethodHandler(customMethods[i])
}

function createMethodHandler(methodName) {
  return function(path, options) {
    return createRequest(methodName, path, merge(this.options, options))
  }
}
function createMethodBodyHandler(methodName) {
  return function(path, body, options) {
    var requestOptions = merge(this.options, options, { body: body })
    return createRequest(methodName, path, requestOptions)
  }
}

Kinka.prototype.get = createMethodHandler('get')
Kinka.prototype.options = createMethodHandler('options')
Kinka.prototype.head = createMethodHandler('head')
Kinka.prototype.post = createMethodBodyHandler('post')
Kinka.prototype.put = createMethodBodyHandler('put')
Kinka.prototype.patсh = createMethodBodyHandler('patch')
Kinka.prototype.delete = createMethodHandler('delete')
Kinka.prototype.custom = function(method, path, options) {
  return createRequest(method, path, merge(this.options, options))
}
Kinka.prototype.create = function(options) {
  return new Kinka(options)
}

module.exports = window.kinka = new Kinka()
