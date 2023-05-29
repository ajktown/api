import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { SchemaCollectionName } from './index.collections'

// TODO: This is deprecated MongoDB Schema of SupportsData
// ! Supports do not have timestamps

export type DeprecatedSupportsDocument =
  HydratedDocument<DeprecatedSupportSchemaProps>

@Schema({
  collection: SchemaCollectionName.DeprecatedSupport,
})
export class DeprecatedSupportSchemaProps {
  @Prop({ required: true })
  ownerID: string // the owner id 5f85729......

  @Prop()
  sems: number[] // [231, 224 ... ]

  @Prop()
  newWordCnt: number

  @Prop()
  deletedWordCnt: number

  // ! Not used by Wordnote v2.0.0 or later below:

  @Prop()
  wordDisplayPref: string // wordcard, list

  @Prop()
  wordOrderPref: string // asc, desc

  @Prop()
  yearOrderPref: string // asc, desc

  @Prop()
  recommandedTags: string[] // ["tag-name-1", "tag-name-2"]

  @Prop()
  lastTags: string[] // ["tag-name-1", "tag-name-2"] (Not even used in Wordy 1.0)

  @Prop()
  status: string // admin, or undefined

  @Prop()
  isDarkMode: boolean

  @Prop()
  addWordLangPref: string // en, ja, ko

  @Prop()
  newWordAddingType: string // mass or one

  @Prop()
  searchOnlyDownloaded: boolean

  @Prop()
  languageDetectionEnabled: boolean

  @Prop()
  highlightSearched: boolean

  @Prop()
  lastReadVersion: string // v0.5.4
}

export const DeprecatedSupportsSchema = SchemaFactory.createForClass(
  DeprecatedSupportSchemaProps,
)
