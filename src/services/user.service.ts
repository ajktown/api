import { UserDomain } from '@/domains/user/user.domain'
import { UserModel, UserProps } from '@/schemas/deprecated-user.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserProps.name)
    private userModel: UserModel,
  ) {}

  /** Returns user by nickname */
  async byNickname(nickname: string): Promise<UserDomain> {
    // TODO: Not yet implemented
    return UserDomain.underDevEnv()
  }
}
