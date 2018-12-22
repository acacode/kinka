import '../../__unit__'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import {
  merge,
  isObject,
  parseJSON,
  isUndefined,
} from '../../../lib/helpers/base'

describe('base helpers : ', () => {
  describe('merge : ', () => {
    it('should be function', () => {
      expect(typeof merge).to.be.equal('function')
    })
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
    it('should be function', () => {
      expect(typeof isObject).to.be.equal('function')
    })
    const examples = [
      [true, {}],
      [false, 0],
      [false, '1'],
      [true, []],
      [true, { null: null }],
    ]
    const test = ([expected, value]) =>
      it(`should return ${expected} because value is ${
        expected ? '' : 'not '
      }object`, () => {
        expect(isObject(value)).to.be.equal(expected)
      })
    examples.forEach(test)
  })

  describe('parseJSON : ', () => {
    it('should be function', () => {
      expect(typeof parseJSON).to.be.equal('function')
    })
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
    it('should be function', () => {
      expect(typeof isUndefined).to.be.equal('function')
    })
    const examples = [
      ['', '', '5'],
      ['5', undefined, '5'],
      [null, null, '5'],
      [undefined, undefined],
    ]
    const test = ([expected, value, defaultValue]) =>
      it(`should check value on undefined and return ${expected}`, () => {
        expect(isUndefined(value, defaultValue)).to.be.equal(expected)
      })
    examples.forEach(test)
  })
})
