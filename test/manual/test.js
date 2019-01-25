/* global kinka */

var requestsEl = document.querySelector('.requests')
var header = document.querySelector('header')
var templateName = header.innerText
var failed = 0
var succeeded = 0

function responseHandler(description) {
  return function renderResponse(response) {
    var requestEl = document.createElement('div')
    var className = response.err ? 'failed' : 'succeeded'
    if (response.err) {
      failed++
    } else succeeded++
    header.innerHTML =
      templateName +
      ' ( <span class="green">succeeded: ' +
      succeeded +
      '</span> | <span class="red">failed: ' +
      failed +
      '</span> )'
    requestEl.className = ['request', className].join(' ')
    requestEl.innerHTML =
      '<p>' +
      response.url +
      (description
        ? '<span class="description">' + description + '</span>'
        : '') +
      '</p><details class="response"><summary>response (' +
      className +
      ')</summary><div class="response-data-map">' +
      Object.keys(response)
        .map(function(key) {
          return (
            '<span class="key">' +
            key +
            '</span>' +
            ' : ' +
            JSON.stringify(response[key])
          )
        })
        .map(function(value) {
          return '<div>' + value + '</div>'
        })
        .join('') +
      '</div></details>'
    requestsEl.appendChild(requestEl)
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
