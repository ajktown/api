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
  nativeLanguages: string[] // i.e) ['en', 'ko', 'ja']

  @Prop()
  selectedDictIds: string[] // i.e) ['google_en_en', 'naver_dictionary_ko_ko']
}

export const PreferenceSchema = SchemaFactory.createForClass(PreferenceProps)

export const preferenceModelDefinition: ModelDefinition = {
  name: PreferenceProps.name,
  schema: PreferenceSchema,
}
