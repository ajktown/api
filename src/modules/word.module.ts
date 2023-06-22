import { Module } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { WordController } from '@/controllers/word.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { WordsSchema, WordProps } from '@/schemas/deprecated-word.schema'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import {
  SupportProps,
  SupportsSchema,
} from '@/schemas/deprecated-supports.schema'
import { GetSemesterQueryFactory } from '@/factories/get-semester-query.factory'

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
  controllers: [WordController],
  providers: [
    WordService,
    TermToExamplePrompt,
    GetWordQueryFactory,
    GetSemesterQueryFactory,
  ],
})
export class WordModule {}
