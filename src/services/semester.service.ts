import { Injectable } from '@nestjs/common'
import { WordDomain } from '@/domains/word/word.domain'
import {
  DeprecatedWordDocument,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SemesterDetailsDomain } from '@/domains/semester/semester-details.domain'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { SemesterChunkDomain } from '@/domains/semester/semester-chunk.domain'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { SemesterDomain } from '@/domains/semester/semester.domain'
import {
  DeprecatedSupportSchemaProps,
  DeprecatedSupportsDocument,
} from '@/schemas/deprecated-supports.schema'
import { GetSemesterQueryFactory } from '@/factories/get-semester-query.factory'
import { SupportDomain } from '@/domains/support/support.domain'

@Injectable()
export class SemesterService {
  constructor(
    @InjectModel(DeprecatedWordSchemaProps.name)
    private deprecatedWordModel: Model<DeprecatedWordDocument>,
    @InjectModel(DeprecatedSupportSchemaProps.name)
    private deprecatedSupportsSchema: Model<DeprecatedSupportsDocument>,
    private getWordQueryFactory: GetWordQueryFactory,
    private getSemesterQueryFactory: GetSemesterQueryFactory,
  ) {}

  async getSemesters(atd: AccessTokenDomain): Promise<SemesterChunkDomain> {
    const supportDomain = SupportDomain.fromMdb(
      await this.deprecatedSupportsSchema
        .find(this.getSemesterQueryFactory.getFilter(atd))
        .exec(),
    )
    return SemesterChunkDomain.fromSupportDomain(supportDomain, atd)
  }

  async getSemesterByCode(
    code: number,
    atd: AccessTokenDomain,
  ): Promise<SemesterDomain> {
    const semester = (await this.getSemesters(atd)).getSemesterByCode(code)

    const query = new GetWordQueryDTO()
    query.semester = semester.semester

    const words = (
      await this.deprecatedWordModel
        .find(this.getWordQueryFactory.getFilter(atd, query))
        .exec()
    ).map((props) => WordDomain.fromMdb(props))

    return semester.insertDetails(SemesterDetailsDomain.fromWords(words, atd))
  }

  async syncSemesters(): // word: WordDomain
  Promise<void> {
    // TODO: Get data from deprecatedSupportModel
    // TODO: Get the current semester of the given wordDomain
    // TODO: Somehow create/modify semester data if not exist
    // TODO: Return void representing the success of the operation
  }
}
