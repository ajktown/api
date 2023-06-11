import { GlobalLanguageCode } from '@/global.interface'
import { IsArray, IsBoolean, IsString } from 'class-validator'

// ! Security Warning:

// Semester cannot be set by end user
export class PutWordByIdBodyDTO {
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
