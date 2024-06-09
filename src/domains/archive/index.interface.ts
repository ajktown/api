import { DataBasicsDate } from 'src/global.interface'

export interface IArchive extends DataBasicsDate {
  id: string
  ownerId: string
  actionGroupId: null | string // if null, it is considered an archive NOT for action group
}
