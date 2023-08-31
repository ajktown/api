import { Body, Controller, Get, Put, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { PreferenceService } from '@/services/preference.service'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { PutPreferenceDto } from '@/dto/put-preference.dto'

export enum PreferenceControllerPath {
  GetPreference = `preference`,
  PutPreference = `preference`,
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

  @Put(PreferenceControllerPath.PutPreference)
  async putPreference(@Req() req: Request, @Body() reqDto: PutPreferenceDto) {
    return (
      await this.preferenceService.put(
        await AccessTokenDomain.fromReq(req, this.jwtService),
        reqDto,
      )
    ).toResDTO()
  }
}
