import { DataBasicsDate } from 'src/global.interface'

export interface IAction extends DataBasicsDate {
  id: string
  ownerID: string
  groupId: string
  level: number // 1 ~ 4 only
  message: string
}
