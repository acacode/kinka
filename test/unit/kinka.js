import '../__unit__'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import sinon from 'sinon'
import kinka from '../..'
const MockXMLHttpRequest = require('mock-xmlhttprequest')

describe('kinka instance : ', () => {
  it('should be defined', () => {
    expect(!!kinka).to.be.equal(true)
  })

  const testMethod = (name, options = {}) => {
    const api = options.api || kinka
    const path = (options.baseURL || '') + '/test'
    describe(`${name} method : `, function() {
      let onCreateXHRstub = sinon.stub()
      let testFunction = options.testCustom
        ? api.custom.bind(api, name)
        : api[name].bind(api)
      beforeEach(() => {
        global.XMLHttpRequest = MockXMLHttpRequest.newMockXhr()
        global.XMLHttpRequest.onCreate = function(xhr) {
          onCreateXHRstub()
        }
        onCreateXHRstub.reset()
      })
      it(`should be function`, () => {
        expect(typeof testFunction).to.be.equal('function')
      })
      it(`should return Promise instance`, done => {
        expect(testFunction(path) instanceof Promise).to.be.equal(true)
        done()
      })
      it(`should create XMLHttpRequest instance`, done => {
        testFunction(path)
        expect(onCreateXHRstub.calledOnce).to.equal(true)
        done()
      })
      it(`request should have ${name.toUpperCase()} method`, function(done) {
        global.XMLHttpRequest.onSend = function(xhr) {
          expect(xhr.method).to.be.equal(name.toUpperCase())
          done()
        }
        testFunction(path)
      })
      it(`request should have "${path}" url`, function(done) {
        global.XMLHttpRequest.onSend = function(xhr) {
          expect(xhr.url).to.be.equal(path)
          done()
        }
        testFunction(path)
      })
    })
  }

  describe('basic methods : ', () => {
    const methods = ['delete', 'get', 'head', 'options', 'patch', 'post', 'put']
    methods.forEach(name => testMethod(name))
  })

  describe('custom methods : ', () => {
    const customMethods = ['permanent', 'kill', 'stop', 'move']
    const api = kinka.create({ customMethods })
    customMethods.forEach(name => testMethod(name, { api }))
    describe('using "kinka.custom" function : ', () => {
      const customMethods = ['foo', 'bar', 'baz', 'moveout']
      customMethods.forEach(name => testMethod(name, { testCustom: true }))
    })
  })
  describe('using baseURL option : ', () => {
    const examples = [
      ['https://test-server.com', 'https://test-server.com'],
      ['test-server.com', 'test-server.com'],
      ['//test-server.com', '//test-server.com'],
      ['ws://test-server.com', 'ws://test-server.com'],
      ['http://localhost:8080', undefined, 'http://localhost:8080'],
      ['', ''],
      ['http://localhost:6060', '', 'http://localhost:6060'],
    ]
    const test = ([expected, baseURL, locationOrigin]) => {
      it(`kinka instance should contains "${expected}" baseURL`, () => {
        global.location = locationOrigin
          ? { origin: locationOrigin }
          : undefined
        const api = kinka.create({ baseURL })
        expect(api.baseURL).to.be.equal(expected)
      })
    }
    examples.forEach(test)
    describe('requests : ', () => {
      const examples = [
        [
          'https://test-server.com/example',
          'https://test-server.com',
          '/example',
        ],
        ['test-server.com/example', 'test-server.com', '/example'],
        ['//test-server.com/test', '//test-server.com', '/test'],
        [
          'ws://test-server.com/websocket',
          'ws://test-server.com',
          '/websocket',
        ],
        [
          'http://localhost:8080/example',
          undefined,
          '/example',
          'http://localhost:8080',
        ],
        ['/example', '', '/example'],
        [
          'http://localhost:6060/example',
          '',
          '/example',
          'http://localhost:6060',
        ],
      ]
      const test = ([expected, baseURL, path, locationOrigin]) => {
        const method = 'get'
        it(`request should have "${expected}" url`, function(done) {
          global.location = locationOrigin
            ? { origin: locationOrigin }
            : undefined
          global.XMLHttpRequest = MockXMLHttpRequest.newMockXhr()
          const api = kinka.create({ baseURL })
          global.XMLHttpRequest.onSend = function(xhr) {
            expect(xhr.url).to.be.equal(expected)
            done()
          }
          api[method](path)
        })
      }
      examples.forEach(test)
    })
  })
})
