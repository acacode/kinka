function parseResponseData(stringifiedData) {
  try {
    const data = JSON.parse(stringifiedData)
    return data
  } catch (e) {
    return stringifiedData
  }
}

function createResponse(request, isError) {
  return {
    status: request.status,
    data:
      request.responseText !== undefined && !isError
        ? parseResponseData(request.responseText)
        : undefined,
    err: isError ? parseResponseData(request.responseText) : undefined,
    isError: !!isError,
    isSuccess: !isError,
    type: request.responseType,
    response: request.response,
    headers: getHeaders(request),
  }
}

function getHeaders(request) {
  return request
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/)
    .reduce(function(headers, line) {
      var parts = line.split(': ')
      var header = parts.shift()
      var value = parts.join(': ')
      headers[header] = value
      return headers
    }, {})
}

module.exports = {
  createResponse: createResponse,
}
