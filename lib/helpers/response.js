function parseResponseData(stringifiedData) {
  try {
    const data = JSON.parse(stringifiedData)
    return data
  } catch (e) {
    return stringifiedData
  }
}

function createResponse(request, isError) {
  var data = request.responseText
  return {
    status: request.status,
    data: data !== undefined && !isError ? parseResponseData(data) : undefined,
    err: isError ? parseResponseData(data) : undefined,
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
      var chars = ': '
      var parts = line.split(chars)
      headers[parts.shift()] = parts.join(chars)
      return headers
    }, {})
}

module.exports = {
  createResponse: createResponse,
}
