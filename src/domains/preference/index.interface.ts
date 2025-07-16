import { DataBasicsDate, GlobalLanguageCode } from 'src/global.interface'
import { DictPreferenceDomain } from './index.dict.domain'
import { AvailableDictCode } from '@/constants/available-dicts.const'

// IPreference is the interface for user preferences
export interface IPreference extends IPreferenceCGT, DataBasicsDate {
  id: string
  ownerId: string
  nativeLanguages: GlobalLanguageCode[]
  dictPreference: DictPreferenceDomain
  recentTags: string[]
  gptApiKey: string
}

//IPreferenceCGT contains CGT (ConsistencyGPT Application) specific properties
interface IPreferenceCGT {
  // If true, the user will see a progress dialog when the app is loading
  useProgressDialog: boolean
}

export interface IDictPreference {
  selectedDictIds: string[]
  availableDictCodes: AvailableDictCode[]
}
