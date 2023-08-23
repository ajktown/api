import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'

export interface IPreference extends DataBasicsDate {
  id: string
  nativeLanguages: GlobalLanguageCode[]
}
