import { Module } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { WordController } from '@/controllers/word.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DeprecatedWordSchema,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { ChatGptService } from '@/services/chat-gpt.service'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeprecatedWordSchemaProps.name, schema: DeprecatedWordSchema },
    ]),
  ],
  controllers: [WordController],
  providers: [WordService, ChatGptService, TermToExamplePrompt],
})
export class WordModule {}
