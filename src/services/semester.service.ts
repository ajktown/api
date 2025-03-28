import { Injectable } from '@nestjs/common'
import { WordProps, WordModel } from '@/schemas/deprecated-word.schema'
import { InjectModel } from '@nestjs/mongoose'
import { SemesterDetailsDomain } from '@/domains/semester/semester-details.domain'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { SemesterChunkDomain } from '@/domains/semester/semester-chunk.domain'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { SemesterDomain } from '@/domains/semester/semester.domain'
import {
  SupportProps,
  SupportModel,
} from '@/schemas/deprecated-supports.schema'
import { SupportDomain } from '@/domains/support/support.domain'
import { WordChunkDomain } from '@/domains/word/word-chunk.domain'

@Injectable()
export class SemesterService {
  constructor(
    @InjectModel(WordProps.name)
    private readonly wordModel: WordModel,
    @InjectModel(SupportProps.name)
    private readonly supportModel: SupportModel,
    private readonly getWordQueryFactory: GetWordQueryFactory,
  ) {}

  async getSemesters(atd: AccessTokenDomain): Promise<SemesterChunkDomain> {
    const supportDomain = await SupportDomain.fromMdbByAtd(
      atd,
      this.supportModel,
    )
    return SemesterChunkDomain.fromSupportDomain(supportDomain, atd)
  }

  async getSemesterByCode(
    code: number,
    atd: AccessTokenDomain,
  ): Promise<SemesterDomain> {
    const semester = (await this.getSemesters(atd)).getSemesterByCode(code, atd)

    const query = new GetWordQueryDTO()
    query.semester = semester.semester

    return semester.insertDetails(
      SemesterDetailsDomain.fromWordDomains(
        atd,
        (
          await WordChunkDomain.fromMdb(
            atd,
            query,
            this.wordModel,
            this.supportModel,
            this.getWordQueryFactory,
          )
        ).wordDomains,
      ),
    )
  }
}
