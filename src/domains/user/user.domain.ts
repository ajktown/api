import { UserDoc, UserModel } from '@/schemas/deprecated-user.schema'
import { IUser } from './index.interface'
import { envLambda } from '@/lambdas/get-env.lambda'
import { OauthPayloadDomain } from '../auth/oauth-payload.domain'
import { BadRequestError } from '@/errors/400/index.error'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { ForbiddenError } from '@/errors/403/index.error'

export class UserDomain {
  private readonly props: Partial<IUser>

  private constructor(props: Partial<IUser>) {
    this.props = props
  }

  /** This can be run only when it is non-production */
  static underDevEnv(): UserDomain {
    if (envLambda.mode.isProduct())
      throw new ForbiddenError(
        'You cannot create dev user under production environment',
      )

    return new UserDomain({
      id: 'abc',
      federalID: 'abc',
      givenName: 'AJ',
      familyName: 'Kim',
      email: 'jkim67cloud@gmail.com',
      imageUrl:
        'https://www.shutterstock.com/image-vector/web-developer-design-vector-illustration-600w-314602454.jpg',
      languagePreference: 'en',
      dateAdded: new Date().valueOf(),
    })
  }

  /** Returns user domain with payload domain. If no such user exists, it is considered a new user
   * and will create a user & return the user domain.
   */
  static async fromOauthPayload(
    oauthPayload: OauthPayloadDomain,
    userModel: UserModel,
  ): Promise<UserDomain> {
    const userDoc = await userModel.find(oauthPayload.toFind()).limit(1).exec()
    if (userDoc.length > 1)
      throw new BadRequestError(
        'Two or more users fatally have the same email addresses',
      )
    if (userDoc.length === 0) {
      // no user found. create one
      return UserDomain.fromMdb(
        await oauthPayload.toUserModel(userModel).save(),
      )
    }
    return UserDomain.fromMdb(userDoc[0])
  }

  static fromMdb(props: UserDoc): UserDomain {
    if (typeof props !== 'object') throw new DataNotObjectError()

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
