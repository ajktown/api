import { Body, Controller, Get, Patch, Query, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { RitualService } from '@/services/ritual.service'
import { PatchRitualGroupBodyDTO } from '@/dto/patch-ritual-group-body.dto'
import { GetRitualQueryDTO } from '@/dto/get-rituals-query.dto'

/**
 * Warning: Since Action Group is a huge domain, it only returns the ids of the action groups.
 */
export enum RitualControllerPath {
  GetRituals = `rituals`,
  PatchDefaultRitual = `rituals/default`,
  // TODO: Eventually the patch should be applied by ID, but since only one ritual exists on Mar 20, 2024, it is not implemented
}

@Controller(AjkTownApiVersion.V1)
export class RitualController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ritualService: RitualService,
  ) {}

  @Get(RitualControllerPath.GetRituals)
  async getRituals(@Req() req: Request, @Query() dto: GetRitualQueryDTO) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.ritualService.byAtd(atd)).toResDTO(atd, dto)
  }

  @Patch(RitualControllerPath.PatchDefaultRitual)
  async patchDefaultRitual(
    @Req() req: Request,
    @Body() dto: PatchRitualGroupBodyDTO,
  ) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.ritualService.patchDefault(atd, dto)).toResDTO(undefined)
  }
}
