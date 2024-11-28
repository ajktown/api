import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { UserDomain } from '@/domains/user/user.domain'
import { PatchUserDTO } from '@/dto/patch-user.dto'
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

  async patchUser(atd: AccessTokenDomain, body: PatchUserDTO): Promise<void> {
    // if body length is 0, it is a bad request:
    if (Object.keys(body).length === 0)
      throw new BadRequestError('Body [PatchUserDTO] is empty')

    // nicname update requires the following check:
    // the nickname must be unique:

    const users = await this.userModel.find({ nickname: body.nickname })
    if (users.length > 0)
      throw new BadRequestError(`Nickname [${body.nickname}] already exists`)

    // update the user
    await this.userModel.updateOne(
      { _id: atd.userId },
      { nickname: body.nickname },
    )
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
