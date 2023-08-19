import { GlobalLanguageCode } from '@/global.interface'
import { Transform } from 'class-transformer'
import { IsArray, IsBoolean, IsString } from 'class-validator'
import { intoArray, intoBoolean } from './index.validator'

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

  @IsString()
  exampleLink: string

  @Transform(intoArray)
  @IsArray()
  tags: string[]
}
