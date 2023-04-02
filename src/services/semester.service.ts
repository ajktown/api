import { Injectable } from '@nestjs/common'
import { DUMMY_SEMESTERS } from '@/domains/semester/index.dummy'
import { ISemester } from '@/domains/semester/index.interface'
import { WordDomain } from '@/domains/word/word.domain'
import {
  DeprecatedWordDocument,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SemesterDetailsDomain } from '@/domains/semester/semester-details.domain'

@Injectable()
export class SemesterService {
  constructor(
    @InjectModel(DeprecatedWordSchemaProps.name)
    private deprecatedWordModel: Model<DeprecatedWordDocument>,
  ) {}
  getSemesters(): Partial<ISemester>[] {
    return DUMMY_SEMESTERS.map((e) => e.toResDTO())
  }

  async getSemesterById(id: string): Promise<Partial<ISemester>> {
    const found = DUMMY_SEMESTERS.find((e) => e.id === id)
    if (!found) throw new Error('Not found!')

    const words = (
      await this.deprecatedWordModel.find({ sem: found.semester }).exec()
    ).map((props) => WordDomain.fromMdb(props))

    const details = SemesterDetailsDomain.fromWords(words).toDetails()
    found.insertDetails(details)

    return found.toResDTO()
  }
}
