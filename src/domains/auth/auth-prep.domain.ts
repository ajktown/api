import {
  AccessTokenDomain,
  IOauthPayload,
} from '@/domains/auth/access-token.domain'
import { envLambda } from '@/lambdas/get-env.lambda'

interface GetAuthPrepEnvInfo {
  currentEnv: string // StrictlyEnv
  isProduction: boolean
  available: string[]
}

interface PrivateGetAuthPrepResYesSignedIn {
  isSignedIn: true
  signedInUserInfo: IOauthPayload
  env: GetAuthPrepEnvInfo
}

interface PrivateGetAuthPrepResNoSignedIn {
  isSignedIn: false
  signedInUserInfo: null
  env: GetAuthPrepEnvInfo
}

export type GetAuthPrepRes =
  | PrivateGetAuthPrepResYesSignedIn
  | PrivateGetAuthPrepResNoSignedIn

export class AuthPrepDomain {
  private readonly props: GetAuthPrepRes

  private constructor(props: GetAuthPrepRes) {
    this.props = props
  }

  private static prepareEnv(): GetAuthPrepEnvInfo {
    return {
      currentEnv: envLambda.mode.get(),
      isProduction: envLambda.mode.isProduct(),
      available: envLambda.mode.getList(),
    }
  }

  static fromAtd(atd: AccessTokenDomain): AuthPrepDomain {
    return new AuthPrepDomain({
      isSignedIn: true,
      signedInUserInfo: atd.toDetailedInfo(),
      env: this.prepareEnv(),
    })
  }

  static fromFailedSignIn(): AuthPrepDomain {
    return new AuthPrepDomain({
      isSignedIn: false,
      signedInUserInfo: null,
      env: this.prepareEnv(),
    })
  }

  toResDTO(): GetAuthPrepRes {
    return this.props
  }
}
