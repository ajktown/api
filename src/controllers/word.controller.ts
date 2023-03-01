import { Controller, Get, Param } from '@nestjs/common'
import { WordService } from '@/services/word.service'

const API_VERSION = "v1"
export enum WordControllerPath {
  GetWords = `words`,
  GetWordById = `words/:word_id`,
}

@Controller(API_VERSION)
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(WordControllerPath.GetWords)
  async getWords() {
    return this.wordService.get()
  }

  @Get(WordControllerPath.GetWordById)
  async getWordById(
    @Param('word_id') wordId: string // TODO: Put validation here
  ) {
    return this.wordService.getById(wordId)
  }
}
