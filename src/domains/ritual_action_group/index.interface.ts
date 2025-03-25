import { IRitual } from '../ritual/index.interface'

export interface IRitualActionGroup extends IRitual {
  actionGroupIds: string[]
  archivedActionGroupSet: Set<string>
}
