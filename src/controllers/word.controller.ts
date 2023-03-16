import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { AjkTownApiVersion } from './index.interface'
import { PostWordReqDTO } from '@/dto/post-word.req-dto'

export enum WordControllerPath {
  GetWords = `words`,
  GetWordById = `words/:id`,
  PostWord = `words`,
}

@Controller(AjkTownApiVersion.V1)
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(WordControllerPath.GetWords)
  async getWords() {
    return this.wordService.get()
  }

  @Get(WordControllerPath.GetWordById)
  async getWordById(
    @Param('id') id: string, // TODO: Put validation here
  ) {
    return this.wordService.getById(id)
  }

  @Post(WordControllerPath.PostWord)
  async post(@Body() reqDto: PostWordReqDTO) {
    const res = (await this.wordService.post(reqDto)).toResDTO()
    return res
  }
}
