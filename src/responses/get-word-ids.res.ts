import { GlobalLanguageCode } from '@/global.interface'

export interface GetWordIdsRes {
  wordIds: string[]
  daysAgo: number[]
  languages: GlobalLanguageCode[]
  tags: string[]
}
