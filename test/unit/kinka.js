import '../__unit__'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import kinka from '../..'

describe('kinka', () => {
  it('should be defined', () => {
    expect(!!kinka).to.be.equal(true)
  })

  describe('kinka basic methods', () => {
    const examples = [
      'delete',
      'get',
      'head',
      'options',
      'patch',
      'post',
      'put',
    ]
    const test = name =>
      it(`should have basic method ${name}`, () => {
        expect(typeof kinka[name]).to.be.equal('function')
      })
    examples.forEach(test)
  })
})
