import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

export type ActionGroupDoc = HydratedDocument<ActionGroupProps, DataBasicsDate>

export type ActionGroupModel = Model<ActionGroupDoc>

@Schema({
  collection: SchemaCollectionName.ActionGroups,
  timestamps: defaultSchemaTimestampsConfig,
})
export class ActionGroupProps {
  @Prop({ required: true })
  ownerId: string // the owner id 5f85729......

  @Prop()
  name: string
}

export const ActionGroupSchema = SchemaFactory.createForClass(ActionGroupProps)

export const actionGroupModelDefinition: ModelDefinition = {
  name: ActionGroupProps.name,
  schema: ActionGroupSchema,
}
