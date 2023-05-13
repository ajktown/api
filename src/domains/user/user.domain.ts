import { DeprecatedUserDocument } from '@/schemas/deprecated-user.schema'
import { IUser } from './index.interface'
import { envLambda } from '@/lambdas/get-env.lambda'

export class UserDomain {
  private readonly props: Partial<IUser>

  private constructor(props: Partial<IUser>) {
    this.props = props
  }

  /** This can be run only when it is non-production */
  static underDevEnv(): UserDomain {
    if (envLambda.mode.isProduct())
      throw new Error('Cannot create dev user under production environment')

    return new UserDomain({
      id: 'abc',
      federalID: 'abc',
      givenName: 'AJ',
      familyName: 'Kim',
      email: 'jkim67cloud@gmail.com',
      imageUrl: '',
      languagePreference: 'en',
      dateAdded: new Date().valueOf(),
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
