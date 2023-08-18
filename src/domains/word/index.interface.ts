import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'

export interface IWord extends DataBasicsDate {
  id: string
  userId: string
  languageCode: GlobalLanguageCode
  semester: number
  isFavorite: boolean
  term: string
  pronunciation: string
  definition: string
  example: string
  exampleLink: string
  tags: string[]
  dateAdded: number
}
