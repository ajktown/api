import { Module } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { WordController } from '@/controllers/word.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DeprecatedWordSchema,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
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
  controllers: [WordController],
  providers: [
    WordService,
    TermToExamplePrompt,
    GetWordQueryFactory,
    GetSemesterQueryFactory,
  ],
})
export class WordModule {}
