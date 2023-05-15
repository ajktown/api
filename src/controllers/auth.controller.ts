import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { AuthService } from '@/services/auth.service'
import { Request, Response } from 'express'
import { getResWithHttpCookieLambda } from '@/lambdas/get-res-with-http-cookie.lambda'

export enum AuthControllerPath {
  PostDevTokenAuth = `auth/dev-token`,
  PostGoogleAuth = `auth/google`,
  GetAuthPrep = `auth/prep`,
}

@Controller(AjkTownApiVersion.V1)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthControllerPath.PostGoogleAuth)
  async postGoogleAuth(
    @Body() reqDto: PostAuthGoogleBodyDTO,
    @Res() response: Response,
  ) {
    const data = await this.authService.byGoogle(reqDto)
    getResWithHttpCookieLambda(response, data).send({ message: 'OK' })
  }

  @Post(AuthControllerPath.PostDevTokenAuth)
  async postDevAuth(@Res() response: Response) {
    const data = await this.authService.byDevToken()
    getResWithHttpCookieLambda(response, data).send({ message: 'OK' })
  }

  @Get(AuthControllerPath.GetAuthPrep)
  async getAuthPrep(@Req() req: Request) {
    return this.authService.getAuthPrep(req)
  }
}
