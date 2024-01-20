import { ISharedResource } from '@/domains/shared-resource/index.interface'
import { ISharedWord } from '@/domains/word/index.interface'

export interface GetSharedResourceRes {
  sharedResource: ISharedResource
  word: null | ISharedWord
}
