import '../../__unit__'
// import nock from 'nock'
import { expect } from 'chai'
import { XMLHttpRequest as OriginalXHR } from 'xmlhttprequest'
import sinon from 'sinon'
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
    const testAbortableKey = 'test-request'
    describe('new request : ', () => {
      let XHRspy = sinon.spy()
      const clearAbortableStorage = () => {
        delete abortableRequests[testAbortableKey]
      }
      beforeEach(() => {
        clearAbortableStorage()
        global.XMLHttpRequest = function FakeXHR() {
          XHRspy()
          return new OriginalXHR()
        }
        createAbortableRequest(testAbortableKey)
      })
      afterEach(() => {
        clearAbortableStorage()
        global.XMLHttpRequest = OriginalXHR
      })
      it('should create XmlHttpRequest instance', () => {
        expect(XHRspy.calledOnce).to.be.equal(true)
      })
      // it('should remove request from abortable requests storage', () => {
      //   expect(abortableRequests).to.deep.equal({})
      // })
    })
  })

  describe('createRequest : ', () => {
    itShouldBeFunc(createRequest)
    //
  })
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
