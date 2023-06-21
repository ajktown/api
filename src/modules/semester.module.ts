import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WordsSchema, WordProps } from '@/schemas/deprecated-word.schema'
import { SemesterController } from '@/controllers/semester.controller'
import { SemesterService } from '@/services/semester.service'
import {
  SupportProps,
  SupportsSchema,
} from '@/schemas/deprecated-supports.schema'
import { GetSemesterQueryFactory } from '@/factories/get-semester-query.factory'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WordProps.name, schema: WordsSchema },
      {
        name: SupportProps.name,
        schema: SupportsSchema,
      },
    ]),
  ],
  controllers: [SemesterController],
  providers: [SemesterService, GetSemesterQueryFactory, GetWordQueryFactory],
})
export class SemesterModule {}
