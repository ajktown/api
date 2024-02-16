import { Logger, Module } from '@nestjs/common'
import { RitualService } from '@/services/ritual.service'
import { actionGroupModelDefinition } from '@/schemas/action-group.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { RitualController } from '@/controllers/ritual.controller'

@Module({
  imports: [MongooseModule.forFeature([actionGroupModelDefinition])],
  controllers: [RitualController],
  providers: [Logger, RitualService],
})
export class RitualModule {}
