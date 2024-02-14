import { IActionDerived, IActionGroup } from '@/domains/action/index.interface'

export interface GetActionGroupRes {
  props: IActionGroup
  actions: Partial<IActionDerived>[]
  actionsLength: number
  isTodayHandled: boolean
  totalCount: number
}

export interface GetActionGroupsRes {
  ids: string[]
}
