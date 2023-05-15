import { IOauthPayload } from '@/domains/auth/access-token.domain'

interface PrivateGetAuthPrepResYesSignedIn {
  isSignedIn: true
  detailedInfo: IOauthPayload
}

interface PrivateGetAuthPrepResNoSignedIn {
  isSignedIn: false
}

export type GetAuthPrepRes =
  | PrivateGetAuthPrepResYesSignedIn
  | PrivateGetAuthPrepResNoSignedIn
