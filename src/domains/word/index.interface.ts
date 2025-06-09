import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'

export interface ISharedWord {
  languageCode: GlobalLanguageCode
  term: string
  pronunciation: string
  definition: string
  subDefinition: string
  example: string
  exampleLink: string
  tags: string[]
  dateAdded: number
}
export interface IWord extends ISharedWord, DataBasicsDate {
  id: string
  userId: string // TODO: Modify this to ownerId (Careful test may be needed, especially with FE)
  semester: number
  isFavorite: boolean
  isPinned: boolean
  isArchived: boolean
}
