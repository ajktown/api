import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { AuthService } from '@/services/auth.service'
import { Response } from 'express'
import { setHttpOnlyCookieLambda } from '@/lambdas/set-htttp-only.lambda'

export enum AuthControllerPath {
  GetWhoAmI = `auth/who-am-i`,
  PostGoogleAuth = `auth/google`,
}

@Controller(AjkTownApiVersion.V1)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthControllerPath.PostGoogleAuth)
  async post(@Body() reqDto: PostAuthGoogleBodyDTO, @Res() response: Response) {
    const data = await this.authService.byGoogle(reqDto)
    // Write a http cookie and return response
    const res = setHttpOnlyCookieLambda(response, data)
    res.send({ message: 'OK' })
  }

  @Get(AuthControllerPath.GetWhoAmI)
  async getWhoAmI(@Req() req: Request) {
    return this.authService.getWhoAmi(req)
  }
}
