import { IOauthPayload } from '@/domains/auth/access-token.domain'

interface GetAuthPrepResInfo {
  env: {
    currentEnv: string // StrictlyEnv
    available: string[]
  }
}
interface PrivateGetAuthPrepResYesSignedIn extends GetAuthPrepResInfo {
  isSignedIn: true
  signedInUserInfo: IOauthPayload
  // profilePictureUrl: string
}

interface PrivateGetAuthPrepResNoSignedIn extends GetAuthPrepResInfo {
  isSignedIn: false
  signedInUserInfo: null
  // profilePictureUrl: null
}

export type GetAuthPrepRes =
  | PrivateGetAuthPrepResYesSignedIn
  | PrivateGetAuthPrepResNoSignedIn
