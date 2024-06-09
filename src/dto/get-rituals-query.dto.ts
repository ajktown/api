import { IsOptional } from 'class-validator'
import { intoBooleanOrUndefined } from './index.validator'
import { Transform } from 'class-transformer'

export class GetRitualQueryDTO {
  @Transform(intoBooleanOrUndefined)
  @IsOptional()
  isArchived: undefined | boolean
}
