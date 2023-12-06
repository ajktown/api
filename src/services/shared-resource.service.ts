import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import {
  SharedResourceModel,
  SharedResourceProps,
} from '@/schemas/shared-resources.schema'
import { PostSharedResourceDTO } from '@/dto/post-shared-resource.dto'
import { SharedResourceDomain } from '@/domains/shared-resource/shared-resource.domain'
import { WordService } from './word.service'
import { BadRequestError } from '@/errors/400/index.error'

@Injectable()
export class SharedResourceService {
  constructor(
    @InjectModel(SharedResourceProps.name)
    private sharedResourceModel: SharedResourceModel,
    private wordService: WordService,
  ) {}

  async post(
    atd: AccessTokenDomain,
    dto: PostSharedResourceDTO,
  ): Promise<SharedResourceDomain> {
    if (dto.wordId) {
      return SharedResourceDomain.postSharedWord(
        atd,
        dto,
        this.sharedResourceModel,
        this.wordService,
      )
    }

    throw new BadRequestError('Requires wordId')
    // Once there are more resources available other than wordId:
    // throw new BadRequestError('Requires at least one data: wordId, w/e or w/e')
  }

  async get(
    id: string,
    nullableAtd: null | AccessTokenDomain,
  ): Promise<SharedResourceDomain> {
    return SharedResourceDomain.fromGetSharedResource(
      id,
      nullableAtd,
      this.sharedResourceModel,
    )
  }
}
