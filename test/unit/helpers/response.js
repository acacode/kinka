import '../../__unit__'
import nock from 'nock'
import { expect } from 'chai'
import { XMLHttpRequest as OriginalXHR } from 'xmlhttprequest'
import { describe, it, afterEach } from 'mocha'
import {
  createResponse,
  requestIsSuccess,
  parseResponseData,
  getHeaders,
} from '../../../lib/helpers'
// load dev loggers
require('../../../lib/kinka')

describe('response helpers : ', () => {
  const itShouldBeFunc = testFunc => {
    it(`should be function`, () => {
      expect(typeof testFunc).to.be.equal('function')
    })
  }

  const createXHR = ({
    method = 'GET',
    url = ['https://testapi.com', '/req'],
    data = null,
  } = {}) =>
    new Promise(resolve => {
      const [baseURL, path] = url
      nock(baseURL)
        .intercept(path, method)
        .reply(200, { ok: true })
      const xhr = new OriginalXHR()
      xhr.open(method, `${baseURL}${path}`, true)

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          resolve(xhr)
        }
      }

      xhr.send(data)
    })

  const cleanAll = () => {
    nock.cleanAll()
  }

  describe('createResponse', () => {
    itShouldBeFunc(createResponse)

    afterEach(cleanAll)

    it('it should return success response', async () => {
      const xhr = await createXHR()
      const response = createResponse(
        xhr,
        !requestIsSuccess(xhr),
        'https://testapi.com/req'
      )
      expect(response).to.deep.equal({
        data: { ok: true },
        err: null,
        headers: {
          'content-type': 'application/json',
        },
        isError: false,
        isSuccess: true,
        response: undefined,
        status: 200,
        statusText: null,
        type: undefined,
        url: 'https://testapi.com/req',
      })
    })
    it('it should return failed response', async () => {
      const xhr = await createXHR()
      const response = createResponse(
        xhr,
        requestIsSuccess(xhr),
        'https://testapi.com/req'
      )
      expect(response).to.deep.equal({
        data: null,
        err: { ok: true },
        headers: {
          'content-type': 'application/json',
        },
        isError: true,
        isSuccess: false,
        response: undefined,
        status: 200,
        statusText: null,
        type: undefined,
        url: 'https://testapi.com/req',
      })
    })
  })

  describe('parseResponseData', () => {
    itShouldBeFunc(parseResponseData)

    const examples = [
      [{}, {}],
      [
        {
          foo: 'bar',
        },
        '{"foo":"bar"}',
      ],
      [
        {
          foo: 'bar',
        },
        '{"foo":"bar"}',
        'application/json',
      ],
      [
        {
          data: '4',
          dada: '4',
        },
        'data=4&dada=4',
        'application/x-www-form-urlencoded',
      ],
      [null, null],
      [undefined, undefined],
      ['', ''],
    ]

    const test = ([expected, rawData, contentType]) =>
      it('should return parsed response data', () => {
        expect(parseResponseData(rawData, contentType)).to.deep.equal(expected)
      })

    examples.forEach(test)
  })

  describe('getHeaders', () => {
    itShouldBeFunc(getHeaders)
  })
})
