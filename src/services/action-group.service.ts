import { Injectable } from '@nestjs/common'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionGroupDomain } from '@/domains/action/action-group.domain'
import { WordService } from './word.service'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'

@Injectable()
export class ActionGroupService {
  constructor(private wordService: WordService) {}

  async getPostWordsActionGroup(
    atd: AccessTokenDomain,
  ): Promise<ActionGroupDomain> {
    const emptyQuery = new GetWordQueryDTO()
    const wordChunk = await this.wordService.get(atd, emptyQuery)

    return ActionGroupDomain.fromWordChunk(atd, wordChunk)
  }
}
