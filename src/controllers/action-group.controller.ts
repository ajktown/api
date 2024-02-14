import { Controller, Get, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionGroupService } from '@/services/action-group.service'

export enum ActionGroupControllerPath {
  GetActionGroups = `action-groups`,
}

@Controller(AjkTownApiVersion.V1)
export class ActionGroupController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly actionGroupService: ActionGroupService,
  ) {}

  @Get(ActionGroupControllerPath.GetActionGroups)
  async getActionGroups(@Req() req: Request) {
    return await this.actionGroupService.getPostWordsActionGroup(
      await AccessTokenDomain.fromReq(req, this.jwtService),
    )
  }
}
