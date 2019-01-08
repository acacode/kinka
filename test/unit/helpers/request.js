import '../../__unit__'
import nock from 'nock'
import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import {
  abortRequest,
  createAbortableRequest,
  createRequest,
  getUrl,
  getUrlWithQuery,
  prepareRequestData,
  removeAbortableKey,
  requestIsSuccess,
  setHeaders,
  updateContentType,
} from '../../../lib/helpers'
const MockXMLHttpRequest = require('mock-xmlhttprequest')

// describe('request helpers : ', () => {
//   const testMethod = (name, options = {}) => {
//     const methodName = name.toUpperCase()
//     const api = options.api || kinka
//     const baseURL = options.baseURL || global.location
//     const path = `/test-path/method-${name}/custom-method-${Boolean(
//       options.testCustom
//     )}`
//     const url = `${baseURL}${path}`
//     const httpMock = nock(baseURL)
//     const testFunc = options.testCustom
//       ? api.custom.bind(api, name)
//       : api[name].bind(api)
//     let testRequest
//     describe(`${name} method : `, function() {
//       let XHRisCreated = false
//       beforeEach(() => {
//         const OriginXHR = global.XMLHttpRequest
//         global.XMLHttpRequest = function() {
//           XHRisCreated = true
//           return new OriginXHR()
//         }
//         httpMock
//           .intercept(path, methodName)
//           .reply(200, { fullName: 'Donald Trump', id: 1 })
//         testRequest = testFunc(url)
//       })
//       afterEach(() => {
//         XHRisCreated = false
//       })

//       it(`should be function`, () => {
//         expect(typeof testFunc).to.be.equal('function')
//       })
//       it(`should return Promise instance`, () => {
//         expect(testRequest instanceof Promise).to.be.equal(true)
//       })
//       it(`should create XMLHttpRequest instance`, done => {
//         expect(XHRisCreated).to.equal(true)
//         done()
//       })
//       it(`request should return expected data`, function(done) {
//         testRequest.then(function(response) {
//           expect(response.data).to.deep.equal({
//             fullName: 'Donald Trump',
//             id: 1,
//           })
//           done()
//         })
//       })
//       it(`request should have "${url}" url`, function(done) {
//         testRequest.then(function(response) {
//           expect(response.url).to.be.equal(url)
//           done()
//         })
//       })
//     })
//   }
// })
