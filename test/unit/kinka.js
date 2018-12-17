import '../__unit__'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import kinka from '../..'

describe('kinka instance', () => {
  it('should be defined', () => {
    expect(!!kinka).to.be.equal(true)
  })

  describe(' - kinka basic methods', () => {
    const examples = [
      'delete',
      'get',
      'head',
      'options',
      'patch',
      'post',
      'put',
    ]
    const test = name => {
      it(`should have basic method "${name}"`, () => {
        expect(typeof kinka[name]).to.be.equal('function')
      })
      it(`basic method "${name}" should return <Promise> instance`, () => {
        expect(kinka[name]('/test') instanceof Promise).to.be.equal(true)
      })
    }
    examples.forEach(test)
  })
})
