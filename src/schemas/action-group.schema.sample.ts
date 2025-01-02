import { ActionGroupDoc } from './action-group.schema'
import { t_deprecatedUserId } from './deprecated-user.schema.sample'

export enum t_actionGroupId {
  One = '1_action_group_id',
  Two = '2_action_group_id',
  ThreeArchivedId = `3_archived_action_group_id`, // non-archived data is the de-facto standard, and therefore this data gets a special name "archived"
}

export const t_actionGroupDocs: Partial<ActionGroupDoc>[] = [
  {
    id: t_actionGroupId.One,
    ownerId: t_deprecatedUserId.One,
    task: 'random-test-data: Wake up early in the morning',
    timezone: 'Asia/Seoul',
    openMinsAfter: 180, // 3:00 am
    closeMinsAfter: 270, // 4:30am
    createdAt: new Date('2024-02-17T10:44:42.119Z'),
    updatedAt: new Date('2024-02-17T10:44:42.119Z'),
  },
  {
    id: t_actionGroupId.Two,
    ownerId: t_deprecatedUserId.One,
    task: 'random-test-data: Brush teeth',
    timezone: 'Asia/Seoul',
    openMinsAfter: 1100, // 6:00 am
    closeMinsAfter: 1250, // 8:50 am
    createdAt: new Date('2024-02-17T10:49:05.474Z'),
    updatedAt: new Date('2024-02-17T10:49:05.474Z'),
  },
  {
    id: t_actionGroupId.ThreeArchivedId,
    ownerId: t_deprecatedUserId.One,
    task: 'random-test-data: Run Podcast',
    timezone: 'Asia/Seoul',
    openMinsAfter: 779,
    closeMinsAfter: 840,
    createdAt: new Date('2024-03-20T06:48:47.108Z'),
    updatedAt: new Date('2024-03-20T06:48:47.108Z'),
  },
]
