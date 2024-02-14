import { DataBasicsDate } from 'src/global.interface'

export type IActionLevel = 0 | 1 | 2 | 3 | 4

export interface IAction extends DataBasicsDate {
  id: string
  ownerID: string
  groupId: string
  message: string
}

export interface IActionDerived extends IAction {
  level: number // level is 100% decided by the ActionGroup
}

export interface IActionGroup extends DataBasicsDate {
  id: string
  name: string
}
