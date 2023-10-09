import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

export type SharedResourceDoc = HydratedDocument<
  SharedResourceProps,
  DataBasicsDate
>

export type SharedResourceModel = Model<SharedResourceDoc>

@Schema({
  collection: SchemaCollectionName.SharedResources,
  timestamps: defaultSchemaTimestampsConfig,
})
export class SharedResourceProps {
  @Prop({ required: true })
  ownerID: string // the owner id 5f85729......

  /** If undefined, it is considered never expiring shared resource */
  @Prop()
  expiresInSecs: number

  // RESOURCES
  // The current plan is, if new resource is added, one of the data will be added.
  //
  @Prop()
  wordId: string
}

export const SharedResourceSchema =
  SchemaFactory.createForClass(SharedResourceProps)

export const sharedResourceModelDefinition: ModelDefinition = {
  name: SharedResourceProps.name,
  schema: SharedResourceSchema,
}
