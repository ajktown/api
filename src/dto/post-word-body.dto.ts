import { GlobalLanguageCode } from '@/global.interface'
import { IsArray, IsBoolean, IsString } from 'class-validator'

// ! Security Warning:
// UserId must not be here. End user cannot set userId with their own.

// Semester cannot be set by end user
export class PostWordBodyDTO {
  @IsString()
  languageCode: GlobalLanguageCode

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
}
