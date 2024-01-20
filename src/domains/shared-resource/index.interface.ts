import { DataBasicsDate } from '@/global.interface'

export interface ISharedResource extends DataBasicsDate {
  id: string
  ownerId: string
  expireInSecs: number | null
  wordId: undefined | string
}
