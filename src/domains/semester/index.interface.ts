import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'

export interface ISemester extends DataBasicsDate {
  id: string
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
