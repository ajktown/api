import { DataBasicsDate } from '@/global.interface'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

// TODO: This is deprecated MongoDB Schema of UserData

export type DeprecatedUserDocument = HydratedDocument<
  DeprecatedUserSchemaProps,
  DataBasicsDate
>

export type UserModel = Model<DeprecatedUserDocument>

@Schema({
  collection: SchemaCollectionName.Users,
  timestamps: defaultSchemaTimestampsConfig,
})
export class DeprecatedUserSchemaProps {
  @Prop()
  federalProvider: string // "google" only

  @Prop()
  federalID: string

  @Prop()
  lastName: string

  @Prop()
  firstName: string

  @Prop()
  email: string

  @Prop()
  imageUrl: string

  @Prop()
  languagePreference: 'en' | 'ko' | 'ja'

  @Prop()
  dateAdded: number // 1602581150116
}

export const DeprecatedUserSchema = SchemaFactory.createForClass(
  DeprecatedUserSchemaProps,
)
