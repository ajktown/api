import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthController } from '@/controllers/auth.controller'
import { AuthService } from '@/services/auth.service'
import {
  userModelDefinition,
} from '@/schemas/deprecated-user.schema'

@Module({
  imports: [MongooseModule.forFeature([userModelDefinition])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
