import { ISemester } from '@/domains/semester/index.interface'
import { IWord } from '@/domains/word/index.interface'
import { PaginationRoot } from '@/handlers/get-pagination.handler'

export interface GetWordsRes extends PaginationRoot {
  semester: Partial<ISemester> | undefined
  wordIds: string[]
  words: Partial<IWord>[]
}
