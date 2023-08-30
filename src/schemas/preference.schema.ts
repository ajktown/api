import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

export type PreferenceDoc = HydratedDocument<PreferenceProps, DataBasicsDate>

export type PreferenceModel = Model<PreferenceDoc>

@Schema({
  collection: SchemaCollectionName.Preferences,
  timestamps: defaultSchemaTimestampsConfig,
})
export class PreferenceProps {
  @Prop({ required: true })
  ownerID: string // the owner id 5f85729......

  @Prop()
  nativeLanguages: string[] // ['en', 'ko', 'ja']
}

export const PreferenceSchema = SchemaFactory.createForClass(PreferenceProps)

export const preferenceModelDefinition: ModelDefinition = {
  name: PreferenceProps.name,
  schema: PreferenceSchema,
}
