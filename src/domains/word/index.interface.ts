import { DataBasicsDateStr, GlobalLanguageCode } from 'src/global.interface'

export interface IWord extends Partial<DataBasicsDateStr> {
  id: string
  languageCode: GlobalLanguageCode
  semester: number
  isFavorite: boolean
  term: string
  pronunciation: string
  definition: string
  example: string
  tags: string[]
}
