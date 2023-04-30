interface PrivateGetWhoAmIResYesSignedIn {
  isSignedIn: true
  detailedInfo: {
    id: string
  }
}

interface PrivateGetWhoAmIResNoSignedIn {
  isSignedIn: false
}

export type GetWhoAmIRes =
  | PrivateGetWhoAmIResYesSignedIn
  | PrivateGetWhoAmIResNoSignedIn
