import { t_actionGroupId } from './action-group.schema.sample'
import { t_deprecatedUserId } from './deprecated-user.schema.sample'
import { RitualDoc } from './ritual.schema'

enum t_ritualId {
  One = '1_ritual_id',
}

export const t_RitualDoc: Partial<RitualDoc> = {
  id: t_ritualId.One,
  ownerId: t_deprecatedUserId.One,
  name: 'random-test-data: Default Ritual',
  createdAt: new Date('2024-03-20T04:59:19.752Z'),
  updatedAt: new Date('2024-12-31T08:06:27.719Z'),
  __v: 0,
  orderedActionGroupIds: [t_actionGroupId.Two, t_actionGroupId.One], // the order is reversed in purpose (related src/domains/ritual/parent-ritual.domain.spec.ts)
}
