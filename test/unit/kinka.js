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
    describe(` - ${name} method : `, () => {
      let onCreateXHRstub = sinon.stub()
      let onSendXHRstub = sinon.stub()
      beforeEach(() => {
        global.XMLHttpRequest = MockXMLHttpRequest.newMockXhr()
        global.XMLHttpRequest.onCreate = function(xhr) {
          onCreateXHRstub()
        }
        global.XMLHttpRequest.onSend = function(xhr) {
          onSendXHRstub()
          xhr.respond(200, {}, null, 'OK')
        }
        onCreateXHRstub.reset()
        onSendXHRstub.reset()
      })
      it(`should be function`, () => {
        expect(typeof api[name]).to.be.equal('function')
      })
      it(`should return Promise instance`, done => {
        expect(api[name]('/test') instanceof Promise).to.be.equal(true)
        done()
      })
      it(`should create XMLHttpRequest instance`, done => {
        api[name]('/test')
        expect(onCreateXHRstub.calledOnce).to.equal(true)
        done()
      })
      it(`should create request with ${name.toUpperCase()} method`, done => {
        api[name]('/test').then(response => {
          console.log(response)
          expect(true).to.equal(true)
          done()
        })
      })
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
