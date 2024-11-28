import { DataBasicsDate } from 'src/global.interface'

// TODO: Modify this into a cleaner sense.
export interface IUser extends DataBasicsDate {
  id: string
  nickname: undefined | string // undefined if not yet set
  federalProvider: 'google'
  federalID: string // '1163553634208XXXXXXXX'
  familyName: string
  givenName: string
  email: string
  imageUrl: string
  languagePreference: 'en' | 'ko' | 'ja'
  dateAdded: number // 1602581150116
}
