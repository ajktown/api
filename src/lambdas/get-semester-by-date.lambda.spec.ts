import { getSemesterByDataLambda } from './get-semester-by-date.lambda'

describe(`getSemesterByDataLambda(date: Date)`, () => {
  it(`should be exposed as a function`, () => {
    expect(getSemesterByDataLambda).toBeDefined()
  })

  interface Test {
    sampleDateStr: string
    wantSemester: number
  }

  const tests: Test[] = [
    {
      sampleDateStr: '2023-03-31T23:59:59.000Z',
      wantSemester: 231,
    },
    {
      sampleDateStr: '2023-04-01T00:00:00.000Z',
      wantSemester: 232,
    },
    {
      sampleDateStr: '2023-05-24T00:00:00.000Z',
      wantSemester: 232,
    },
    {
      sampleDateStr: '2024-01-15T00:00:00.000Z',
      wantSemester: 241,
    },
    {
      sampleDateStr: '2024-02-15T00:00:00.000Z',
      wantSemester: 241,
    },
    {
      sampleDateStr: '2024-03-15T00:00:00.000Z',
      wantSemester: 241,
    },
    {
      sampleDateStr: '2024-04-15T00:00:00.000Z',
      wantSemester: 242,
    },
    {
      sampleDateStr: '2024-05-15T00:00:00.000Z',
      wantSemester: 242,
    },
    {
      sampleDateStr: '2024-06-15T00:00:00.000Z',
      wantSemester: 242,
    },
    {
      sampleDateStr: '2024-07-15T00:00:00.000Z',
      wantSemester: 243,
    },
    {
      sampleDateStr: '2024-08-15T00:00:00.000Z',
      wantSemester: 243,
    },
    {
      sampleDateStr: '2024-09-15T00:00:00.000Z',
      wantSemester: 243,
    },
    {
      sampleDateStr: '2024-10-15T00:00:00.000Z',
      wantSemester: 244,
    },
    {
      sampleDateStr: '2024-11-15T00:00:00.000Z',
      wantSemester: 244,
    },
    {
      sampleDateStr: '2024-12-15T00:00:00.000Z',
      wantSemester: 244,
    },
  ]

  tests.forEach((test) => {
    it(`should return "${test.wantSemester}" with arg(s) "${test.sampleDateStr}"`, () => {
      const gotSemester = getSemesterByDataLambda(new Date(test.sampleDateStr))
      expect(gotSemester).toBe(test.wantSemester)
    })
  })
})
