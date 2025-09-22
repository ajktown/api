import { Transform } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { intoArray } from './index.validator'

class PostMealIngredientsBodyDTO {
  @IsNumber()
  @Min(0)
  protein: number
}

export class PostMealBodyDTO extends PostMealIngredientsBodyDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @Min(0)
  amount: number

  @IsString()
  @IsNotEmpty()
  unit: string

  @Transform(intoArray) // from your example
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[]

  @IsNumber()
  @Min(0)
  kcal: number
}
