import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'

export interface ISharedWord {
  languageCode: GlobalLanguageCode
  term: string
  pronunciation: string
  definition: string
  example: string
  exampleLink: string
  tags: string[]
}
export interface IWord extends ISharedWord, DataBasicsDate {
  id: string
  userId: string
  semester: number
  isFavorite: boolean
  dateAdded: number
  isArchived: boolean
}
