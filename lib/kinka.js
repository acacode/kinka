/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

var abortableRequests = {}
var baseURL
var useReject

function parseRequestData(stringifiedData) {
  try {
    const data = JSON.parse(stringifiedData)
    return data
  } catch (e) {
    return stringifiedData
  }
}

function requestIsSuccess(request, specificSuccessStatus) {
  return specificSuccessStatus
    ? request.status === specificSuccessStatus
    : request.status >= 200 && request.status < 300
}

function createResponse(request, isError) {
  return {
    status: request.status,
    data:
      request.responseText !== undefined && !isError
        ? parseRequestData(request.responseText)
        : undefined,
    errorMessage: isError
      ? parseRequestData(request.responseText)
      : request.statusText,
    isError: !!isError,
    isSuccess: !isError,
  }
}

function getAbortableRequest(key) {
  if (abortableRequests[key]) {
    abortableRequests[key].abort()
    delete abortableRequests[key]
  }
  abortableRequests[key] = new XMLHttpRequest()
  return abortableRequests[key]
}

function patchHeaders(request, headers) {
  const headerNames = Object.keys(headers)
  for (var x = 0; x < headerNames.length; x++)
    request.setRequestHeader(headerNames[x], headers[headerNames[x]])
}
function isObject(value) {
  return value && typeof value === 'object'
}
function getUrl(path, query) {
  var url = path.substring(0, 4) === 'http' ? path : baseURL + path
  if (!query) return url
  var parsed = url.split('?')
  var rawUrl = parsed[0]
  var queryString = parsed[1] ? [parsed[1]] : []
  var keys = Object.keys(query)
  keys.forEach(function(key) {
    queryString.push(key + '=' + query[key])
  })
  return rawUrl + '?' + queryString.join('&')
}

function createRequest(method, path, options) {
  var request = options.abortableKey
    ? getAbortableRequest(options.abortableKey)
    : new XMLHttpRequest()
  return new Promise(function(resolve, reject) {
    request.withCredentials = !!options.isProtected
    request.onreadystatechange = function() {
      switch (request.readyState) {
        case XMLHttpRequest.DONE: {
          var isError = !requestIsSuccess(request, options.successStatus)
          var response = createResponse(request, isError)
          if ((useReject || options.useReject) && isError) reject(response)
          else resolve(response)
          request = null
          if (options.abortableKey) {
            delete abortableRequests[options.abortableKey]
          }
          break
        }
        default:
          break
      }
    }
    request.open(method.toUpperCase(), getUrl(path, options.query), true)
    if (isObject(options.headers)) {
      patchHeaders(request, options.headers)
    }
    request.send(
      isObject(options.body) ? JSON.stringify(options.body) : options.body
    )
  })
}

function merge(options, commonOptions) {
  options = options || {}
  var keys = Object.keys(commonOptions)
  for (var x = 0; x < keys.length; x++) {
    options[keys[x]] = commonOptions[keys[x]]
  }
  return options
}

var kinka = {
  get: function(path, options) {
    return createRequest('get', path, options || {})
  },
  post: function(path, body, options) {
    return createRequest('post', path, merge(options, { body: body }))
  },
  put: function(path, body, options) {
    return createRequest('put', path, merge(options, { body: body }))
  },
  patсh: function(path, body, options) {
    return createRequest('patсh', path, merge(options, { body: body }))
  },
  delete: function(path, options) {
    return createRequest('delete', path, options || {})
  },
  custom: function(method, path, options) {
    return createRequest(method, path, options || {})
  },
  create: function(options) {
    if (options.baseURL) baseURL = options.baseURL
    if (options.useReject) useReject = options.useReject
    return kinka
  },
}

module.exports = kinka.create({
  baseURL: location.origin,
})
