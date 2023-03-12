import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

// TODO: This is deprecated MongoDB Schema of WordData
// ! Document, Props, Schema

export type DeprecatedWordDocument = HydratedDocument<DeprecatedWordSchemaDefinitions>

@Schema()
export class DeprecatedWordSchemaDefinitions {
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
  __v: number // mongo db provided version number? usually 0

  @Prop()
  meaning: string

  @Prop()
  pronun: string // pronunciation
}

export const DeprecatedWordSchema = SchemaFactory.createForClass(
  DeprecatedWordSchemaDefinitions,
)
