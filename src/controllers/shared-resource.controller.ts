import { Body, Controller, Post, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { PostSharedResourceDTO } from '@/dto/post-shared-resource.dto'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { JwtService } from '@nestjs/jwt'
import { SharedResourceService } from '@/services/shared-resource.service'
import { Request } from 'express'

enum SemesterControllerPath {
  PostSharedResource = `shared-resource`,
}
@Controller(AjkTownApiVersion.V1)
export class SharedResourceController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sharedResourceService: SharedResourceService,
  ) {}

  @Post(SemesterControllerPath.PostSharedResource)
  async postSharedResource(
    @Req() req: Request,
    @Body() dto: PostSharedResourceDTO,
  ) {
    return this.sharedResourceService.postSharedResource(
      await AccessTokenDomain.fromReq(req, this.jwtService),
      dto,
    )
  }
}
