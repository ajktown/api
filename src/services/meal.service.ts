import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { MealModel, MealProps } from '@/schemas/meal.schema'
import { MealDomain } from '@/domains/meals/meal.domain'
import { PostMealBodyDTO } from '@/dto/post-meal.dto'
import { PatchMealBodyDTO } from '@/dto/patch-meal.dto'

@Injectable()
export class MealService {
  constructor(
    @InjectModel(MealProps.name)
    private mealModel: MealModel,
  ) {}

  /** Create a new meal */
  async create(
    atd: AccessTokenDomain,
    dto: PostMealBodyDTO,
  ): Promise<MealDomain> {
    return MealDomain.create(atd, dto, this.mealModel)
  }

  /** Find all meals by owner */
  async findAll(atd: AccessTokenDomain): Promise<MealDomain[]> {
    return MealDomain.findAllByOwner(atd, this.mealModel)
  }

  /** Find a single meal by id and owner */
  async findOne(atd: AccessTokenDomain, mealId: string): Promise<MealDomain> {
    return MealDomain.findById(mealId, atd, this.mealModel)
  }

  /** Patch a meal by id and owner */
  async patch(
    atd: AccessTokenDomain,
    mealId: string,
    dto: PatchMealBodyDTO,
  ): Promise<MealDomain> {
    const domain = await MealDomain.findById(mealId, atd, this.mealModel)
    return domain.update(atd, dto, this.mealModel)
  }

  /** Remove a meal by id and owner */
  async remove(atd: AccessTokenDomain, mealId: string): Promise<void> {
    const domain = await MealDomain.findById(mealId, atd, this.mealModel)
    await domain.delete(atd, this.mealModel)
  }
}