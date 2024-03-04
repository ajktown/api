import { UserDoc, UserModel } from '@/schemas/deprecated-user.schema'
import { IUser } from './index.interface'
import { envLambda } from '@/lambdas/get-env.lambda'
import { OauthPayloadDomain } from '../auth/oauth-payload.domain'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { ForbiddenError } from '@/errors/403/index.error'
import { MoreThanOneUserWithTheSameEmailAddressError } from '@/errors/400/more-than-one-user-with-same-email-address.error'
import { NotExistOrNoPermissionError } from '@/errors/404/NotFoundError/not-exist-or-no-permission.error'

export class UserDomain {
  private readonly props: Partial<IUser>

  private constructor(props: Partial<IUser>) {
    this.props = props
  }

  get id() {
    return this.props.id
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
      // createdAt: new Date('1994-06-07'), // Confetti won't be visible with this option.
      createdAt: new Date(), // Confetti will be visible with this option.
    })
  }

  /** Returns user domain with payload domain. If no such user exists, it is considered a new user
   * and will create a user & return the user domain.
   */
  static async fromOauthPayload(
    oauthPayload: OauthPayloadDomain,
    userModel: UserModel,
  ): Promise<UserDomain> {
    const userDocs = await userModel.find(oauthPayload.toFind()).limit(1).exec()
    if (userDocs.length > 1)
      throw new MoreThanOneUserWithTheSameEmailAddressError()
    if (userDocs.length === 0) {
      // no user found. create one
      return UserDomain.fromMdb(
        await oauthPayload.toUserModel(userModel).save(),
      )
    }
    return UserDomain.fromMdb(userDocs[0])
  }

  /**
   * Find a user with email address.
   * If no such user exists, it does not create the user and simply returns
   * Not found error.
   */
  static async fromEmail(email: string, model: UserModel): Promise<UserDomain> {
    const userDocs = await model
      .find({
        email,
      })
      .limit(1)
      .exec()

    if (2 <= userDocs.length)
      throw new MoreThanOneUserWithTheSameEmailAddressError()

    if (userDocs.length === 0) {
      throw new NotExistOrNoPermissionError()
    }

    return UserDomain.fromMdb(userDocs[0])
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
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
  }

  // TODO: We need atd here for security sake and resDTO must have atd
  toResDTO(): Partial<IUser> {
    return this.props
  }
}
