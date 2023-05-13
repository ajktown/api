import { Controller, Get, Param, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { SemesterService } from '@/services/semester.service'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

enum ApiHomePath {
  GetSemesters = `semesters`,
  GetSemesterById = `semesters/:id`,
}
@Controller(AjkTownApiVersion.V1)
export class SemesterController {
  constructor(
    private readonly semesterService: SemesterService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(ApiHomePath.GetSemesters)
  getSemesters() {
    return this.semesterService.getSemesters()
  }

  @Get(ApiHomePath.GetSemesterById)
  async getSemesterById(@Param('id') id: string, @Req() req: Request) {
    return this.semesterService.getSemesterById(
      id,
      await AccessTokenDomain.fromReq(req, this.jwtService),
    )
  }
}
