import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Param,
  Query,
} from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { MealService } from '@/services/meal.service'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { PostMealBodyDTO } from '@/dto/post-meal.dto'
import { PatchMealBodyDTO } from '@/dto/patch-meal.dto'
import { GetMealQueryDTO } from '@/dto/get-meal-query.dto'

export enum MealControllerPath {
  PostMeal = `meals`,
  GetAllMeals = `meals`,
  GetMeal = `meals/:id`,
  PatchMeal = `meals/:id`,
  DeleteMeal = `meals/:id`,
}

@Controller(AjkTownApiVersion.V1)
export class MealController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mealService: MealService,
  ) {}

  @Post(MealControllerPath.PostMeal)
  async postMeal(@Req() req: Request, @Body() body: PostMealBodyDTO) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.mealService.create(atd, body)).toResDTO()
  }

  @Get(MealControllerPath.GetAllMeals)
  async getAllMeals(@Req() req: Request, @Query() query: GetMealQueryDTO) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    const domains = await this.mealService.findAll(atd, query)
    return {
      meals: domains.map((domain) => domain.toResDTO()),
    }
  }

  @Get(MealControllerPath.GetMeal)
  async getMeal(@Req() req: Request, @Param('id') id: string) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.mealService.findOne(atd, id)).toResDTO()
  }

  @Patch(MealControllerPath.PatchMeal)
  async patchMeal(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: PatchMealBodyDTO,
  ) {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    return (await this.mealService.patch(atd, id, body)).toResDTO()
  }

  @Delete(MealControllerPath.DeleteMeal)
  async deleteMeal(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
    await this.mealService.remove(atd, id)
    // No return value will result in a 204 No Content response
  }
}
