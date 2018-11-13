const isObject = require('./base').isObject

var abortableRequests = {}

function getAbortableRequest(key) {
  if (abortableRequests[key]) {
    abortableRequests[key].abort()
    delete abortableRequests[key]
  }
  abortableRequests[key] = new XMLHttpRequest()
  return abortableRequests[key]
}

function removeAbortableKey(key) {
  abortableRequests[key] = null
  delete abortableRequests[key]
}

function requestIsSuccess(request, specificSuccessStatus) {
  return specificSuccessStatus
    ? request.status === specificSuccessStatus
    : request.status >= 200 && request.status < 300
}

function setHeaders(request, headers) {
  const headerNames = Object.keys(headers)
  for (var x = 0; x < headerNames.length; x++)
    request.setRequestHeader(headerNames[x], headers[headerNames[x]])
}

function getUrlWithQuery(url, query) {
  var parsed = url.split('?')
  var rawUrl = parsed[0]
  var queryString = parsed[1] ? [parsed[1]] : []
  var keys = Object.keys(query)
  keys.forEach(function(key) {
    queryString.push(key + '=' + query[key])
  })
  return rawUrl + '?' + queryString.join('&')
}

function getUrl(path, baseURL, query) {
  var url = path.substring(0, 4) === 'http' ? path : baseURL + path
  if (!query) return url
  return getUrlWithQuery(url, query)
}

function prepareBody(body) {
  if (!isObject(body) || body instanceof FormData) return body
  return JSON.stringify(body)
}

module.exports = {
  getAbortableRequest: getAbortableRequest,
  requestIsSuccess: requestIsSuccess,
  setHeaders: setHeaders,
  getUrl: getUrl,
  removeAbortableKey: removeAbortableKey,
  prepareBody: prepareBody,
}
