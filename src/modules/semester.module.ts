import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DeprecatedWordSchema,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { SemesterController } from '@/controllers/semester.controller'
import { SemesterService } from '@/services/semester.service'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeprecatedWordSchemaProps.name, schema: DeprecatedWordSchema },
    ]),
  ],
  controllers: [SemesterController],
  providers: [SemesterService, GetWordQueryFactory],
})
export class SemesterModule {}
