import { GlobalLanguageCode } from '@/global.interface'
import { Transform } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { intoBoolean } from './index.validator'

// ! Security Warning:
// UserId must not be here. End user cannot set userId with their own.

// Semester cannot be set by end user
export class PostWordBodyDTO {
  @IsString()
  languageCode: GlobalLanguageCode

  @Transform(intoBoolean)
  @IsBoolean()
  isFavorite: boolean

  @IsString()
  term: string

  @IsString()
  pronunciation: string

  @IsString()
  definition: string

  @IsString()
  example: string

  @IsArray()
  tags: string[]

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  dateAdded: number
}
