import { DataBasicsDateStr, GlobalLanguageCode } from 'src/global.interface'

export interface ISemester extends DataBasicsDateStr, ISemesterDetailedInfo {
  id: string
  code: number // 231
  year: number // 2023
  quarter: number // 1
}

export interface ISemesterDetailedInfo {
  wordsTotalCount: number
  daysAgo: number[]
  languages: GlobalLanguageCode[]
  tags: string[]
}
