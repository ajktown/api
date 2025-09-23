import { Logger, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MealController } from '@/controllers/meal.controller'
import { mealModelDefinition } from '@/schemas/meal.schema'
import { MealService } from '@/services/meal.service'
import { GetMealQueryFactory } from '@/factories/get-meal.factory'

@Module({
  imports: [MongooseModule.forFeature([mealModelDefinition])],
  controllers: [MealController],
  providers: [Logger, MealService, GetMealQueryFactory],
})
export class MealModule {}
