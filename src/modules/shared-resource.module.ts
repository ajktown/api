import { SharedResourceController } from '@/controllers/shared-resource.controller'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import { supportsModelDefinition } from '@/schemas/deprecated-supports.schema'
import { wordModelDefinition } from '@/schemas/deprecated-word.schema'
import { preferenceModelDefinition } from '@/schemas/preference.schema'
import { sharedResourceModelDefinition } from '@/schemas/shared-resources.schema'
import { SharedResourceService } from '@/services/shared-resource.service'
import { WordService } from '@/services/word.service'
import { Logger, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([
      sharedResourceModelDefinition,
      wordModelDefinition,
      supportsModelDefinition,
      preferenceModelDefinition,
    ]),
  ],
  controllers: [SharedResourceController],
  providers: [
    Logger,
    SharedResourceService,
    WordService,
    TermToExamplePrompt,
    GetWordQueryFactory,
  ],
})
export class SharedResourceModule {}
