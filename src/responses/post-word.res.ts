import { GetSemestersResDTO } from '@/domains/semester/index.interface'
import { IWord } from '@/domains/word/index.interface'

export interface PostWordRes {
  // Posted word
  postedWord: Partial<IWord>
  // Updated semesters after posting this word
  semesters: GetSemestersResDTO
}
