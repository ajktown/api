
import {
  IsNumber,
  Min,
} from 'class-validator'

export class MealIngredientsBodyDTO {
  @IsNumber()
  @Min(0)
  protein: number
}
