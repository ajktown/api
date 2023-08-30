import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'

export interface IPreference extends DataBasicsDate {
  id: string
  ownerId: string
  nativeLanguages: GlobalLanguageCode[]
}
