import { isEmptyObjectHandler } from './is-empty-object.handler'

describe(`isEmptyObject(obj: object)`, () => {
  it(`should be exposed as a function`, () => {
    expect(isEmptyObjectHandler).toBeDefined()
  })

  interface Test {
    sampleObj: object
    wantIsEmptyObject: boolean
  }

  const tests: Test[] = [
    {
      sampleObj: {},
      wantIsEmptyObject: true,
    },
    {
      sampleObj: {
        definitelyNotEmptyObject: true,
      },
      wantIsEmptyObject: false,
    },
  ]

  tests.forEach((test) => {
    const gotIsEmptyObject = isEmptyObjectHandler(test.sampleObj)
    it(`should return "${test.wantIsEmptyObject}" with arg(s) "${JSON.stringify(
      test.sampleObj,
    )}"`, () => {
      expect(gotIsEmptyObject).toBe(test.wantIsEmptyObject)
    })
  })
})
