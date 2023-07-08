import { Module } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { WordController } from '@/controllers/word.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { wordModelDefinition } from '@/schemas/deprecated-word.schema'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { supportsModelDefinition } from '@/schemas/deprecated-supports.schema'
import { GetSemesterQueryFactory } from '@/factories/get-semester-query.factory'
import { SemesterService } from '@/services/semester.service'

@Module({
  imports: [
    MongooseModule.forFeature([wordModelDefinition, supportsModelDefinition]),
  ],
  controllers: [WordController],
  providers: [
    WordService,
    TermToExamplePrompt,
    GetWordQueryFactory,
    GetSemesterQueryFactory,
    SemesterService,
  ],
})
export class WordModule {}
