import { Controller, Get, Param, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { SemesterService } from '@/services/semester.service'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

enum SemesterControllerPath {
  GetSemesters = `semesters`,
  GetSemesterByCode = `semesters/:code`, // TODO: Delete me later
}
@Controller(AjkTownApiVersion.V1)
export class SemesterController {
  constructor(
    private readonly semesterService: SemesterService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(SemesterControllerPath.GetSemesters)
  async getSemesters(@Req() req: Request) {
    return (
      await this.semesterService.getSemesters(
        await AccessTokenDomain.fromReq(req, this.jwtService),
      )
    ).toResDTO()
  }

  @Get(SemesterControllerPath.GetSemesterByCode)
  async getSemesterByCode(@Param('code') code: string, @Req() req: Request) {
    return (
      await this.semesterService.getSemesterByCode(
        parseInt(code), // TODO: Eventually the param will be also converted to number beforehand.
        await AccessTokenDomain.fromReq(req, this.jwtService),
      )
    ).toResDTO()
  }
}
