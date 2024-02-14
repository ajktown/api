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
    const query = new GetWordQueryDTO()
    query.daysAgoUntilToday = 365 // shows only 365 days until today

    return ActionGroupDomain.fromWordChunk(
      atd,
      await this.wordService.get(atd, query),
    )
  }
}
