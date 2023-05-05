import { DeprecatedUserDocument } from '@/schemas/deprecated-user.schema'
import { IUser } from './index.interface'
import { TokenPayload } from 'google-auth-library'

export class UserDomain {
  private readonly props: Partial<IUser>

  private constructor(props: Partial<IUser>) {
    this.props = props
  }

  static fromGoogleAuthPayload(payload: TokenPayload) {
    return new UserDomain({
      federalID: payload.sub,
      email: payload.email,
      givenName: payload.given_name,
      familyName: payload.family_name,
    })
  }

  static fromMdb(props: DeprecatedUserDocument): UserDomain {
    if (typeof props !== 'object') throw new Error('Not Object!')

    return new UserDomain({
      id: props.id,
      federalID: props.federalID,
      givenName: props.firstName,
      familyName: props.lastName,
      email: props.email,
      imageUrl: props.imageUrl,
      languagePreference: props.languagePreference,
      dateAdded: props.dateAdded,
    })
  }

  toResDTO(): Partial<IUser> {
    return this.props
  }
}
