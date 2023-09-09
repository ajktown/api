import {
  IDictPreference,
  IPreference,
} from '@/domains/preference/index.interface'

export interface GetPreferenceRes extends Omit<IPreference, 'dictPreference'> {
  dictPreference: IDictPreference
}
