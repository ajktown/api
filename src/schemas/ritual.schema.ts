import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

/**
 */
export type RitualDoc = HydratedDocument<RitualProps, DataBasicsDate>

export type RitualModel = Model<RitualDoc>

@Schema({
  collection: SchemaCollectionName.Rituals,
  timestamps: defaultSchemaTimestampsConfig,
})
export class RitualProps {
  @Prop({ required: true })
  ownerId: string // the owner id 5f85729......

  @Prop({ required: true })
  name: string // not required to be unique

  @Prop({ required: true })
  orderedActionGroupIds: string[]
}

export const RitualSchema = SchemaFactory.createForClass(RitualProps)

export const ritualModelDefinition: ModelDefinition = {
  name: RitualProps.name,
  schema: RitualSchema,
}
