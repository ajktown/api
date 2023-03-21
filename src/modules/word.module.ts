import { Module } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { WordController } from '@/controllers/word.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DeprecatedWordSchema,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeprecatedWordSchemaProps.name, schema: DeprecatedWordSchema },
    ]),
  ],
  controllers: [WordController],
  providers: [WordService, TermToExamplePrompt],
})
export class WordModule {}
