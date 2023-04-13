import { stringSliceHandler } from './string-slice.handler'

const PRIVATE_FINAL_ESCAPE_CHAR = `$`
const PRIVATE_FINAL_SLICE_WITH = `:`

describe(`stringSliceHandler(given: string, splitWith: string | string[], escaper: string)`, () => {
  it(`should be exposed as a function`, () => {
    expect(stringSliceHandler).toBeDefined()
  })

  interface Test {
    sampleString: string
    wantSlicedFront: string
    wantSlicedRear: string
  }

  const tests: Test[] = [
    {
      sampleString: ``,
      wantSlicedFront: ``,
      wantSlicedRear: ``,
    },
    {
      sampleString: `:`,
      wantSlicedFront: ``,
      wantSlicedRear: ``,
    },
    {
      sampleString: `$`,
      wantSlicedFront: `$`,
      wantSlicedRear: ``,
    },
    {
      sampleString: `$:`,
      wantSlicedFront: `:`,
      wantSlicedRear: ``,
    },
    {
      sampleString: `hello`,
      wantSlicedFront: `hello`,
      wantSlicedRear: ``,
    },
    {
      sampleString: `he$:lo`,
      wantSlicedFront: `he:lo`,
      wantSlicedRear: ``,
    },
    {
      sampleString: `he$:lo:`,
      wantSlicedFront: `he$:lo`,
      wantSlicedRear: ``,
    },
    {
      sampleString: `hello:`,
      wantSlicedFront: `hello`,
      wantSlicedRear: ``,
    },
    {
      sampleString: `hello:world`,
      wantSlicedFront: `hello`,
      wantSlicedRear: `world`,
    },
    {
      sampleString: `hello$:world`,
      wantSlicedFront: `hello:world`,
      wantSlicedRear: ``,
    },
    {
      sampleString: `new:hello$:world`,
      wantSlicedFront: `new`,
      wantSlicedRear: `hello:world`,
    },
    {
      sampleString: `new:hello$$:world`,
      wantSlicedFront: `new`,
      wantSlicedRear: `hello$:world`,
    },
    {
      sampleString: `new$:hello$$:world`,
      wantSlicedFront: `new:hello$:world`,
      wantSlicedRear: ``,
    },
  ]

  tests.forEach((test) => {
    const [gotSlicedFront, gotSlicedRear] = stringSliceHandler(
      test.sampleString,
      PRIVATE_FINAL_SLICE_WITH,
      PRIVATE_FINAL_ESCAPE_CHAR,
    )
    it(`should return "${test.wantSlicedFront}" with arg(s) "${test.sampleString}"`, () => {
      expect(gotSlicedFront).toBe(test.wantSlicedFront)
    })
    it(`should return "${test.wantSlicedRear}" with arg(s) "${test.sampleString}"`, () => {
      expect(gotSlicedRear).toBe(test.wantSlicedRear)
    })
  })
})
