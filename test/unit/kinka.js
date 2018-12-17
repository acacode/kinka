import '../__unit__'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import kinka from '../..'

describe('kinka', () => {
  it('should be defined', () => {
    expect(!!kinka).to.be.true()
  })
})
