import { Body, Controller, Post } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { SmartPostWordBodyDTO } from '@/dto/smart-post-word-body.dto'
import { SmartWordService } from '@/services/smart-word.service'

export enum SmartWordControllerPath {
  SmartPostWord = `smart-words`,
}

@Controller(AjkTownApiVersion.V1)
export class SmartWordController {
  constructor(private readonly smartWordService: SmartWordService) {}

  @Post(SmartWordControllerPath.SmartPostWord)
  async post(@Body() reqDto: SmartPostWordBodyDTO) {
    return (await this.smartWordService.post(reqDto)).toResDTO()
  }
}
