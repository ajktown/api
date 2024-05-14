import { Body, Controller, Get, Put, Req, Patch } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { PreferenceService } from '@/services/preference.service'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { PatchPreferenceDto } from '@/dto/put-preference.dto'

export enum PreferenceControllerPath {
  GetPreference = `preference`,
  PatchPreference = `preference`,
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

  // TODO: Delete me; deprecated and moved to PATCH instead
  @Put(PreferenceControllerPath.PatchPreference)
  async putPreference(@Req() req: Request, @Body() body: PatchPreferenceDto) {
    return (
      await this.preferenceService.patch(
        await AccessTokenDomain.fromReq(req, this.jwtService),
        body,
      )
    ).toResDTO()
  }

  @Patch(PreferenceControllerPath.PatchPreference)
  async patchPreference(@Req() req: Request, @Body() body: PatchPreferenceDto) {
    return (
      await this.preferenceService.patch(
        await AccessTokenDomain.fromReq(req, this.jwtService),
        body,
      )
    ).toResDTO()
  }
}
