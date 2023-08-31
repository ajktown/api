import { GlobalLanguageCode } from '@/global.interface'
import { IsArray, IsOptional } from 'class-validator'
import { intoUniqueArray } from './index.validator'
import { Transform } from 'class-transformer'

/** PUT preference can be done only by the owner, and therefore does not require ownerId */
export class PutPreferenceDto {
  @Transform(intoUniqueArray)
  @IsArray()
  @IsOptional()
  nativeLanguages: GlobalLanguageCode[]
}
