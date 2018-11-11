let abortableRequests = {}
let baseURL

const parseRequestData = stringifiedData => {
  try {
    const data = JSON.parse(stringifiedData)
    return data
  } catch (e) {
    return stringifiedData
  }
}

const requestIsSuccess = (request, specificSuccessStatus) =>
  specificSuccessStatus
    ? request.status === specificSuccessStatus
    : request.status >= 200 && request.status < 300

const createResponse = ({ status, responseText, statusText }, isError) => {
  return {
    status,
    data:
      responseText !== undefined && !isError
        ? parseRequestData(responseText)
        : null,
    errorMessage: isError ? parseRequestData(responseText) : statusText,
    isError: !!isError,
    isSuccess: !isError,
  }
}

const createRequest = (
  method,
  path,
  { body, successStatus, abortableKey, isProtected, headers } = {}
) => {
  let request = new XMLHttpRequest()
  if (abortableKey) {
    if (abortableRequests[abortableKey]) {
      abortableRequests[abortableKey].abort()
      delete abortableRequests[abortableKey]
    }
    abortableRequests[abortableKey] = request
  }
  return new Promise(resolve => {
    request.withCredentials = !!isProtected
    request.onreadystatechange = () => {
      switch (request.readyState) {
        case XMLHttpRequest.OPENED: {
          if (headers && typeof headers === 'object') {
            const headerNames = Object.keys(headers)
            for (let x = 0; x < headerNames.length; x++)
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

const kinka = {
  get: (path, options) => createRequest('get', path, options),
  post: (path, body, options) =>
    createRequest('post', path, { ...options, body }),
  put: (path, body, options) =>
    createRequest('put', path, { ...options, body }),
  patсh: (path, body, options) =>
    createRequest('patсh', path, { ...options, body }),
  delete: (path, options) => createRequest('delete', path, options),
  custom: (method, path, options) => createRequest(method, path, options),
  create: options => {
    if (options.baseURL) baseURL = options.baseURL
    return kinka
  },
}

export default kinka.create({
  baseURL: location.origin,
})
