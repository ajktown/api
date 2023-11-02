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

@Injectable()
export class SharedResourceService {
  constructor(
    @InjectModel(SharedResourceProps.name)
    private sharedResourceModel: SharedResourceModel,
    private wordService: WordService,
  ) {}

  async postSharedResource(
    atd: AccessTokenDomain,
    dto: PostSharedResourceDTO,
  ): Promise<SharedResourceDomain> {
    return SharedResourceDomain.post(
      atd,
      dto,
      this.sharedResourceModel,
      this.wordService,
    )
  }
}
