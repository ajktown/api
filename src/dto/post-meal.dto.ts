import { Transform } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { intoArray, intoNumber } from './index.validator'

class PostMealIngredientsBodyDTO {
  @Transform(intoNumber)
  @IsNumber()
  protein: number
}

export class PostMealBodyDTO extends PostMealIngredientsBodyDTO {
  @IsString()
  name: string

  @Transform(intoNumber)
  @IsNumber()
  amount: number

  @IsString()
  unit: string

  @Transform(intoArray)
  @IsOptional()
  @IsArray()
  labels?: string[]

  @Transform(intoNumber)
  @IsNumber()
  kcal: number
}
