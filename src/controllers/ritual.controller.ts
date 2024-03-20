import { Controller, Get, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { RitualService } from '@/services/ritual.service'

/**
 * Warning: Since Action Group is a huge domain, it only returns the ids of the action groups.
 */
export enum RitualControllerPath {
  GetRituals = `rituals`,
}

@Controller(AjkTownApiVersion.V1)
export class RitualController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ritualService: RitualService,
  ) {}

  @Get(RitualControllerPath.GetRituals)
  async getRituals(@Req() req: Request) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.ritualService.byAtd(atd)).toResDTO(atd)
  }
}
