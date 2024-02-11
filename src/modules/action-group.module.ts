import { Logger, Module } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { MongooseModule } from '@nestjs/mongoose'
import { wordModelDefinition } from '@/schemas/deprecated-word.schema'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { supportsModelDefinition } from '@/schemas/deprecated-supports.schema'
import { ActionGroupController } from '@/controllers/action-group.controller'
import { ActionGroupService } from '@/services/action-group.service'

@Module({
  imports: [
    MongooseModule.forFeature([wordModelDefinition, supportsModelDefinition]),
  ],
  controllers: [ActionGroupController],
  providers: [
    Logger,
    WordService,
    TermToExamplePrompt,
    GetWordQueryFactory,
    ActionGroupService,
  ],
})
export class ActionGroupModule {}
