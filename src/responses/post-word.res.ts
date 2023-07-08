import { GetSemestersResDTO } from '@/domains/semester/index.interface'
import { IWord } from '@/domains/word/index.interface'

export interface PostWordRes {
  postedWord: Partial<IWord>
  semesters: GetSemestersResDTO
}
