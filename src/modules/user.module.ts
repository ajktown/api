import { Logger, Module } from '@nestjs/common'
import { RitualService } from '@/services/ritual.service'
import { actionGroupModelDefinition } from '@/schemas/action-group.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from '@/controllers/user.controller'
import { userModelDefinition } from '@/schemas/deprecated-user.schema'
import { UserService } from '@/services/user.service'
import { wordModelDefinition } from '@/schemas/deprecated-word.schema'
import { supportsModelDefinition } from '@/schemas/deprecated-supports.schema'
import { actionModelDefinition } from '@/schemas/action.schema'
import { WordService } from '@/services/word.service'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { ActionGroupService } from '@/services/action-group.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      userModelDefinition,
      actionGroupModelDefinition,
      wordModelDefinition,
      supportsModelDefinition,
      actionModelDefinition,
    ]),
  ],
  controllers: [UserController],
  providers: [
    Logger,
    UserService,
    RitualService,
    WordService,
    TermToExamplePrompt,
    GetWordQueryFactory,
    ActionGroupService,
  ],
})
export class UserModule {}
