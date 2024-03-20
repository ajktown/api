import { Logger, Module } from '@nestjs/common'
import { RitualService } from '@/services/ritual.service'
import { actionGroupModelDefinition } from '@/schemas/action-group.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { RitualController } from '@/controllers/ritual.controller'
import { ritualModelDefinition } from '@/schemas/ritual.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      ritualModelDefinition,
      actionGroupModelDefinition,
    ]),
  ],
  controllers: [RitualController],
  providers: [Logger, RitualService],
})
export class RitualModule {}
