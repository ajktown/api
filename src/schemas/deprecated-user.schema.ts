import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

export type UserDoc = HydratedDocument<UserProps, DataBasicsDate>

export type UserModel = Model<UserDoc>

@Schema({
  collection: SchemaCollectionName.Users,
  timestamps: defaultSchemaTimestampsConfig,
})
export class UserProps {
  @Prop()
  federalProvider: string // "google" only

  @Prop()
  federalID: string

  @Prop()
  nickname: undefined | string // undefined if not yet set

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

export const UsersSchema = SchemaFactory.createForClass(UserProps)

export const userModelDefinition: ModelDefinition = {
  name: UserProps.name,
  schema: UsersSchema,
}
