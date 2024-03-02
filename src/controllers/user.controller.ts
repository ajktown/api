import { Controller, Get, Param, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { RitualService } from '@/services/ritual.service'

enum UserControllerPath {
  GetRitualsOfUserByNickname = `users/mlajkim/rituals`, // it is fixed to mlajkim as this point
}
@Controller(AjkTownApiVersion.V1)
export class UserController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ritualService: RitualService,
  ) {}

  @Get(UserControllerPath.GetRitualsOfUserByNickname)
  async getSemesters(@Req() req: Request) {
    return 'hello world'
  }
}
