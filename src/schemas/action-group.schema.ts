import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

/**
 * To maintain the integrity of the data,
 * action group cannot be created or deleted by the user.
 * Action group may be archived, but the archive data is stored in a different collection.
 */
export type ActionGroupDoc = HydratedDocument<ActionGroupProps, DataBasicsDate>

export type ActionGroupModel = Model<ActionGroupDoc>

@Schema({
  collection: SchemaCollectionName.ActionGroups,
  timestamps: defaultSchemaTimestampsConfig,
})
export class ActionGroupProps {
  @Prop({ required: true })
  ownerId: string // the owner id 5f85729......

  // TODO: Not yet implemented
  // @Prop()
  // id_name: string // the alias name of the action group (should be unique)

  // the name of task you are supposed to do
  // i.e) Wake up by 4:30am
  // i.e) Brush Teeth + Gabrin + Interdental Brush  by
  @Prop()
  task: string

  // the timezone of the action group
  // TODO: This will be customizable in the future At this point its all KST or UTC+9
  // this must be the timezone of the owner, not utc+9 as some countries
  // may have summer time, and they will change routine based on it.
  // but since its a personal info, it must be returned with UTC+9 if shared.
  @Prop()
  timezone: string

  // the minutes after the action group is open to fetch action domain
  // i.e) openMinsAfter=0 once day begins, the action group is open
  // i.e) openMinsAfter=240 opens at 4:00am
  @Prop()
  openMinsAfter: number

  // the minutes after the action group is closed to fetch action domain
  // i.e) closeMinsAfter=0 once day begins, the action group is closed
  // by logic closeMinsAfter must be bigger than openMinsAfter. but its not handled in schema level
  @Prop()
  closeMinsAfter: number
}

export const ActionGroupSchema = SchemaFactory.createForClass(ActionGroupProps)

export const actionGroupModelDefinition: ModelDefinition = {
  name: ActionGroupProps.name,
  schema: ActionGroupSchema,
}
