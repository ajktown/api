import { DataBasics, GlobalLanguageCode } from 'src/global.interface'

export interface IWord extends DataBasics {
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
