import { describe, expect, it } from 'vitest'
import { sum } from '../src/utils/sum'

describe('sum', () => {
  it('1 + 2 = 3', () => {
    expect(sum(1, 2)).toEqual(3)
  })
})
