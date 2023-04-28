import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DeprecatedWordSchema,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { AuthController } from '@/controllers/auth.controller'
import { AuthService } from '@/services/auth.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeprecatedWordSchemaProps.name, schema: DeprecatedWordSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
