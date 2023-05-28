import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { AjkTownApiVersion } from './index.interface'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { getPaginationHandler } from '@/handlers/get-pagination.handler'

export enum WordControllerPath {
  PostWord = `words`,
  GetWords = `words`,
  GetWordIds = `word-ids`,
  GetWordById = `words/:id`,
}

@Controller(AjkTownApiVersion.V1)
export class WordController {
  constructor(
    private readonly wordService: WordService,
    private readonly jwtService: JwtService,
  ) {}

  @Post(WordControllerPath.PostWord)
  async post(@Req() req: Request, @Body() reqDto: PostWordBodyDTO) {
    return this.wordService.post(
      await AccessTokenDomain.fromReq(req, this.jwtService),
      reqDto,
    )
  }

  @Get(WordControllerPath.GetWords)
  async getWords(@Req() req: Request, @Query() query: GetWordQueryDTO) {
    return this.wordService.get(
      await AccessTokenDomain.fromReq(req, this.jwtService),
      query,
    )
  }

  @Get(WordControllerPath.GetWordIds)
  async getWordIds(@Req() req: Request, @Query() query: GetWordQueryDTO) {
    return getPaginationHandler(
      await this.wordService.getWordIds(
        await AccessTokenDomain.fromReq(req, this.jwtService),
        query,
      ),
      query,
    )
  }

  @Get(WordControllerPath.GetWordById)
  async getWordById(
    @Req() req: Request,
    @Param('id') id: string, // TODO: Put validation here
  ) {
    return this.wordService.getById(
      id,
      await AccessTokenDomain.fromReq(req, this.jwtService),
    )
  }
}
