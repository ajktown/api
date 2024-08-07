import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Patch,
} from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { AjkTownApiVersion } from './index.interface'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { PatchWordByIdBodyDTO } from '@/dto/patch-word-body.dto'
import { SemesterService } from '@/services/semester.service'
import { PostWordRes } from '@/responses/post-word.res'

export enum WordControllerPath {
  PostWord = `words`,
  GetWords = `words`,
  GetWordIds = `word-ids`,
  GetWordById = `words/:id`,
  PatchWordById = `/words/:id`,
  DeleteWordById = `words/:id`,
}

@Controller(AjkTownApiVersion.V1)
export class WordController {
  constructor(
    private readonly wordService: WordService,
    private readonly semesterService: SemesterService,
    private readonly jwtService: JwtService,
  ) {}

  @Post(WordControllerPath.PostWord)
  async post(@Req() req: Request, @Body() reqDto: PostWordBodyDTO) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    const response: PostWordRes = {
      // The order matters postedWord -> semesters, as semesters may be updated after post word.
      postedWord: (await this.wordService.post(atd, reqDto)).toResDTO(atd),
      semesters: (await this.semesterService.getSemesters(atd)).toResDTO(),
    }
    return response
  }

  @Get(WordControllerPath.GetWords)
  async getWords(@Req() req: Request, @Query() query: GetWordQueryDTO) {
    return (
      await this.wordService.get(
        await AccessTokenDomain.fromReq(req, this.jwtService),
        query,
      )
    ).toResDTO()
  }

  @Get(WordControllerPath.GetWordIds)
  async getWordIds(@Req() req: Request, @Query() query: GetWordQueryDTO) {
    return (
      await this.wordService.get(
        await AccessTokenDomain.fromReq(req, this.jwtService),
        query,
      )
    ).toGetWordIdsResDTO()
  }

  @Get(WordControllerPath.GetWordById)
  async getWordById(@Req() req: Request, @Param('id') id: string) {
    return (await this.wordService.getById(id)).toResDTO(
      await AccessTokenDomain.fromReq(req, this.jwtService),
    )
  }

  @Patch(WordControllerPath.PatchWordById)
  async patchWordById(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: PatchWordByIdBodyDTO,
  ) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.wordService.patchWordById(id, atd, body)).toResDTO(atd)
  }

  @Delete(WordControllerPath.DeleteWordById)
  async deleteWordById(@Req() req: Request, @Param('id') id: string) {
    return this.wordService.deleteById(
      id,
      await AccessTokenDomain.fromReq(req, this.jwtService),
    )
  }
}
