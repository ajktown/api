import { Controller, Get, Param } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { RitualService } from '@/services/ritual.service'
import { UserService } from '@/services/user.service'
import { ActionGroupService } from '@/services/action-group.service'

/**
 * Every endpoints of UserController is public and does not require any authentication.
 * Owner of the resource however may not be set as public as the owner wishes
 * and may still return 403.
 */
export enum UserControllerPath {
  GetRitualsOfUserByNickname = `users/mlajkim/rituals`, // it is fixed to mlajkim as this point
  GetActionGroupsOfUserById = `users/mlajkim/action-groups/:id`, // it is fixed to mlajkim as this point
}
@Controller(AjkTownApiVersion.V1)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ritualService: RitualService,
    private readonly actionGroupService: ActionGroupService,
  ) {}

  @Get(UserControllerPath.GetRitualsOfUserByNickname)
  async getRitualsOfUserNameByNickname() {
    const user = await this.userService.byNickname('mlajkim') // TODO: This is fixed as mlajkim, but will be changed to dynamic later
    return (await this.ritualService.byUser(user)).toSharedResDTO()
  }

  @Get(UserControllerPath.GetActionGroupsOfUserById)
  async getActionGroupsOfUserById(@Param('id') id: string) {
    const user = await this.userService.byNickname('mlajkim') // TODO: This is fixed as mlajkim, but will be changed to dynamic later
    return (await this.actionGroupService.getById(null, id)).toSharedResDTO(
      user.id,
    )
  }
}
