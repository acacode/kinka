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
    el('summary', ['response (' + (isFailed ? 'failed' : 'succeeded') + ')']),
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
    el('p', [title, description && el('span.description', [description])]) + log
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

var api1 = kinka.create({
  baseURL: 'https://reqres.in/api',
})
api1.get('/users', { query: { page: 1 } }).then(responseHandler('api1'))
api1.get('https://google.com/bad-request').then(responseHandler('api1'))
api1
  .get('/users', { query: { page: 3 }, cancelToken: '/users-req' })
  .then(
    responseHandler(
      'api1. Should be canceled because it have "cancelToken" and was created newest request with the same cancel token'
    )
  )
api1
  .get('/users', { query: { page: 3 }, cancelToken: '/users-req' })
  .then(responseHandler('api1'))
api1
  .post('/register', { email: 'sydney@fife' })
  .then(responseHandler('api1. should have error'))

var api2 = kinka.create({
  baseURL: 'https://reqres.in/api',
  omitCatches: false,
})
api2
  .get('https://google.com/bad-request')
  .catch(responseHandler('api2. request with using falsy omitCatches'))
api2
  .get('/users', { query: { page: 3 }, cancelToken: '/users-req' })
  .catch(
    responseHandler(
      'api2. request with using falsy omitCatches.' +
        'Should be canceled because it have "cancelToken" and was created newest request with the same cancel token'
    )
  )
api2
  .get('/users', { query: { page: 3 }, cancelToken: '/users-req' })
  .then(responseHandler('api2. request with using falsy omitCatches'))
api2
  .post('/users', {
    username: 'vasya',
    creationDate: new Date(),
  })
  .then(responseHandler('api2. post request should return 201'))
api2
  .post(
    '/users',
    {
      username: 'vasya',
      creationDate: new Date(),
    },
    { successStatus: 200 }
  )
  .catch(
    responseHandler('api2. post request should be catched (successStatus)')
  )

try {
  var get = kinka.get
  get('https://google.com/all')
    .then(responseHandler())
    .catch(responseHandler())
} catch (e) {
  renderLog('var get = kinka.get exception', true, e)
}
