import {
  AccessTokenDomain,
  IOauthPayload,
} from '@/domains/auth/access-token.domain'
import { envLambda } from '@/lambdas/get-env.lambda'

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

export class AuthPrepDomain {
  private readonly props: GetAuthPrepRes

  private constructor(props: GetAuthPrepRes) {
    this.props = props
  }

  private static prepareEnv(): GetAuthPrepResInfo {
    return {
      env: {
        currentEnv: envLambda.mode.get(),
        isProduction: envLambda.mode.isProduct(),
        available: envLambda.mode.getList(),
      },
    }
  }

  static async fromAtd(atd: AccessTokenDomain): Promise<AuthPrepDomain> {
    return new AuthPrepDomain({
      isSignedIn: true,
      signedInUserInfo: atd.toDetailedInfo(),
      ...this.prepareEnv(),
    })
  }

  static async fromFailedSignIn(): Promise<AuthPrepDomain> {
    return new AuthPrepDomain({
      isSignedIn: false,
      signedInUserInfo: null,
      ...this.prepareEnv(),
    })
  }

  toResDTO(): GetAuthPrepRes {
    return this.props
  }
}
