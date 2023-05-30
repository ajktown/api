import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DeprecatedWordSchema,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { SemesterController } from '@/controllers/semester.controller'
import { SemesterService } from '@/services/semester.service'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import {
  DeprecatedSupportSchemaProps,
  DeprecatedSupportsSchema,
} from '@/schemas/deprecated-supports.schema'
import { GetSemesterQueryFactory } from '@/factories/get-semester-query.factory'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeprecatedWordSchemaProps.name, schema: DeprecatedWordSchema },
      {
        name: DeprecatedSupportSchemaProps.name,
        schema: DeprecatedSupportsSchema,
      },
    ]),
  ],
  controllers: [SemesterController],
  providers: [SemesterService, GetWordQueryFactory, GetSemesterQueryFactory],
})
export class SemesterModule {}
