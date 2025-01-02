import {
  t_actionGroupDocs,
  t_actionGroupId,
} from '@/schemas/action-group.schema.sample'
import { t_RitualDoc } from '@/schemas/ritual.schema.sample'
import { t_ArchiveDocs } from '@/schemas/archive.schema.sample'
import { ParentRitualDomain } from './parent-ritual.domain'
import { RitualDoc } from '@/schemas/ritual.schema'
import { ActionGroupDoc } from '@/schemas/action-group.schema'

describe('ParentRitualDomain.fromDoc', () => {
  it('should correctly create a ParentRitualDomain instance from the provided documents and archived action group IDs', () => {
    const parentRitualDomain = ParentRitualDomain.fromDoc(
      t_RitualDoc as RitualDoc,
      t_actionGroupDocs as ActionGroupDoc[],
      t_ArchiveDocs.map((doc) => doc.actionGroupId),
    )
    const res = parentRitualDomain.toResDTO({ isArchived: false })
    // Validate that `actionGroupIds` matches the expected order
    expect(res.ritual.actionGroupIds).toEqual([
      // The order is reversed as the ritual contains the user-customized ids defined in src/schemas/ritual.schema.sample.ts:
      t_actionGroupId.Two,
      t_actionGroupId.One,
    ])
  })
})
