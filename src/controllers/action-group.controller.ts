import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionGroupService } from '@/services/action-group.service'
import { PostActionGroupDTO } from '@/dto/post-action-group.dto'
import { PostActionBodyDTO } from '@/dto/post-action.dto'
import { PostArchiveActionGroupBodyDTO } from '@/dto/post-archived-action-group.dto'

/**
 * Warning: Since Action Group is a huge domain, it only returns the ids of the action groups.
 */
export enum ActionGroupControllerPath {
  PostActionGroup = `action-groups`,
  PostActionByActionGroup = `action-groups/:id/actions`,
  PostArchiveActionGroup = `action-groups/:id/archive`,
  GetActionGroupById = `action-groups/:id`,
  DeleteTodayActionByActionGroup = `action-groups/:id/actions/today`,
  DeleteYesterdayActionByActionGroup = `action-groups/:id/actions/yesterday`,
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
  async postActionByActionGroup(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: PostActionBodyDTO,
  ) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (
      await this.actionGroupService.postActionByActionGroup(atd, id, dto)
    ).toResDTO(atd)
  }

  @Post(ActionGroupControllerPath.PostArchiveActionGroup)
  async postArchiveActionGroup(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: PostArchiveActionGroupBodyDTO,
  ) {
    await this.actionGroupService.archiveActionGroup(
      await AccessTokenDomain.fromReq(req, this.jwtService),
      id,
      dto,
    )
  }

  @Get(ActionGroupControllerPath.GetActionGroupById)
  async GetActionGroupById(@Req() req: Request, @Param('id') id: string) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.actionGroupService.getById(atd, id)).toResDTO(atd)
  }

  @Delete(ActionGroupControllerPath.DeleteTodayActionByActionGroup)
  async deleteTodayActionByActionGroup(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.actionGroupService.deleteTodayAction(atd, id)).toResDTO(
      atd,
    )
  }

  @Delete(ActionGroupControllerPath.DeleteYesterdayActionByActionGroup)
  async deleteYesterdayActionByActionGroup(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (
      await this.actionGroupService.deleteYesterdayAction(atd, id)
    ).toResDTO(atd)
  }
}
