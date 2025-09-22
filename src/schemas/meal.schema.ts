import { DataBasicsDate } from '@/global.interface'
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import {
  defaultSchemaTimestampsConfig,
  SchemaCollectionName,
} from './index.collections'

export type MealDoc = HydratedDocument<MealProps, DataBasicsDate>

export type MealModel = Model<MealDoc>

/**
 * @description
 * Sub-document for nutritional information.
 * It does not have its own _id.
 */
@Schema({ _id: false })
export class IngredientsProps {
  @Prop({ required: true, default: 0 })
  protein: number
}
const IngredientsSchema = SchemaFactory.createForClass(IngredientsProps)

@Schema({
  collection: SchemaCollectionName.Meals,
  timestamps: defaultSchemaTimestampsConfig,
})
export class MealProps {
  @Prop({ required: true })
  ownerID: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  amount: number

  @Prop({ required: true })
  unit: string

  @Prop({ default: [] })
  labels: string[]

  @Prop({ required: true, default: 0 })
  kcal: number

  @Prop({ type: IngredientsSchema, required: true })
  ingredients: IngredientsProps
}

export const MealSchema = SchemaFactory.createForClass(MealProps)

export const mealModelDefinition: ModelDefinition = {
  name: MealProps.name,
  schema: MealSchema,
}