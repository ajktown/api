import { Body, Controller, Post } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { AuthService } from '@/services/auth.service'

export enum AuthControllerPath {
  PostGoogleAuth = `auth/google`,
}

@Controller(AjkTownApiVersion.V1)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthControllerPath.PostGoogleAuth)
  async post(@Body() reqDto: PostAuthGoogleBodyDTO) {
    return this.authService.byGoogle(reqDto)
  }
}
