import '../../__unit__'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import {
  includes,
  isObject,
  isUndefined,
  merge,
  parseJSON,
  parseUrlEncodedForm,
  valueIs,
} from '../../../src/helpers/base'
// load dev loggers
require('../../../src/kinka')

describe('base helpers : ', () => {
  const shouldBeFunction = func =>
    it('should be function', () => {
      expect(typeof func).to.be.equal('function')
    })
  describe('merge : ', () => {
    shouldBeFunction(merge)
    const testArg = function foo() {}
    const examples = [
      [{ a: 3, b: 4 }, [{ a: 3 }, { b: 4 }]],
      [{ a: 3 }, [{ a: 3 }, '']],
      [{ foo: 100 }, [{ foo: function() {} }, { foo: 100 }]],
      [{ foo: testArg, bar: 100 }, [{ foo: testArg }, { bar: 100 }]],
      [{ 0: 1, 1: 3, 2: 4, a: 3 }, [{ a: 3 }, [1, 3, 4]]],
      [
        { a: 6, b: 4, foo: 300 },
        [{ a: 3 }, { b: 4 }, null, undefined, 0, '', { a: 6 }, { foo: 300 }],
      ],
    ]
    const test = ([expected, args]) => {
      const result = merge.apply(null, args)
      describe(`arguments - ${JSON.stringify(args)}`, () => {
        it('should merge objects together', () => {
          expect(result).to.deep.equal(expected)
        })
        it('should return object', () => {
          expect(typeof result).to.be.equal('object')
        })
      })
    }

    examples.forEach(test)
  })

  describe('isObject : ', () => {
    shouldBeFunction(isObject)
    const examples = [
      [true, {}],
      [false, 0],
      [false, '1'],
      [true, []],
      [true, { null: null }],
      [false, null],
      [false, () => {}],
      [false, true],
      [true, new ArrayBuffer()],
    ]
    const test = ([expected, value]) =>
      it(`should return ${expected} because ${value} is ${
        expected ? '' : 'not '
      }object`, () => {
        expect(isObject(value)).to.be.equal(expected)
      })
    examples.forEach(test)
  })

  describe('parseJSON : ', () => {
    shouldBeFunction(parseJSON)
    const examples = [
      [{}, '{}'],
      [{ key: 'value' }, '{ "key": "value" }'],
      [5, '5'],
      [-1, -1],
      [undefined, undefined],
    ]
    const test = ([expected, value]) =>
      it(`should parse stringified value ${value} otherwise return same value`, () => {
        expect(parseJSON(value)).to.deep.equal(expected)
      })
    examples.forEach(test)
  })

  describe('isUndefined : ', () => {
    shouldBeFunction(isUndefined)
    const examples = [
      ['', '', '5'],
      ['5', undefined, '5'],
      [null, null, '5'],
      [undefined, undefined],
    ]
    const test = ([expected, value, defaultValue]) =>
      it(`should validate value on undefined and return ${expected}`, () => {
        expect(isUndefined(value, defaultValue)).to.be.equal(expected)
      })
    examples.forEach(test)
  })

  describe('valueIs : ', () => {
    shouldBeFunction(valueIs)
    const examples = [
      [true, '', ['String', 'Number']],
      [true, -6, ['String', 'Number']],
      [false, {}, ['String', 'Number']],
      [true, new ArrayBuffer(), ['ArrayBuffer']],
      [true, new Uint16Array(), ['Uint16Array']],
      [true, {}, ['Object']],
      [false, [], ['Object']],
      [true, [], ['Object', 'Array']],
      [true, function() {}, ['Function']],
    ]
    const test = ([expected, value, typeNames]) =>
      it(`should validate type of value on types [${typeNames.join(
        ','
      )}] and return ${expected}`, () => {
        expect(valueIs(value, typeNames)).to.be.equal(expected)
      })
    examples.forEach(test)
  })

  describe('includes : ', () => {
    shouldBeFunction(includes)
    const examples = [
      [true, 'abc', 'a'],
      [false, '', 'cc'],
      [true, 'asdasd asdasd', ' '],
      [false, [], 1],
      [true, [1, 2, 3, 4], 1],
    ]
    const test = ([expected, value, includedValue]) =>
      it(`should check \`${value}\` on containing \`${includedValue}\` and return ${expected}`, () => {
        expect(includes(value, includedValue)).to.be.equal(expected)
      })
    examples.forEach(test)
  })

  describe('parseUrlEncodedForm : ', () => {
    shouldBeFunction(includes)
    const examples = [
      [{ abc: '' }, 'abc'],
      [{ foo: 'bar', bar: 'foo' }, 'foo=bar&bar=foo'],
      [{ foo: 'bar', bar: '' }, 'foo=bar&bar='],
      [{ foo: 'bar', bar: '' }, 'foo=bar&bar'],
      [{ foo: 'bar', bar: '"' }, 'foo=bar&bar="'],
      [
        { '-1asd32': '', '': '', asd7asd: '', asdasd: '' },
        '-1asd32&&&&asdasd&&asd7asd&&&',
      ],
    ]
    const test = ([expected, str]) =>
      it(`should parse url encoded string (\`${str}\`) and return expected object`, () => {
        expect(parseUrlEncodedForm(str)).to.deep.equal(expected)
      })
    examples.forEach(test)
  })
})
