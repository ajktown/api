import { GlobalLanguageCode } from '@/global.interface'
import { Transform } from 'class-transformer'
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'
import { intoArray, intoBoolean } from './index.validator'

// ! Security Warning:
// UserId must not be here. End user cannot set userId with their own.

// Semester cannot be set by end user
export class PostWordBodyDTO {
  @IsOptional()
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
  subDefinition: string

  @IsString()
  example: string

  @IsString()
  exampleLink: string

  @Transform(intoArray)
  @IsArray()
  tags: string[]

  /** It is doubtful why isArchived exists when a new word is posted.
   * But you can actually undo deleting word and if the word is archived,
   * it will be unarchived when undoing.
   */
  @Transform(intoBoolean)
  @IsBoolean()
  isArchived: boolean
}
