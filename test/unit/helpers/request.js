import '../../__unit__'
import nock from 'nock'
import { expect } from 'chai'
import { XMLHttpRequest as OriginalXHR } from 'xmlhttprequest'
import sinon from 'sinon'
import { describe, it, beforeEach, afterEach } from 'mocha'
import kinka from '../../..'
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
  abortableRequests,
  updateContentType,
} from '../../../lib/helpers'
// const MockXMLHttpRequest = require('mock-xmlhttprequest')

describe('request helpers : ', () => {
  const itShouldBeFunc = testFunc => {
    it(`should be function`, () => {
      expect(typeof testFunc).to.be.equal('function')
    })
  }
  describe('abortRequest : ', () => {
    const testAbortableKey = 'test-request'
    let abortSpy
    const clearAbortableStorage = () => {
      delete abortableRequests[testAbortableKey]
    }
    itShouldBeFunc(abortRequest)
    beforeEach(() => {
      clearAbortableStorage()
      abortSpy = sinon.spy()
      const request = new XMLHttpRequest()
      const abort = request.abort
      request.open('GET', '/path')
      request.abort = function() {
        abortSpy()
        abort.apply(request, arguments)
      }
      abortableRequests[testAbortableKey] = request
      abortRequest(testAbortableKey)
    })
    afterEach(clearAbortableStorage)
    it('should abort request', () => {
      expect(abortSpy.calledOnce).to.be.equal(true)
    })
    it('should remove request from abortable requests storage', () => {
      expect(abortableRequests).to.deep.equal({})
    })
  })

  describe('createAbortableRequest : ', () => {
    itShouldBeFunc(createAbortableRequest)
    describe('new request : ', () => {
      const testAbortableKey = 'test-new-request'
      let XHRspy = sinon.spy()
      let returnedValue
      const clearAbortableStorage = () => {
        delete abortableRequests[testAbortableKey]
      }
      beforeEach(() => {
        clearAbortableStorage()
        global.XMLHttpRequest = function FakeXHR() {
          XHRspy()
        }
        returnedValue = createAbortableRequest(testAbortableKey)
      })
      afterEach(() => {
        clearAbortableStorage()
        global.XMLHttpRequest = OriginalXHR
      })
      it('should create XmlHttpRequest instance', () => {
        expect(XHRspy.calledOnce).to.be.equal(true)
      })
      it('should assign XmlHttpRequest instance to abortable requests storage by key', () => {
        expect(
          abortableRequests[testAbortableKey] instanceof XMLHttpRequest
        ).to.be.equal(true)
      })
      it('should return XmlHttpRequest instance', () => {
        expect(
          returnedValue === abortableRequests[testAbortableKey]
        ).to.be.equal(true)
      })
    })
    describe('existing request : ', () => {
      const testAbortableKey = 'test-existing-request'
      const clearAbortableStorage = () => {
        delete abortableRequests[testAbortableKey]
      }
      afterEach(() => {
        clearAbortableStorage()
        global.XMLHttpRequest = OriginalXHR
      })
      it('should abort previous request', () => {
        global.XMLHttpRequest = OriginalXHR
        const xhr = createAbortableRequest(testAbortableKey)
        xhr.abort = sinon.spy()
        xhr.open('GET', 'https://google.com/test', true)
        createAbortableRequest(testAbortableKey)
        // twice because mocked xmlhttprequest do abort always before open method
        expect(xhr.abort.calledTwice).to.be.equal(true)
      })
    })
  })

  describe('createRequest : ', () => {
    itShouldBeFunc(createRequest)
    describe('default kinka instance : ', () => {
      describe('GET request : ', () => {
        let spies = {
          open: sinon.spy(),
          send: sinon.spy(),
        }

        const makeRequest = (requestConfig = {}, requestOptions) => {
          const { baseURL, path, status, method, data } = {
            ...{
              method: 'GET',
              path: '/all',
              baseURL: location.origin,
              data: { fullName: 'Donald Trump', id: 1 },
              status: 200,
            },
            ...requestConfig,
          }
          const httpMock = nock(baseURL)
          httpMock.intercept(path, method).reply(status, data)
          const XHR = global.XMLHttpRequest
          global.XMLHttpRequest = function FakeXHR() {
            const instance = new XHR(arguments)
            const originalOpen = instance.open
            instance.open = function() {
              spies.open.apply(spies.open, [].slice.call(arguments))
              return originalOpen.apply(this, arguments)
            }
            const originalSend = instance.send
            instance.send = function() {
              spies.send.apply(spies.send, [].slice.call(arguments))
              return originalSend.apply(this, arguments)
            }
            return instance
          }
          return createRequest.call(
            kinka,
            method.toLowerCase(),
            path,
            requestOptions
          )
        }
        afterEach(() => {
          global.XMLHttpRequest = OriginalXHR
          nock.cleanAll()
          spies.open.resetHistory()
          spies.send.resetHistory()
        })
        it('should call `open` XMLHttpRequest method with expected args', function(done) {
          const request = {
            method: 'GET',
            path: '/all',
          }
          makeRequest(request).then(function() {
            expect(spies.open.args).to.deep.equal([
              [request.method, `${location.origin}${request.path}`, true],
            ])
            done()
          })
        })
        it('should call `send` XMLHttpRequest method', function(done) {
          makeRequest().then(function() {
            expect(spies.send.calledOnce).to.be.equal(true)
            done()
          })
        })
        it('response should be success and to be expected object', function(done) {
          makeRequest().then(function(response) {
            expect(response).to.deep.equal({
              data: { fullName: 'Donald Trump', id: 1 },
              err: null,
              headers: { 'content-type': 'application/json' },
              isError: false,
              isSuccess: true,
              response: undefined, // reason: mocked XHR is not supported it
              status: 200,
              statusText: null,
              type: undefined, // reason: mocked XHR is not supported it
              url: 'http://127.0.0.1:8988/all',
            })
            done()
          })
        })
        it("request shouldn't catched and just have 'err' property as truthy value", function(done) {
          makeRequest({
            status: 404,
            data: { errorMessage: 'occurred an server error' },
          }).then(function(response) {
            expect(response.err).to.deep.equal({
              errorMessage: 'occurred an server error',
            })
            expect(response.status).to.be.equal(404)
            done()
          })
        })
        it("request should catches with 'omitCatches' as falsy value (promise)", function(done) {
          makeRequest(
            {
              status: 404,
              data: { errorMessage: 'occurred an server error' },
            },
            {
              omitCatches: false,
            }
          ).catch(function(err) {
            expect(err.err).to.deep.equal({
              errorMessage: 'occurred an server error',
            })
            expect(err.status).to.be.equal(404)
            done()
          })
        })
        it("request should catches with 'omitCatches' as falsy value (async/await)", async () => {
          try {
            await makeRequest(
              {
                status: 404,
                data: { errorMessage: 'occurred an server error' },
              },
              {
                omitCatches: false,
              }
            )
          } catch (e) {
            expect(e.err).to.deep.equal({
              errorMessage: 'occurred an server error',
            })
            expect(e.status).to.be.equal(404)
          }
        })
      })
    })
    // it('should call `open` XMLHttpRequest method with expected args', function(done) {
    //   testRequest.then(function() {
    //     expect(xhrOpenSpy.args).to.deep.equal([
    //       [['GET', 'http://127.0.0.1:8988/all', true]],
    //     ])
    //     done()
    //   })
    // })
  })
  //
  describe('getUrl : ', () => {
    itShouldBeFunc(getUrl)
    //
  })
  describe('getUrlWithQuery : ', () => {
    itShouldBeFunc(getUrlWithQuery)
    //
  })
  describe('prepareRequestData : ', () => {
    itShouldBeFunc(prepareRequestData)
    //
  })
  describe('removeAbortableKey : ', () => {
    itShouldBeFunc(removeAbortableKey)
    //
  })

  describe('requestIsSuccess : ', () => {
    itShouldBeFunc(requestIsSuccess)
    const examples = [
      [false, { status: 0 }],
      [true, { status: 200 }],
      [true, { status: 299 }],
      [false, { status: 304 }],
      [false, { status: 500 }],
      [false, { status: 404 }],
      [false, { status: 505 }],
      [true, { status: 101 }],
      [false, { status: 199 }],
      [false, { status: 200 }, 201],
      [false, { status: 201 }, 200],
    ]
    const test = ([expected, request, successStatus]) =>
      it(`should return ${expected} because request has been ${
        expected ? 'completed successfully' : 'failed'
      }`, () => {
        expect(requestIsSuccess(request, successStatus)).to.be.equal(expected)
      })
    examples.forEach(test)
  })

  describe('setHeaders : ', () => {
    itShouldBeFunc(setHeaders)
    describe('should set headers to existing xhr', () => {
      const xhr = new XMLHttpRequest()
      const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }
      let setRequestHeaderStub = sinon.spy()
      const setRequestHeader = xhr.setRequestHeader
      xhr.open('GET', '/some-url')
      xhr.setRequestHeader = function() {
        setRequestHeaderStub([].slice.apply(arguments))
        return setRequestHeader.apply(xhr, arguments)
      }
      setHeaders(xhr, headers)
      it('should call XmlHttpRequest.setRequestHeader two times with expected arguments', () => {
        expect(setRequestHeaderStub.args).to.deep.equal([
          [['Content-Type', 'application/json']],
          [['Cache-Control', 'no-cache']],
        ])
      })
    })
  })

  describe('updateContentType : ', () => {
    itShouldBeFunc(updateContentType)
    const examples = [
      [
        { 'Content-Type': 'application/json;charset=utf-8' },
        { headers: {}, contentType: 'application/json', charset: 'utf-8' },
      ],
      [
        {
          'Existing Header': 'blabla',
          'Content-Type': 'application/json;charset=utf-8',
        },
        {
          headers: { 'Existing Header': 'blabla' },
          contentType: 'application/json',
          charset: 'utf-8',
        },
      ],
      [
        { 'Content-Type': 'text/plain;charset=utf-8' },
        {
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          contentType: 'application/json',
          charset: 'utf-8',
        },
      ],
    ]
    const test = ([expected, testParams]) => {
      it('should update content type if unset and return expected headers object', () => {
        updateContentType(
          testParams.headers,
          testParams.contentType,
          testParams.charset
        )
        expect(testParams.headers).to.deep.equal(expected)
      })
    }
    examples.forEach(test)
  })
})
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
