import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionGroupService } from '@/services/action-group.service'
import { PostActionGroupDTO } from '@/dto/post-action-group.dto'

export enum ActionGroupControllerPath {
  PostActionGroup = `action-groups`,
  PostActionByActionGroup = `action-groups/:id/actions`,
  GetActionGroups = `action-groups`,
  GetActionGroupById = `action-groups/:id`,
}

@Controller(AjkTownApiVersion.V1)
export class ActionGroupController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly actionGroupService: ActionGroupService,
  ) {}

  @Post(ActionGroupControllerPath.PostActionGroup)
  async postActionGroup(
    @Req() req: Request,
    @Body() reqDto: PostActionGroupDTO,
  ) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.actionGroupService.post(atd, reqDto)).toResDTO(atd)
  }

  @Post(ActionGroupControllerPath.PostActionByActionGroup)
  async postActionByActionGroup(@Req() req: Request, @Param('id') id: string) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (
      await this.actionGroupService.postActionByActionGroup(atd, id)
    ).toResDTO(atd)
  }

  @Get(ActionGroupControllerPath.GetActionGroups)
  async GetActionGroups(@Req() req: Request) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.actionGroupService.get(atd)).toResDTO(atd)
  }

  @Get(ActionGroupControllerPath.GetActionGroupById)
  async GetActionGroupById(@Req() req: Request, @Param('id') id: string) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.actionGroupService.getById(atd, id)).toResDTO(atd)
  }
}
