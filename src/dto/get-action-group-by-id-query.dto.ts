import { IsNumber, IsOptional } from 'class-validator'
import { intoNumber } from './index.validator'
import { Transform } from 'class-transformer'

/**
 * Order in a priority queue.
 * If both id and wordID given, id will be used.
 */
export class GetActionGroupByIdQueryDTO {
  // undefined: get the latest for 365 days
  // 2024: get all day for 2024
  @Transform(intoNumber)
  @IsNumber()
  @IsOptional()
  year: undefined | number
}
