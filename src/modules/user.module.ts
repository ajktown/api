import { Logger, Module } from '@nestjs/common'
import { RitualService } from '@/services/ritual.service'
import { actionGroupModelDefinition } from '@/schemas/action-group.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from '@/controllers/user.controller'

@Module({
  imports: [MongooseModule.forFeature([actionGroupModelDefinition])],
  controllers: [UserController],
  providers: [Logger, RitualService],
})
export class UserModule {}
