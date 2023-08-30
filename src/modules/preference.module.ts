import { Logger, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PreferenceController } from '@/controllers/preference.controller'
import { PreferenceService } from '@/services/preference.service'
import { preferenceModelDefinition } from '@/schemas/preference.schema'

@Module({
  imports: [MongooseModule.forFeature([preferenceModelDefinition])],
  controllers: [PreferenceController],
  providers: [Logger, PreferenceService],
})
export class PreferenceModule {}
