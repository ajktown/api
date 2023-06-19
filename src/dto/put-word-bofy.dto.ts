import { GlobalLanguageCode } from '@/global.interface'
import { IsArray, IsBoolean, IsString } from 'class-validator'
import { intoBoolean } from './index.validator'
import { Transform } from 'class-transformer'

// ! Security Warning:

// Semester cannot be set by end user
export class PutWordByIdBodyDTO {
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
}
