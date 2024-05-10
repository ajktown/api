import { IActionDerived, IActionGroup } from '@/domains/action/index.interface'

type IsTodaySuccessful =
  | true // isTodayHandled
  | false // isPassed && !isTodayHandled
  | null // isPassed

export type ActionGroupStateTime = `Early` | `OnTime` | `Late`
export type ActionGroupStateCommitment =
  | `Committed`
  | `DummyCommitted`
  | `NotCommitted`

// | "EarlyCommitted"
// | "EarlyDummyCommitted"
// | "EarlyNotCommitted"
// | "OnTimeCommitted"
// | "OnTimeDummyCommitted"
// | "OnTimeNotCommitted"
// | "LateCommitted"
// | "LateDummyCommitted"
// | "LateNotCommitted"
export type ActionGroupState =
  `${ActionGroupStateTime}${ActionGroupStateCommitment}`

interface ActionGroupDerivedState {
  isOnTimeCommittable: boolean
  isDummyCommittable: boolean
  isLateCommittable: boolean
  isDeletable: boolean
}
export interface GetActionGroupRes {
  props: IActionGroup
  actionsLength: number
  isTodayHandled: boolean
  totalCount: number
  isOpened: boolean // check if current time is opened to post action
  isPassed: boolean // check if time has already passed
  isTodaySuccessful: IsTodaySuccessful
  actions: IActionDerived[]
  state: ActionGroupState
  derivedState: ActionGroupDerivedState
}
