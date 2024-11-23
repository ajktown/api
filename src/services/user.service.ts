import { UserDomain } from '@/domains/user/user.domain'
import { BadRequestError } from '@/errors/400/index.error'
import { envLambda } from '@/lambdas/get-env.lambda'
import { GetUsersRes } from '@/responses/get-users.res'
import { UserModel, UserProps } from '@/schemas/deprecated-user.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserProps.name)
    private readonly userModel: UserModel,
  ) {}

  // TODO: Should return domain, but for now, simplicity.
  async getUsers(): Promise<GetUsersRes> {
    // get all users
    const users = await this.userModel.find()
    const totalNumberOfUsers = users.length
    const lastFiveJoinedDate = users
      .sort((a, b) => b.dateAdded - a.dateAdded)
      .slice(0, 5)
      .map((user) => new Date(user.dateAdded).toISOString())

    return { totalNumberOfUsers, lastFiveJoinedDate }
  }

  /** Returns user by nickname */
  async byNickname(nickname: string): Promise<UserDomain> {
    // TODO: Only returns dev user domain at this point, if it is non-prod env. Fix it.
    if (!envLambda.mode.isProduct()) return UserDomain.underDevEnv()

    // TODO: Only supports nickname mlajkim at this point. Fix it some point
    if (nickname !== 'mlajkim') throw new BadRequestError('Nickname not found')

    // TODO: Only returns mlajkim (or jkim67cloud) user domain at this point. Fix it.
    const email = 'jkim67cloud@gmail.com' // mlajkim's email
    return UserDomain.fromEmail(email, this.userModel)
  }
}
