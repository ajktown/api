import { GlobalLanguageCode } from '@/global.interface'
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'
import { intoBoolean, intoBooleanOrUndefined, intoUniqueArray } from './index.validator'
import { Transform } from 'class-transformer'

/** PUT preference can be done only by the owner, and therefore does not require ownerId */
export class PatchPreferenceDto {
  @Transform(intoUniqueArray)
  @IsArray()
  @IsOptional()
  nativeLanguages: GlobalLanguageCode[]

  @Transform(intoUniqueArray)
  @IsArray()
  @IsOptional()
  selectedDictIds: string[]

  @IsString()
  @IsOptional()
  gptApiKey: string

  @Transform(intoBooleanOrUndefined)
  @IsBoolean()
  @IsOptional()
  useProgressDialog: undefined | boolean
}
