import './__unit__'
import nock from 'nock'
import { expect } from 'chai'
import { describe, it, beforeEach, afterEach, before } from 'mocha'
const MockXMLHttpRequest = require('mock-xmlhttprequest')

export const testKinka = (kinkaPath, instanceName, beforeHook) => {
  describe(`test kinka (type: ${instanceName}, path: ${kinkaPath})`, () => {
    before(() => {
      if (beforeHook) beforeHook()
    })

    const kinka = require(kinkaPath)

    it('should be defined', () => {
      expect(!!kinka).to.be.equal(true)
    })

    console.log('kinka', kinka)

    const testMethod = (name, options = {}) => {
      const methodName = name.toUpperCase()
      const api = options.api || kinka

      if (!api) {
        throw new Error('api is not defined')
      }

      const baseURL = options.baseURL || global.location.origin
      const path = `/test-path/method-${name}/custom-method-${Boolean(
        options.testCustom
      )}`
      const url = `${baseURL}${path}`
      const httpMock = nock(baseURL)

      if (typeof api[options.testCustom ? 'custom' : name] !== 'function') {
        throw new Error(
          `Property with name "${
            options.testCustom ? 'custom' : name
          }" is not existing in api`
        )
      }

      const testFunc = options.testCustom
        ? api.custom.bind(api, name)
        : api[name].bind(api)
      let testRequest
      describe(`${name} method : `, function() {
        let XHRisCreated = false
        const OriginXHR = global.XMLHttpRequest
        beforeEach(() => {
          global.XMLHttpRequest = function() {
            XHRisCreated = true
            return new OriginXHR()
          }
          httpMock
            .intercept(path, methodName)
            .reply(200, { fullName: 'Donald Trump', id: 1 })
          testRequest = testFunc(url)
        })
        afterEach(() => {
          XHRisCreated = false
          global.XMLHttpRequest = OriginXHR
          nock.cleanAll()
        })

        it(`should be function`, () => {
          expect(typeof testFunc).to.be.equal('function')
        })
        it(`should return Promise instance`, () => {
          expect(testRequest instanceof Promise).to.be.equal(true)
        })
        it(`should create XMLHttpRequest instance`, done => {
          expect(XHRisCreated).to.equal(true)
          done()
        })
        it(`request should return expected data`, function(done) {
          testRequest.then(function(response) {
            expect(response.data).to.deep.equal({
              fullName: 'Donald Trump',
              id: 1,
            })
            done()
          })
        })
        it(`request should have "${url}" url`, function(done) {
          testRequest.then(function(response) {
            expect(response.url).to.be.equal(url)
            done()
          })
        })
      })
    }

    describe('basic methods : ', () => {
      const methods = [
        // FIXME: property 'delete' is not existing in api
        'delete',
        'get',
        'head',
        'options',
        'patch',
        'post',
        'put',
      ]
      methods.forEach(name => testMethod(name))
    })

    describe('custom methods : ', () => {
      describe('using "kinka[methodName] : ', () => {
        const customMethods = ['permanent', 'kill', 'stop', 'move']
        const api = kinka.create({ customMethods })
        customMethods.forEach(name => testMethod(name, { api }))
      })

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
}
