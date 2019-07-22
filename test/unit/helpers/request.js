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
} from '../../../src/helpers/request'
// load dev loggers
require('../../../src/kinka')

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
      const XHRspy = sinon.spy()
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

    const spies = {
      open: sinon.spy(),
      send: sinon.spy(),
    }

    const makeRequest = (
      requestConfig = {},
      requestOptions,
      existingKinkaInstance
    ) => {
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
        existingKinkaInstance || kinka,
        method.toLowerCase(),
        path,
        requestOptions
      )
    }

    const cleanAll = () => {
      global.XMLHttpRequest = OriginalXHR
      nock.cleanAll()
      spies.open.resetHistory()
      spies.send.resetHistory()
    }

    describe('default kinka instance : ', () => {
      const badResponse = {
        status: 404,
        data: { errorMessage: 'occurred an server error' },
      }
      afterEach(cleanAll)
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
        makeRequest({
          status: 201,
          path: '/data',
          method: 'POST',
          data: { foo: 'barbarian' },
        }).then(function(response) {
          expect(response).to.deep.equal({
            data: { foo: 'barbarian' },
            err: null,
            headers: { 'content-type': 'application/json' },
            isError: false,
            isSuccess: true,
            response: undefined, // reason: mocked XHR is not supported it
            status: 201,
            statusText: null,
            type: undefined, // reason: mocked XHR is not supported it
            url: 'http://127.0.0.1:8988/data',
          })
          done()
        })
      })
      it("request shouldn't catched and just have 'err' property as truthy value", function(done) {
        makeRequest(badResponse).then(function(response) {
          expect(response.err).to.deep.equal({
            errorMessage: 'occurred an server error',
          })
          expect(response.status).to.be.equal(404)
          done()
        })
      })
      it("request should not catches with 'omitCatches' as truthy value (promise)", function(done) {
        makeRequest(badResponse, {
          omitCatches: true,
        }).then(function(err) {
          expect(err.err).to.deep.equal({
            errorMessage: 'occurred an server error',
          })
          expect(err.status).to.be.equal(404)
          done()
        })
      })
      it("request should catches with 'omitCatches' as falsy value (promise)", function(done) {
        makeRequest(badResponse, {
          omitCatches: false,
        }).catch(function(err) {
          expect(err.err).to.deep.equal({
            errorMessage: 'occurred an server error',
          })
          expect(err.status).to.be.equal(404)
          done()
        })
      })
      it("request should catches with 'omitCatches' as falsy value (async/await)", async () => {
        try {
          await makeRequest(badResponse, {
            omitCatches: false,
          })
        } catch (e) {
          expect(e.err).to.deep.equal({
            errorMessage: 'occurred an server error',
          })
          expect(e.status).to.be.equal(404)
        }
      })
      it("request shouldn't catches with 'omitCatches' as truthy value (async/await)", async () => {
        const catchSpy = sinon.spy()
        try {
          const response = await makeRequest(badResponse, {
            omitCatches: true,
          })
          expect(response.isError).to.be.equal(true)
        } catch (e) {
          catchSpy()
        }
        expect(catchSpy.calledOnce).to.be.equal(false)
      })
      it("request should catches with 'omitCatches' as falsy value (async/await)", async () => {
        const catchSpy = sinon.spy()
        try {
          await makeRequest(badResponse, {
            omitCatches: false,
          })
        } catch (e) {
          catchSpy()
        }
        expect(catchSpy.calledOnce).to.be.equal(true)
      })
    })

    describe('existing kinka instance : ', () => {
      afterEach(cleanAll)
      it('should call `open` XMLHttpRequest method with expected args', function(done) {
        const request = {
          method: 'GET',
          path: '/all',
          baseURL: 'https://my-api.com',
        }
        makeRequest(
          request,
          {},
          kinka.create({ baseURL: request.baseURL })
        ).then(function() {
          expect(spies.open.args).to.deep.equal([
            [request.method, `${request.baseURL}${request.path}`, true],
          ])
          done()
        })
      })
      it('response should be success and to be expected object', function(done) {
        const request = {
          baseURL: 'https://my-api.com',
        }
        makeRequest(
          request,
          {},
          kinka.create({ baseURL: request.baseURL })
        ).then(function(response) {
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
            url: `${request.baseURL}/all`,
          })
          done()
        })
      })
    })
  })

  describe('getUrl : ', () => {
    itShouldBeFunc(getUrl)

    const examples = [
      ['https://localhost:7070/all', '/all', 'https://localhost:7070'],
      ['https://localhost:7070/all', 'https://localhost:7070/all'],
      ['ws://localhost:7070/all', 'ws://localhost:7070/all'],
      ['//localhost:7070/all', '//localhost:7070/all'],
      ['//localhost:7070/all', '//localhost:7070/all', '//localhost:7070/bar'],
      ['localhost:7070/all', 'localhost:7070/all', 'localhost:7070/bar'],
      [
        '//128.0.0.1:7001/auth/login',
        '128.0.0.1:7001/auth/login',
        '128.0.0.1:7001/api/v1',
      ],
      ['//128.0.0.1/auth/login', '128.0.0.1/auth/login', '128.0.0.1/api/v1'],
      [
        '//125.243.22.55:8001/auth/login',
        '125.243.22.55:8001/auth/login',
        '125.243.22.55:8001/api/v1',
      ],
      [
        '//125.243.22.55:8001/api/v1/auth/login',
        '/auth/login',
        '125.243.22.55:8001/api/v1',
      ],
      [
        '//125.243.22.55:8001/api/v1/12.th/login',
        '/12.th/login',
        '125.243.22.55:8001/api/v1',
      ],
      [
        'https://localhost:7070/all?yes=no&foo=bar',
        '/all',
        'https://localhost:7070',
        {
          yes: 'no',
          foo: 'bar',
        },
      ],
    ]

    const test = ([expected, path, baseURL, query]) =>
      it(`should create url ${expected}`, () =>
        expect(getUrl(path, baseURL, query)).to.be.equal(expected))
    examples.forEach(test)
  })

  describe('getUrlWithQuery : ', () => {
    itShouldBeFunc(getUrlWithQuery)

    const examples = [
      [
        'https://localhost:4040?yes=no&foo=bar',
        'https://localhost:4040',
        {
          yes: 'no',
          foo: 'bar',
        },
      ],
      [
        'https://localhost:4040?yes=no&foo=bar&no=yes&bar=foo',
        'https://localhost:4040?yes=no&foo=bar',
        {
          no: 'yes',
          bar: 'foo',
        },
      ],
    ]

    const test = ([expected, url, query]) =>
      it(`should create url ${expected} with query`, () =>
        expect(getUrlWithQuery(url, query)).to.be.equal(expected))
    examples.forEach(test)
  })

  describe('prepareRequestData : ', () => {
    itShouldBeFunc(prepareRequestData)

    it('should return raw data if data have type ArrayBuffer', () => {
      const data = new ArrayBuffer()
      expect(prepareRequestData(data)).to.be.equal(data)
    })
    ;[
      new Int32Array(),
      new DataView(new ArrayBuffer()),
      new Int16Array(),
    ].forEach(data => {
      it('should return data buffer if data is ArrayBuffer view', () => {
        expect(prepareRequestData(data)).to.be.equal(data.buffer)
      })
    })

    it('should stringify JSON', () => {
      expect(prepareRequestData({ foo: 'bar' })).to.be.equal('{"foo":"bar"}')
    })
    it('should stringify JSON and patch headers', () => {
      const data = { foo: 'bar' }
      const headers = {}
      const value = prepareRequestData(data, headers, 'utf-8')
      expect(value).to.be.equal('{"foo":"bar"}')
      expect(headers).to.deep.equal({
        'Content-Type': 'application/json;charset=utf-8',
      })
    })
    it('should check data on undefined otherwise return null', () => {
      expect(prepareRequestData('example')).to.be.equal('example')
      expect(prepareRequestData(100)).to.be.equal(100)
      expect(prepareRequestData(undefined)).to.be.equal(null)
      expect(prepareRequestData(null)).to.be.equal(null)
    })
  })
  describe('removeAbortableKey : ', () => {
    itShouldBeFunc(removeAbortableKey)
    //
    beforeEach(() => {
      abortableRequests['my-token'] = 'example'
    })
    afterEach(() => {
      delete abortableRequests['my-token']
    })
    it('should delete request from abortable requests by key', () => {
      removeAbortableKey('my-token')
      expect(abortableRequests).to.deep.equal({})
    })
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
      const setRequestHeaderStub = sinon.spy()
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
