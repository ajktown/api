import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { AjkTownApiVersion } from './index.interface'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

export enum WordControllerPath {
  GetWords = `words`,
  GetWordIds = `word-ids`,
  GetWordById = `words/:id`,
  PostWord = `words`,
}

@Controller(AjkTownApiVersion.V1)
export class WordController {
  constructor(
    private readonly wordService: WordService,
    private readonly jwtService: JwtService,
  ) {}

  private getAtd(@Req() req: Request) {
    return AccessTokenDomain.fromReq(req, this.jwtService)
  }

  @Get(WordControllerPath.GetWords)
  async getWords(@Req() req: Request, @Query() query: GetWordQueryDTO) {
    return this.wordService.get(await this.getAtd(req), query)
  }

  @Get(WordControllerPath.GetWordIds)
  async getWordIds(@Req() req: Request, @Query() query: GetWordQueryDTO) {
    return this.wordService.getWordIds(await this.getAtd(req), query)
  }

  @Get(WordControllerPath.GetWordById)
  async getWordById(
    @Param('id') id: string, // TODO: Put validation here
  ) {
    return this.wordService.getById(id)
  }

  @Post(WordControllerPath.PostWord)
  async post(@Body() reqDto: PostWordBodyDTO) {
    return (await this.wordService.post(reqDto)).toResDTO()
  }
}
