import { timeHandler } from './time.handler'
import { DateTime } from 'luxon'

describe(`timeHandler.getDaysAgo(date: Date)`, () => {
  it(`should be exposed as a function`, () => {
    expect(timeHandler).toBeDefined()
    expect(timeHandler.getDaysAgo).toBeDefined()
  })

  interface Test {
    sampleDate: Date
    wantDaysAgo: number
  }

  const tests: Test[] = [
    {
      sampleDate: new Date(),
      wantDaysAgo: 0,
    },
    {
      sampleDate: DateTime.now().minus({ days: 1 }).toJSDate(),
      wantDaysAgo: 1,
    },
  ]

  tests.forEach((test) => {
    const gotDaysAgo = timeHandler.getDaysAgo(test.sampleDate)
    it(`should return "${test.wantDaysAgo}" with arg(s) "${test.sampleDate}"`, () => {
      expect(gotDaysAgo).toBe(test.wantDaysAgo)
    })
  })
})

// Write test for timeHandler.daysAgo
describe(`timeHandler.getDateFromDaysAgo(daysAgo: number)`, () => {
  it(`should be exposed as a function`, () => {
    expect(timeHandler).toBeDefined()
    expect(timeHandler.getDateFromDaysAgo).toBeDefined()
  })

  interface Test {
    sampleDaysAgo: number
    wantStart: Date
    wantEnd: Date
  }

  const tests: Test[] = [
    {
      sampleDaysAgo: 0,
      wantStart: DateTime.now().startOf('day').toJSDate(),
      wantEnd: DateTime.now().endOf('day').toJSDate(),
    },
    {
      sampleDaysAgo: 1,
      wantStart: DateTime.now().minus({ days: 1 }).startOf('day').toJSDate(),
      wantEnd: DateTime.now().minus({ days: 1 }).endOf('day').toJSDate(),
    },
  ]

  tests.forEach((test) => {
    const [gotStart, gotEnd] = timeHandler.getDateFromDaysAgo(
      test.sampleDaysAgo,
    )
    it(`should return "${test.wantStart}" and "${test.wantEnd}" with arg(s) "${test.sampleDaysAgo}"`, () => {
      expect(gotStart.valueOf()).toEqual(test.wantStart.valueOf())
      expect(gotEnd.valueOf()).toEqual(test.wantEnd.valueOf())
    })
  })
})

describe(`timeHandler.isWithinDaysAgo(daysAgo: number, date: Date)`, () => {
  it(`should be exposed as a function`, () => {
    expect(timeHandler).toBeDefined()
    expect(timeHandler.isWithinDaysAgo).toBeDefined()
  })

  interface Test {
    sampleDaysAgo: number
    sampleDate: Date
    wantIsWithin: boolean
  }

  const tests: Test[] = [
    {
      sampleDaysAgo: 0,
      sampleDate: new Date(),
      wantIsWithin: true,
    },
    {
      sampleDaysAgo: 1,
      sampleDate: new Date(),
      wantIsWithin: false,
    },
    {
      sampleDaysAgo: 1,
      sampleDate: DateTime.now().minus({ days: 1 }).toJSDate(),
      wantIsWithin: true,
    },
    {
      sampleDaysAgo: 2,
      sampleDate: DateTime.now().minus({ days: 1 }).toJSDate(),
      wantIsWithin: false,
    },
  ]

  tests.forEach((test) => {
    const gotIsWithin = timeHandler.isWithinDaysAgo(
      test.sampleDaysAgo,
      test.sampleDate,
    )
    it(`should return "${test.wantIsWithin}" with arg(s) "${test.sampleDaysAgo}" and "${test.sampleDate}"`, () => {
      expect(gotIsWithin).toBe(test.wantIsWithin)
    })
  })
})
