import { Injectable } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { FactoryRoot } from './index.root'
import { GetMealQueryDTO } from '@/dto/get-meal-query.dto'
import { MealProps } from '@/schemas/meal.schema'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { UnidentifiedUserError } from '@/errors/401/unidentified-user.error'

@Injectable()
export class GetMealQueryFactory extends FactoryRoot<MealProps> {
  /**
   * Converts fromDate and toDate from DTO into a Mongoose date range query object.
   * Uses 'createdAt' field for filtering.
   */
  private toDateRangeObject(
    fromDate?: string,
    toDate?: string,
  ): FilterQuery<MealProps> {
    const dateFilter: { $gte?: Date; $lte?: Date } = {}

    if (fromDate) {
      dateFilter.$gte = new Date(fromDate)
    }
    if (toDate) {
      dateFilter.$lte = new Date(toDate)
    }

    if (Object.keys(dateFilter).length > 0) {
      return { createdAt: dateFilter }
    }

    return {}
  }

  /**
   * Constructs the final filter query for finding meals.
   */
  getFilter(
    atd: AccessTokenDomain,
    query: GetMealQueryDTO,
  ): FilterQuery<MealProps> {
    if (!atd.userId) throw new UnidentifiedUserError()

    const queryBase: FilterQuery<MealProps> = {
      ownerID: atd.userId,
      ...this.toDateRangeObject(query.fromDate, query.toDate),
      // Future filter conditions can be added here
      // e.g., ...this.toObject('name', query.name)
    }

    return queryBase
  }
}
