import { DataBasicsDate } from '@/global.interface'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

// TODO: This is deprecated MongoDB Schema of WordData

export type DeprecatedWordDocument = HydratedDocument<
  DeprecatedWordSchemaProps,
  DataBasicsDate
>

export type WordModel = Model<DeprecatedWordDocument>

@Schema({
  collection: SchemaCollectionName.DeprecatedWords,
  timestamps: defaultSchemaTimestampsConfig,
})
export class DeprecatedWordSchemaProps {
  @Prop({ required: true })
  ownerID: string // the owner id 5f85729......

  @Prop([String])
  tag: string[]

  @Prop()
  word: string

  @Prop()
  example: string // example sentence

  @Prop()
  sem: number //231

  @Prop()
  isFavorite: boolean

  @Prop()
  language: string // ko, ja, en

  @Prop()
  dateAdded: number // 1677483296006

  @Prop()
  meaning: string

  @Prop()
  pronun: string // pronunciation

  // ! Not used by Wordnote v2.0.0 or later below:
  // ! They are just recorded here for reference sake

  // @Prop()
  // order: number

  // @Prop([String])
  // reviewdOn: string[]

  // @Prop()
  // isPublic: boolean // false most of the time

  // @Prop()
  // step: number // probably the review record, but not used
}

export const DeprecatedWordSchema = SchemaFactory.createForClass(
  DeprecatedWordSchemaProps,
)
