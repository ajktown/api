import { DataBasicsDate } from 'src/global.interface'

export type IActionLevel = 0 | 1 | 2 | 3 | 4

export interface IActionInput extends DataBasicsDate {
  id: string
  ownerId: string
  groupId: string
  isDummy: boolean
}

export interface IAction extends IActionInput {
  yyyymmdd: string // the date in YYYY-MM-DD format
}

export interface IActionDerived extends IAction {
  level: number // level is 100% decided by the ActionGroup
}

export interface IActionGroupInput extends DataBasicsDate {
  id: string
  ownerId: string
  task: string
  timezone: string
  openMinsAfter: number
  closeMinsBefore: number
}

export interface IActionGroup extends IActionGroupInput {
  openAt: Date
  closeAt: Date
  utc: string // i.e) +9:00 (timezone is private to shared data)
}
