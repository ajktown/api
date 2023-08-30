import { Controller, Get, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { PreferenceService } from '@/services/preference.service'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'

export enum PreferenceControllerPath {
  GetPreference = `preferences`,
}

@Controller(AjkTownApiVersion.V1)
export class PreferenceController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly preferenceService: PreferenceService,
  ) {}

  @Get(PreferenceControllerPath.GetPreference)
  async getPreference(@Req() req: Request) {
    return (
      await this.preferenceService.get(
        await AccessTokenDomain.fromReq(req, this.jwtService),
      )
    ).toResDTO()
  }
}
