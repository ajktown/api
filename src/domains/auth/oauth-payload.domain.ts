import { DataNotPresentError } from '@/errors/400/data-not-present.error'
import { ForbiddenError } from '@/errors/403/index.error'
import { UserDoc, UserProps, UserModel } from '@/schemas/deprecated-user.schema'
import { TokenPayload } from 'google-auth-library'
import { FilterQuery } from 'mongoose'

enum PrivateFederalProvider {
  Google = 'Google',
  // Microsoft = "Microsoft"
}
interface IOauthPayload {
  federalProvider: PrivateFederalProvider
  federalId: string
  firstName: string
  lastName: string
  userEmail: string
  imageUrl: string
}

export class OauthPayloadDomain {
  private readonly props: Partial<IOauthPayload>

  private constructor(props: Partial<IOauthPayload>) {
    if (!props.userEmail) throw new DataNotPresentError(`User email`)

    this.props = props
  }

  get email() {
    return this.props.userEmail
  }

  static fromGooglePayload(payload: TokenPayload) {
    if (!payload.email_verified)
      throw new ForbiddenError('Email is not verified!')

    return new OauthPayloadDomain({
      federalProvider: PrivateFederalProvider.Google,
      userEmail: payload.email,
      federalId: payload.sub,
      firstName: payload.given_name,
      lastName: payload.family_name,
      imageUrl: payload.picture,
    })
  }

  toFind(): FilterQuery<Partial<UserDoc>> {
    return {
      email: this.email,
    }
  }

  /**
   * This method is used to create a new user from the OAuth payload from trusted provider like Google etc
   */
  toUserModel(userModel: UserModel): UserDoc {
    const props: UserProps = {
      federalProvider: this.props.federalProvider,
      federalID: this.props.federalId,
      nickname: undefined, // nickname is first undefined, and users will be asked to set it later
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.userEmail,
      imageUrl: this.props.imageUrl,
      languagePreference: 'en',
      dateAdded: new Date().valueOf(),
    }
    return new userModel(props)
  }
}
