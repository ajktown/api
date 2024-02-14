import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionGroupService } from '@/services/action-group.service'
import { PostActionGroupDTO } from '@/dto/post-action-group.dto'
import { ActionGroupFixedId } from '@/constants/action-group.const'

export enum ActionGroupControllerPath {
  GetActionGroupById = `action-groups/:id`,
  GetActionGroups = `action-groups`,
  PostActionGroup = `action-groups`,
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

  @Get(ActionGroupControllerPath.GetActionGroupById)
  async getActionGroups(@Req() req: Request, @Param('id') id: string) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)

    if (id === ActionGroupFixedId.DailyPostWordChallenge) {
      return (
        await this.actionGroupService.getPostWordsActionGroup(atd)
      ).toResDTO(atd)
    }

    return await this.actionGroupService.getById(id)
  @Get(ActionGroupControllerPath.GetActionGroups)
  async getActionGroups(@Req() req: Request) {
    return await this.actionGroupService.getPostWordsActionGroup(
      await AccessTokenDomain.fromReq(req, this.jwtService),
    )
  }
}
