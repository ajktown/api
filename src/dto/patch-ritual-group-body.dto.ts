import { Transform } from 'class-transformer'
import { IsArray, IsOptional } from 'class-validator'
import { intoArray, intoBooleanOrUndefined } from './index.validator'

// TODO: Name should be modifiable, but not yet supported, until multiple rituals are supported.
export class PatchRitualGroupBodyDTO {
  @Transform(intoArray)
  @IsOptional()
  @IsArray()
  actionGroupIds: string[]

  @Transform(intoBooleanOrUndefined)
  @IsOptional()
  isArchived: undefined | boolean
}
