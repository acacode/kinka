var baseHelpers = require('./base')
var createResponse = require('./response').createResponse

var isObject = baseHelpers.isObject
var merge = baseHelpers.merge

var abortableRequests = {}

function abortRequest(key) {
  if (abortableRequests[key]) {
    abortableRequests[key].abort()
    removeAbortableKey(key)
  }
}

function getAbortableRequest(key) {
  abortRequest(key)
  abortableRequests[key] = new XMLHttpRequest()
  return abortableRequests[key]
}

function removeAbortableKey(key) {
  abortableRequests[key] = null
  delete abortableRequests[key]
}

function requestIsSuccess(request, specificSuccessStatus) {
  var status = request.status
  return specificSuccessStatus
    ? status === specificSuccessStatus
    : (status >= 200 && status < 300) || status === 101
}

function setHeaders(request, headers) {
  var headerNames = Object.keys(headers)
  for (var x = 0; x < headerNames.length; x++)
    request.setRequestHeader(headerNames[x], headers[headerNames[x]])
}

function getUrlWithQuery(url, query) {
  var parsed = url.split('?')
  var rawUrl = parsed[0]
  var queryString = parsed[1] ? [parsed[1]] : []
  Object.keys(query).forEach(function(key) {
    queryString.push(key + '=' + encodeURIComponent(query[key]))
  })
  return rawUrl + '?' + queryString.join('&')
}

function getUrl(path, baseURL, query) {
  var protocol = path.slice(0, 4)
  var url =
    protocol === 'http' ||
    protocol.indexOf('ws') !== -1 ||
    protocol.indexOf('//') !== -1
      ? path
      : baseURL + path
  return query ? getUrlWithQuery(url, query) : url
}

function createRequest(method, path, requestOptions, requestData) {
  var requestInspector = this.inspectors.request
  var responseInspector = this.inspectors.response
  var options = merge(
    this.instanceOptions,
    requestOptions,
    requestOptions &&
      this.auth &&
      requestOptions.auth &&
      this.auth(requestOptions.auth)
  )
  if (requestData) {
    options.data = requestData
  }
  if (requestInspector) {
    options =
      requestInspector(
        getUrl(path, this.baseURL, options.query),
        method,
        options
      ) || options
  }
  var abortableKey = options.abortableKey
  var data = options.data
  var body =
    !isObject(data) || data instanceof FormData ? data : JSON.stringify(data)
  var url = getUrl(path, this.baseURL, options.query)
  var request = abortableKey
    ? getAbortableRequest(abortableKey)
    : new XMLHttpRequest()
  return new Promise(function(resolve, reject) {
    request.withCredentials = !!options.withAuth
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        var isError = !requestIsSuccess(request, options.successStatus)
        var response = createResponse(request, isError)
        if (responseInspector) {
          response = responseInspector(url, method, response) || response
        }
        if (!options.omitCatches && isError) reject(response)
        else resolve(response)
        request = null
        if (abortableKey) removeAbortableKey(abortableKey)
      }
    }
    request.open(method.toUpperCase(), url, true)
    request.timeout = options.timeout
    if (isObject(options.headers)) setHeaders(request, options.headers)
    request.send(body)
  })
}

module.exports = {
  createRequest: createRequest,
  abortRequest: abortRequest,
}
