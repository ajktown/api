import { Body, Controller, Post, Req } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { PostSharedResourceDTO } from '@/dto/post-shared-resource.dto'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { JwtService } from '@nestjs/jwt'
import { SharedResourceService } from '@/services/shared-resource.service'
import { Request } from 'express'
import { WordModel, WordProps } from '@/schemas/deprecated-word.schema'
import { InjectModel } from '@nestjs/mongoose'
import {
  SharedResourceModel,
  SharedResourceProps,
} from '@/schemas/shared-resources.schema'

export enum SharedResourceControllerPath {
  PostSharedResource = `shared-resource`,
  DeprecatedGetSharedResource = `shared-resource`,
  GetSharedResources = `shared-resources`,
}
@Controller(AjkTownApiVersion.V1)
export class SharedResourceController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sharedResourceService: SharedResourceService,
    @InjectModel(SharedResourceProps.name)
    private sharedResourceModel: SharedResourceModel,
    @InjectModel(WordProps.name)
    private wordModel: WordModel,
  ) {}

  @Post(SharedResourceControllerPath.PostSharedResource)
  async postSharedResource(
    @Req() req: Request,
    @Body() dto: PostSharedResourceDTO,
  ) {
    return (
      await this.sharedResourceService.post(
        await AccessTokenDomain.fromReq(req, this.jwtService),
        dto,
      )
    ).toResDTO(this.wordModel, this.sharedResourceModel)
  }
}
