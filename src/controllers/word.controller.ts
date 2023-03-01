import { Controller, Get } from '@nestjs/common'
import { WordService } from '@/services/word.service'

const API_VERSION = "v1"
export enum WordControllerPath {
  GetWords = `words`
}

@Controller(API_VERSION)
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(WordControllerPath.GetWords)
  async getWords() {
    return this.wordService.get()
  }
}
