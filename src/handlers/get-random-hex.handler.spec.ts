import { getRandomHexHandler } from './get-random-hex.handler'

// TODO: Theory: This test sometimes fails, with the jest stores cache and Math.random() does not work properly.
describe(`getRandomHexHandler(hexLength?: number)`, () => {
  it(`should be exposed as a function`, () => {
    expect(getRandomHexHandler).toBeDefined()
  })

  const DEFAULT_HEX_LENGTH = 6
  interface Test {
    sampleHexLength: undefined | number
    wantLength: number
  }

  const tests: Test[] = [
    {
      sampleHexLength: undefined,
      wantLength: DEFAULT_HEX_LENGTH,
    },
    {
      sampleHexLength: 1,
      wantLength: 1,
    },
    {
      sampleHexLength: 2,
      wantLength: 2,
    },
    {
      sampleHexLength: 6,
      wantLength: 6,
    },
    {
      sampleHexLength: 10,
      wantLength: 10,
    },
  ]

  tests.forEach((test) => {
    const gotLength = getRandomHexHandler(test.sampleHexLength).length
    it(`should return "${test.wantLength}" with arg(s) "${test.sampleHexLength}"`, () => {
      expect(gotLength).toBe(test.wantLength)
    })
  })
})
