import { IOauthPayload } from '@/domains/auth/access-token.domain'

interface GetAuthPrepResInfo {
  env: {
    currentEnv: string // StrictlyEnv
    isProduction: boolean
    available: string[]
  }
}
interface PrivateGetAuthPrepResYesSignedIn extends GetAuthPrepResInfo {
  isSignedIn: true
  signedInUserInfo: IOauthPayload
}

interface PrivateGetAuthPrepResNoSignedIn extends GetAuthPrepResInfo {
  isSignedIn: false
  signedInUserInfo: null
}

export type GetAuthPrepRes =
  | PrivateGetAuthPrepResYesSignedIn
  | PrivateGetAuthPrepResNoSignedIn
