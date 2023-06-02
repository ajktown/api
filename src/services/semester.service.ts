import { Injectable } from '@nestjs/common'
import { WordDomain } from '@/domains/word/word.domain'
import {
  DeprecatedWordSchemaProps,
  WordModel,
} from '@/schemas/deprecated-word.schema'
import { InjectModel } from '@nestjs/mongoose'
import { SemesterDetailsDomain } from '@/domains/semester/semester-details.domain'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { SemesterChunkDomain } from '@/domains/semester/semester-chunk.domain'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { SemesterDomain } from '@/domains/semester/semester.domain'
import {
  DeprecatedSupportSchemaProps,
  SupportModel,
} from '@/schemas/deprecated-supports.schema'
import { GetSemesterQueryFactory } from '@/factories/get-semester-query.factory'
import { SupportDomain } from '@/domains/support/support.domain'

@Injectable()
export class SemesterService {
  constructor(
    @InjectModel(DeprecatedWordSchemaProps.name)
    private wordModel: WordModel,
    @InjectModel(DeprecatedSupportSchemaProps.name)
    private supportModel: SupportModel,
    private getWordQueryFactory: GetWordQueryFactory,
    private getSemesterQueryFactory: GetSemesterQueryFactory,
  ) {}

  async getSemesters(atd: AccessTokenDomain): Promise<SemesterChunkDomain> {
    const supportDomain = await SupportDomain.fromMdb(atd, this.supportModel)
    return SemesterChunkDomain.fromSupportDomain(supportDomain, atd)
  }

  async getSemesterByCode(
    code: number,
    atd: AccessTokenDomain,
  ): Promise<SemesterDomain> {
    const semester = (await this.getSemesters(atd)).getSemesterByCode(code, atd)

    const query = new GetWordQueryDTO()
    query.semester = semester.semester

    const words = (
      await this.wordModel
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
