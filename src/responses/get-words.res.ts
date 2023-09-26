import { ISemester } from '@/domains/semester/index.interface'
import { IWord } from '@/domains/word/index.interface'
import { PaginationRoot } from '@/handlers/get-pagination.handler'

export interface GetWordsRes extends PaginationRoot {
  // semester data with given semester
  semester: Partial<ISemester> | undefined
  // word ids within the semester
  wordIds: string[]
  // actual word contents within the semester
  words: Partial<IWord>[]
}
