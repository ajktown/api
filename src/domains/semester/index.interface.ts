import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'

export interface ISemester extends DataBasicsDate {
  id: string
  isExistInDb: boolean
  code: number // 231
  year: number // 2023
  quarter: number // 1
  details?: ISemesterDetailedInfo
}

export interface ISemesterDetailedInfo {
  wordsTotalCount: number
  daysAgo: number[]
  languages: GlobalLanguageCode[]
  tags: string[]
}

export interface GetSemestersResDTO {
  // highly recommend frontend to use undefined as default
  latestSemesterCode: number | undefined // undefined if there is no semester
  semesters: Partial<ISemester>[]
}
