import { DataBasicsDate } from 'src/global.interface'

export type IActionLevel = 0 | 1 | 2 | 3 | 4

export interface IActionInput extends DataBasicsDate {
  id: string
  ownerID: string
  groupId: string
}

export interface IAction extends IActionInput {
  yyyymmdd: string // the date in YYYY-MM-DD format
}

export interface IActionDerived extends IAction {
  level: number // level is 100% decided by the ActionGroup
}

export interface IActionGroup extends DataBasicsDate {
  id: string
  ownerId: string
  name: string
}
