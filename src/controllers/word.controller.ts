import { Controller, Get, Param } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { AjkTownApiVersion } from './index.interface'

export enum WordControllerPath {
  GetWords = `words`,
  GetWordById = `words/:id`,
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
}
