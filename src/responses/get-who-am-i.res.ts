import { IOauthPayload } from '@/domains/auth/access-token.domain'

interface PrivateGetWhoAmIResYesSignedIn {
  isSignedIn: true
  detailedInfo: IOauthPayload
}

interface PrivateGetWhoAmIResNoSignedIn {
  isSignedIn: false
}

export type GetWhoAmIRes =
  | PrivateGetWhoAmIResYesSignedIn
  | PrivateGetWhoAmIResNoSignedIn
