import { Controller, Get } from '@nestjs/common'
import { WordService } from '@/services/word.service'

export enum WordControllerPath {
  GetWords = `words`
}

@Controller()
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(WordControllerPath.GetWords)
  async getWords() {
    return this.wordService.get()
  }
}
