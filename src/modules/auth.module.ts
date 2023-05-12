import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthController } from '@/controllers/auth.controller'
import { AuthService } from '@/services/auth.service'
import {
  DeprecatedUserSchema,
  DeprecatedUserSchemaProps,
} from '@/schemas/deprecated-user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      // TODO: This mapping should be refactored somewhere else.
      { name: DeprecatedUserSchemaProps.name, schema: DeprecatedUserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
