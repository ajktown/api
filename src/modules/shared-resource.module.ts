import { SharedResourceController } from '@/controllers/shared-resource.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [SharedResourceController],
  providers: [],
})
export class SharedResourceModule {}
