import { IActionDerived, IActionGroup } from '@/domains/action/index.interface'

export interface GetActionGroupRes {
  props: IActionGroup
  actionsLength: number
  isTodayHandled: boolean
  totalCount: number
  isOpened: boolean
  actions: IActionDerived[]
}
