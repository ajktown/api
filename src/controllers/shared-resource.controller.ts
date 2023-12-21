import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common'
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
import { GetSharedResourcesQueryDTO } from '@/dto/get-shared-resources-query.dto'
import { PutSharedResourceDTO } from '@/dto/put-shared-resource-dto'

export enum SharedResourceControllerPath {
  PostSharedResource = `shared-resource`,
  GetSharedResource = `shared-resource`,
  PutSharedResourceExtend = `shared-resource/:id/extend`,
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

  @Get(SharedResourceControllerPath.GetSharedResource)
  async getSharedResource(
    @Req() req: Request,
    @Query() dto: GetSharedResourcesQueryDTO,
  ) {
    let nullableAtd: null | AccessTokenDomain = null
    try {
      nullableAtd = await AccessTokenDomain.fromReq(req, this.jwtService)
    } catch {}

    return (await this.sharedResourceService.get(nullableAtd, dto)).toResDTO(
      this.wordModel,
      this.sharedResourceModel,
    )
  }

  @Put(SharedResourceControllerPath.PutSharedResourceExtend)
  async putSharedResourceExtend(
    @Req() req: Request,
    @Param('id') id: string,
    @Query() dto: PutSharedResourceDTO,
  ) {
    return (
      await this.sharedResourceService.getById(
        id,
        await AccessTokenDomain.fromReq(req, this.jwtService),
      )
    ).extend(dto, this.sharedResourceModel)
  }
}
