import { IActionDerived, IActionGroup } from '@/domains/action/index.interface'

type IsTodaySuccessful =
  | true // isTodayHandled
  | false // isPassed && !isTodayHandled
  | null // isPassed

export interface GetActionGroupRes {
  props: IActionGroup
  actionsLength: number
  isTodayHandled: boolean
  totalCount: number
  isOpened: boolean // check if current time is opened to post action
  isPassed: boolean // check if time has already passed
  isTodaySuccessful: IsTodaySuccessful
  actions: IActionDerived[]
}
