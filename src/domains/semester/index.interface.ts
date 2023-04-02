import { DataBasicsDateStr } from 'src/global.interface'

export interface ISemester extends DataBasicsDateStr {
  id: string
  code: number // 231
  year: number // 2023
  quarter: number // 1
}
