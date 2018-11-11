var abortableRequests = {}
var baseURL

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

function createRequest(method, path, options) {
  var body, successStatus, abortableKey, isProtected, headers
  if (options && typeof options === 'object') {
    body = options.body
    successStatus = options.successStatus
    abortableKey = options.abortableKey
    isProtected = options.isProtected
    headers = options.headers
  }

  var request = abortableKey
    ? getAbortableRequest(abortableKey)
    : new XMLHttpRequest()
  return new Promise(resolve => {
    request.withCredentials = !!isProtected
    request.onreadystatechange = () => {
      switch (request.readyState) {
        case XMLHttpRequest.OPENED: {
          if (headers && typeof headers === 'object') {
            const headerNames = Object.keys(headers)
            for (var x = 0; x < headerNames.length; x++)
              request.setRequestHeader(headerNames[x], headers[headerNames[x]])
          }
          if (typeof body === 'object') {
            body = JSON.stringify(body)
          }
          request.send(body)
          break
        }
        case XMLHttpRequest.DONE: {
          const isError = !requestIsSuccess(request, successStatus)
          resolve(createResponse(request, isError))
          request = null
          if (abortableKey) {
            delete abortableRequests[abortableKey]
          }
          break
        }
      }
    }
    request.open(
      method.toUpperCase(),
      path.substring(0, 4) === 'http' ? path : `${baseURL}${path}`,
      true
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
    return createRequest('get', path, options)
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
    return createRequest('delete', path, options)
  },
  custom: function(method, path, options) {
    return createRequest(method, path, options)
  },
  create: function(options) {
    if (options.baseURL) baseURL = options.baseURL
    return kinka
  },
}

module.exports = kinka.create({
  baseURL: location.origin,
})
