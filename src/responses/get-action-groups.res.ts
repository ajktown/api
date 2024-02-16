import { IActionDerived, IActionGroup } from '@/domains/action/index.interface'

export interface GetActionGroupRes {
  props: IActionGroup
  actions: IActionDerived[]
  actionsLength: number
  isTodayHandled: boolean
  totalCount: number
}

export interface GetActionGroupIdsRes {
  ids: string[]
}
