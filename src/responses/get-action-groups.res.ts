import { IActionDerived, IActionGroup } from '@/domains/action/index.interface'

export interface GetActionGroupRes {
  props: IActionGroup
  actions: Partial<IActionDerived>[]
  actionsLength: number
  isTodayHandled: boolean
  totalCount: number
}

// TODO: Modify back to simple loop
export interface GetActionGroupsRes {
  ids: string[]
  actionGroups: {
    [id: string]: GetActionGroupRes
  }
}
