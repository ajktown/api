import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { AjkTownApiVersion } from './index.interface'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'

export enum WordControllerPath {
  GetWords = `words`,
  GetWordById = `words/:id`,
  PostWord = `words`,
}

@Controller(AjkTownApiVersion.V1)
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(WordControllerPath.GetWords)
  async getWords(@Query() query: GetWordQueryDTO) {
    return this.wordService.get(query)
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
