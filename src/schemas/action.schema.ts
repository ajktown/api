import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

export type ActionDoc = HydratedDocument<ActionProps, DataBasicsDate>

export type ActionModel = Model<ActionDoc>

@Schema({
  collection: SchemaCollectionName.Actions,
  timestamps: defaultSchemaTimestampsConfig,
})
export class ActionProps {
  @Prop({ required: true })
  ownerId: string // the owner id 5f85729......

  @Prop()
  groupId: string // the group of the action

  // if action is not performed, even if it exists
  @Prop()
  isDummy: boolean
}

export const ActionSchema = SchemaFactory.createForClass(ActionProps)

export const actionModelDefinition: ModelDefinition = {
  name: ActionProps.name,
  schema: ActionSchema,
}
