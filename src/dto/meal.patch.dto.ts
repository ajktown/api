import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { intoArray } from './index.validator'

class PatchMealIngredientsBodyDTO {
  @IsNumber()
  @IsOptional()
  protein?: number
}

export class PatchMealBodyDTO extends PatchMealIngredientsBodyDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsNumber()
  @IsOptional()
  amount?: number

  @IsString()
  @IsOptional()
  unit?: string

  @Transform(intoArray) // from your example
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[]

  @IsNumber()
  @Min(0)
  @IsOptional()
  kcal?: number
}
