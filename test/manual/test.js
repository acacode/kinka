/* global kinka */

var logsEl = document.querySelector('.logs')
var header = document.querySelector('header')
var templateName = header.innerText
var failed = 0
var succeeded = 0

// stringified html element
function el(query, childs) {
  var parsed = query.split('.')
  var tag = parsed[0]
  var className = parsed.slice(1).join(' ')
  var elem =
    '<' +
    tag +
    (className ? ' class="' + className + '"' : '') +
    '>' +
    (childs && childs.length
      ? childs
          .filter(function(child) {
            return !!child
          })
          .join('')
      : '') +
    '</' +
    tag +
    '>'
  // var elem = document[
  //   tag.indexOf('text') > -1 ? 'createTextNode' : 'createElement'
  // ](tag.replace('text?'))
  // if (className) {
  //   elem.classList.add(className)
  // }
  // if (childs && childs.length) {
  //   childs.forEach(element => {
  //     elem.appendChild(element)
  //   })
  // }
  return elem
}

function createResponse(response, isFailed) {
  return el('details.response', [
    el('summary', ['log (' + (isFailed ? 'failed' : 'succeeded') + ')']),
    el('div.response-data-map', [
      Object.keys(response)
        .map(function(key) {
          return el('div', [
            el('span.key', [key]),
            ' : ',
            JSON.stringify(response[key]),
          ])
        })
        .join(''),
    ]),
  ])
}

function renderLog(title, isNegative, log, description) {
  var logEl = document.createElement('div')
  var className = isNegative ? 'red' : 'green'
  if (isNegative) {
    failed++
  } else succeeded++
  header.innerHTML =
    templateName +
    ' ( ' +
    el('span.green', ['positive: ' + succeeded]) +
    ' | ' +
    el('span.red', ['negative: ' + failed]) +
    ' ) '
  logEl.className = ['log', className].join(' ')
  logEl.innerHTML =
    el('p', [title, description && el('span.description', [description])]) +
    (typeof log === 'object' ? createResponse(log, isNegative) : log)
  logsEl.appendChild(logEl)
}

function responseHandler(description) {
  return function renderResponse(response) {
    renderLog(
      response.url,
      response.err,
      createResponse(response, response.err),
      description
    )
  }
}

// requests

function logger(apiName, responseHandler) {
  return function log(message) {
    var logMessage =
      'api name : ' +
      el('span.grey', [apiName || 'kinka']) +
      '; ' +
      (message ? ' message : ' + el('span.grey', [message]) : '')
    return responseHandler ? responseHandler(logMessage) : logMessage
  }
}

;(function test1() {
  var api = kinka.create({
    baseURL: 'https://reqres.in/api',
  })
  var log = logger('testApi1', responseHandler)
  api.get('/users', { query: { page: 1 } }).then(log())
  api.get('https://google.com/bad-request').then(log())
  api
    .get('/users', { query: { page: 3 }, cancelToken: '/users-req' })
    .then(
      log(
        'Should be canceled because it have "cancelToken" and was created newest request with the same cancel token'
      )
    )
  api
    .get('/users', { query: { page: 3 }, cancelToken: '/users-req' })
    .then(log())
  api.post('/register', { email: 'sydney@fife' }).then(log('should have error'))
})()
;(function test2() {
  var api = kinka.create({
    baseURL: 'https://reqres.in/api',
    omitCatches: false,
  })
  var log = logger('testApi2', responseHandler)
  api
    .get('https://google.com/bad-request')
    .catch(log('request with using falsy omitCatches'))
  api
    .get('/users', { query: { page: 3 }, cancelToken: '/users-req' })
    .catch(
      log(
        'request with using falsy omitCatches.' +
          'Should be canceled because it have "cancelToken" and was created newest request with the same cancel token'
      )
    )
  api
    .get('/users', { query: { page: 3 }, cancelToken: '/users-req' })
    .then(log('request with using falsy omitCatches'))
  api
    .post('/users', {
      username: 'vasya',
      creationDate: new Date(),
    })
    .then(log('post request should return 201'))
  api
    .post(
      '/users',
      {
        username: 'vasya',
        creationDate: new Date(),
      },
      { successStatus: 200 }
    )
    .catch(log('post request should be catched (successStatus)'))
})()
;(function nonApi() {
  var log = logger()
  try {
    var get = kinka.get
    get('https://google.com/all')
      .then(responseHandler(log()))
      .catch(responseHandler(log()))
  } catch (e) {
    renderLog(log('var get = kinka.get exception', true, e))
  }
})()
;(function api3() {
  var log = logger('testApi3')
  var api = kinka.create({
    baseURL: 'https://reqres.in/api',
    inspectors: {
      request: function(url, method, options) {
        renderLog('', false, options, log('request inspector'))
      },
    },
  })
  api.get('/all').then(responseHandler(log()))
})()
