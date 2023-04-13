import { SemesterDomain } from './semester.domain'

export const DUMMY_SEMESTERS: SemesterDomain[] = [
  SemesterDomain.fromRaw({
    code: 232,
    year: 2023,
    quarter: 2,
  }),
  SemesterDomain.fromRaw({
    code: 231,
    year: 2023,
    quarter: 1,
  }),
  SemesterDomain.fromRaw({
    code: 224,
    year: 2022,
    quarter: 4,
  }),
  SemesterDomain.fromRaw({
    code: 223,
    year: 2022,
    quarter: 3,
  }),
  SemesterDomain.fromRaw({
    code: 222,
    year: 2022,
    quarter: 2,
  }),
]
