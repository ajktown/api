import { DataBasicsDateStr, GlobalLanguageCode } from 'src/global.interface'

export interface IWord extends DataBasicsDateStr {
  id: string
  languageCode: GlobalLanguageCode
  semester: number
  isFavorite: boolean
  term: string
  pronunciation: string
  definition: string
  example: string
  tags: string[]
  createdAt: string
  updatedAt: string
}
