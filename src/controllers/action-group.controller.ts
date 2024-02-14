import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionGroupService } from '@/services/action-group.service'
import { PostActionGroupDTO } from '@/dto/post-action-group.dto'

export enum ActionGroupControllerPath {
  GetActionGroups = `action-groups`,
  PostActionGroup = `action-groups`,
}

@Controller(AjkTownApiVersion.V1)
export class ActionGroupController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly actionGroupService: ActionGroupService,
  ) {}

  @Get(ActionGroupControllerPath.GetActionGroups)
  async getActionGroups(@Req() req: Request) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (
      await this.actionGroupService.getPostWordsActionGroup(atd)
    ).toResDTO(atd)
  }

  @Post(ActionGroupControllerPath.PostActionGroup)
  async postActionGroup(
    @Req() req: Request,
    @Body() reqDto: PostActionGroupDTO,
  ) {
    return await this.actionGroupService.post(
      await AccessTokenDomain.fromReq(req, this.jwtService),
      reqDto,
    )
  }
}
