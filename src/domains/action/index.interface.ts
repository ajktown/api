import { DataBasicsDate } from 'src/global.interface'

export type IActionLevel = 0 | 1 | 2 | 3 | 4

export interface IAction extends DataBasicsDate {
  id: string
  ownerID: string
  groupId: string
  level: IActionLevel
  message: string
}
