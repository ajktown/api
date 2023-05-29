import { DataBasicsDate } from '@/global.interface'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

// TODO: This is deprecated MongoDB Schema of WordData

export type DeprecatedWordDocument = HydratedDocument<
  DeprecatedWordSchemaProps,
  DataBasicsDate
>

@Schema({
  collection: SchemaCollectionName.DeprecatedWords,
  timestamps: defaultSchemaTimestampsConfig,
})
export class DeprecatedWordSchemaProps {
  @Prop({ required: true })
  ownerID: string // the owner id 5f85729......

  @Prop([String])
  reviewdOn: string[]

  @Prop([String])
  tag: string[]

  @Prop()
  word: string

  @Prop()
  example: string // example sentence

  @Prop()
  sem: number //231

  @Prop()
  isPublic: boolean // false most of the time

  @Prop()
  isFavorite: boolean

  @Prop()
  order: number

  @Prop()
  language: string // ko, ja, en

  @Prop()
  step: number // probably the review record, but not used

  @Prop()
  dateAdded: number // 1677483296006

  @Prop()
  meaning: string

  @Prop()
  pronun: string // pronunciation
}

export const DeprecatedWordSchema = SchemaFactory.createForClass(
  DeprecatedWordSchemaProps,
)
