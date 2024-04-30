import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

export type WordDoc = HydratedDocument<WordProps, DataBasicsDate>

export type WordModel = Model<WordDoc>

@Schema({
  collection: SchemaCollectionName.Words,
  timestamps: defaultSchemaTimestampsConfig,
})
export class WordProps {
  @Prop({ required: true })
  ownerID: string // the owner id 5f85729......

  @Prop([String])
  tag: string[]

  @Prop()
  word: string

  @Prop()
  example: string // example sentence

  @Prop()
  exampleLink: string // example sentence link

  @Prop()
  sem: number //231

  @Prop()
  isFavorite: boolean

  @Prop()
  language: string // ko, ja, en

  @Prop()
  dateAdded: number // 1677483296006

  @Prop()
  meaning: string // definition ("meaning" is deprecated expression from Wordy)

  @Prop()
  subDefinition: string // similar to meaning (or definition) please see details in word domain why subDefinition exists

  @Prop()
  pronun: string // pronunciation

  @Prop()
  isArchived: boolean

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

export const WordsSchema = SchemaFactory.createForClass(WordProps)

export const wordModelDefinition: ModelDefinition = {
  name: WordProps.name,
  schema: WordsSchema,
}
