import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'
import { IsOptional } from 'class-validator'

export type ArchiveDoc = HydratedDocument<ArchiveProps, DataBasicsDate>

export type ArchiveModel = Model<ArchiveDoc>

@Schema({
  collection: SchemaCollectionName.Archives,
  timestamps: defaultSchemaTimestampsConfig,
})
export class ArchiveProps {
  @Prop({ required: true })
  ownerId: string // the owner id 5f85729......

  @Prop()
  message: string // any messages with the archive (Reason why you archive this)

  @Prop()
  @IsOptional()
  actionGroupId: string // actionGroupId
}

export const ArchiveSchema = SchemaFactory.createForClass(ArchiveProps)

export const archiveModelDefinition: ModelDefinition = {
  name: ArchiveProps.name,
  schema: ArchiveSchema,
}
