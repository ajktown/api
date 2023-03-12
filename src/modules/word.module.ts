import { Module } from '@nestjs/common'
import { WordService } from '@/services/word.service'
import { WordController } from '@/controllers/word.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DeprecatedWordSchema,
  DeprecatedWordSchemaDefinitions,
} from '@/schemas/deprecated-word.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeprecatedWordSchemaDefinitions.name, schema: DeprecatedWordSchema },
    ]),
  ],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}
