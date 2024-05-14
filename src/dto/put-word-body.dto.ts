import { GlobalLanguageCode } from '@/global.interface'
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'
import { intoArray, intoBoolean } from './index.validator'
import { Transform } from 'class-transformer'

// ! Security Warning:

// Semester cannot be set by end user
export class PatchWordByIdBodyDTO {
  @IsString()
  @IsOptional()
  languageCode: GlobalLanguageCode

  @Transform(intoBoolean)
  @IsBoolean()
  @IsOptional()
  isFavorite: boolean

  @IsString()
  @IsOptional()
  term: string

  @IsString()
  @IsOptional()
  pronunciation: string

  @IsString()
  @IsOptional()
  definition: string

  @IsString()
  @IsOptional()
  subDefinition: string

  @IsString()
  @IsOptional()
  example: string

  @IsString()
  @IsOptional()
  exampleLink: string

  @Transform(intoArray)
  @IsArray()
  @IsOptional()
  tags: string[]

  @Transform(intoBoolean)
  @IsBoolean()
  @IsOptional()
  isArchived: boolean
}
