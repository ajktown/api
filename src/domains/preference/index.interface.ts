import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'
import { DictPreferenceDomain } from './index.dict.domain'
import { AvailableDictCode } from '@/constants/available-dicts.const'

export interface IPreference extends DataBasicsDate {
  id: string
  ownerId: string
  nativeLanguages: GlobalLanguageCode[]
  dictPreference: DictPreferenceDomain
}

export interface IDictPreference {
  selectedDictIds: string[]
  availableDictCodes: AvailableDictCode[]
}
