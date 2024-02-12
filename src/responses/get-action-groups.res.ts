import { IActionDerived, IActionGroup } from '@/domains/action/index.interface'

export interface GetActionGroupRes {
  props: IActionGroup
  actions: Partial<IActionDerived>[]
  isTodayHandled: boolean
  totalCount: number
}

export interface GetActionGroupsRes {
  actionGroups: GetActionGroupRes[]
}
