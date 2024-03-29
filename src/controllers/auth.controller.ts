import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { AuthService } from '@/services/auth.service'
import { Request, Response } from 'express'
import { getResWithHttpCookieLambda } from '@/lambdas/get-res-with-http-cookie.lambda'
import { getResWithRemovedHttpCookieLambda } from '@/lambdas/get-res-with-removed-http-cookie.lambda'
import { JwtService } from '@nestjs/jwt'

export enum AuthControllerPath {
  PostSignOut = `auth/sign-out`,
  PostDevTokenAuth = `auth/dev-token`,
  PostGoogleAuth = `auth/google`,
  GetAuthPrep = `auth/prep`,
}

@Controller(AjkTownApiVersion.V1)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post(AuthControllerPath.PostSignOut)
  async postSignOut(@Res() response: Response) {
    return getResWithRemovedHttpCookieLambda(response).send({
      message: 'Successfully Signed Out',
    })
  }

  @Post(AuthControllerPath.PostGoogleAuth)
  async postGoogleAuth(
    @Body() reqDto: PostAuthGoogleBodyDTO,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    const atd = await this.authService.byGoogle(reqDto, req)
    return getResWithHttpCookieLambda(
      response,
      await atd.toAccessToken(this.jwtService),
    ).send({ message: 'OK' })
  }

  @Post(AuthControllerPath.PostDevTokenAuth)
  async postDevAuth(@Req() req: Request, @Res() response: Response) {
    const atd = await this.authService.byDevToken(req)
    return getResWithHttpCookieLambda(
      response,
      await atd.toAccessToken(this.jwtService),
    ).send({ message: 'OK' })
  }

  /** Returns the basic signed in information for front-end user. Also attaches the refreshed access token
   * if User has a valid access token attached.`
   * FYI: Once you call @Res(), you need to manually call response.send() to send the response.
   */
  @Get(AuthControllerPath.GetAuthPrep)
  async getAuthPrep(@Req() req: Request, @Res() response: Response) {
    const authPrepRes = (await this.authService.getAuthPrep(req)).toResDTO()
    try {
      return getResWithHttpCookieLambda(
        response,
        await (
          await this.authService.byRequest(req)
        ).toAccessToken(this.jwtService),
      ).send(authPrepRes)
    } catch {
      response.send(authPrepRes)
    }
  }
}
