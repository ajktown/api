import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DeprecatedWordSchema,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { RandomSampleToWordPrompt } from '@/prompts/random-sentence-to-word.prompt'
import { SmartWordService } from '@/services/smart-word.service'
import { SmartWordController } from '@/controllers/smart-word.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeprecatedWordSchemaProps.name, schema: DeprecatedWordSchema },
    ]),
  ],
  controllers: [SmartWordController],
  providers: [SmartWordService, RandomSampleToWordPrompt],
})
export class SmartWordModule {}
