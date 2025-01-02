import { t_actionGroupId } from './action-group.schema.sample'
import { ArchiveDoc } from './archive.schema'
import { t_deprecatedUserId } from './deprecated-user.schema.sample'

// ! TRY TO STICK TO ONE USER ID TO MAKE THE TEST SIMPLE
export enum t_archiveId {
  One = '1_archive_id',
}

export const t_ArchiveDocs: Partial<ArchiveDoc>[] = [
  {
    id: t_archiveId.One,
    ownerId: t_deprecatedUserId.One,
    message: 'random-test-data: why did user archive this action group?',
    actionGroupId: t_actionGroupId.ThreeArchivedId,
    createdAt: new Date('2024-06-09T04:07:19.223Z'),
    updatedAt: new Date('2024-06-09T04:07:19.223Z'),
    __v: 0,
  },
]
