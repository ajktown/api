import { SharedResourceController } from '@/controllers/shared-resource.controller'
import { sharedResourceModelDefinition } from '@/schemas/shared-resources.schema'
import { SharedResourceService } from '@/services/shared-resource.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [MongooseModule.forFeature([sharedResourceModelDefinition])],
  controllers: [SharedResourceController],
  providers: [SharedResourceService],
})
export class SharedResourceModule {}
