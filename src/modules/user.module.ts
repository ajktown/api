import { Logger, Module } from '@nestjs/common'
import { RitualService } from '@/services/ritual.service'
import { actionGroupModelDefinition } from '@/schemas/action-group.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from '@/controllers/user.controller'
import { userModelDefinition } from '@/schemas/deprecated-user.schema'
import { UserService } from '@/services/user.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      userModelDefinition,
      actionGroupModelDefinition,
    ]),
  ],
  controllers: [UserController],
  providers: [Logger, UserService, RitualService],
})
export class UserModule {}
