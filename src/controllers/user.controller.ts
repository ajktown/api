import { Controller, Get } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { RitualService } from '@/services/ritual.service'
import { UserService } from '@/services/user.service'

/**
 * Every endpoints of UserController is public and does not require any authentication.
 * Owner of the resource however may not be set as public as the owner wishes
 * and may still return 403.
 */
export enum UserControllerPath {
  GetRitualsOfUserByNickname = `users/mlajkim/rituals`, // it is fixed to mlajkim as this point
}
@Controller(AjkTownApiVersion.V1)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ritualService: RitualService,
  ) {}

  @Get(UserControllerPath.GetRitualsOfUserByNickname)
  async getSemesters() {
    const user = await this.userService.byNickname('mlajkim') // ! This is fixed as mlajkim, but will be changed to dynamic later
    return (await this.ritualService.byUser(user)).toSharedResDTO()
  }
}
