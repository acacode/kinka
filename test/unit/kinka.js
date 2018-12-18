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

  const testMethod = (name, api = kinka) => {
    const path = '/test'
    describe(` - ${name} method : `, function() {
      let onCreateXHRstub = sinon.stub()
      beforeEach(() => {
        global.XMLHttpRequest = MockXMLHttpRequest.newMockXhr()
        global.XMLHttpRequest.onCreate = function(xhr) {
          onCreateXHRstub()
        }
        onCreateXHRstub.reset()
      })
      it(`should be function`, () => {
        expect(typeof api[name]).to.be.equal('function')
      })
      it(`should return Promise instance`, done => {
        expect(api[name](path) instanceof Promise).to.be.equal(true)
        done()
      })
      it(`should create XMLHttpRequest instance`, done => {
        api[name](path)
        expect(onCreateXHRstub.calledOnce).to.equal(true)
        done()
      })
      it(`should create request with ${name.toUpperCase()} method`, function(done) {
        global.XMLHttpRequest.onSend = function(xhr) {
          expect(xhr.method).to.be.equal(name.toUpperCase())
          done()
        }
        api[name](path)
      })
      it(`should create request with "/test" url`, function(done) {
        global.XMLHttpRequest.onSend = function(xhr) {
          expect(xhr.url).to.be.equal(path)
          done()
        }
        api[name](path)
      })
      // it(`should create request with "/test" url`, function(done) {
      //   global.XMLHttpRequest.onSend = function(xhr) {
      //     expect(xhr.url).to.be.equal('/url')
      //     done()
      //   }
      //   api[name](path)
      // })
    })
  }

  describe(' - kinka basic methods : ', () => {
    const methods = ['delete', 'get', 'head', 'options', 'patch', 'post', 'put']
    methods.forEach(name => testMethod(name))
  })

  describe(' - kinka custom methods', () => {
    const customMethods = ['permanent', 'kill', 'stop', 'move']
    const api = kinka.create({ customMethods })
    customMethods.forEach(name => testMethod(name, api))
  })
})
