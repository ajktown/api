import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthController } from '@/controllers/auth.controller'
import { AuthService } from '@/services/auth.service'
import { UsersSchema, UserProps } from '@/schemas/deprecated-user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      // TODO: This mapping should be refactored somewhere else.
      { name: UserProps.name, schema: UsersSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
