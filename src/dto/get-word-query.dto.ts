import { GlobalLanguageCode } from '@/global.interface'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { IWord } from '@/domains/word/index.interface'
import { GetReqDTORoot } from './index.root'
import { Transform } from 'class-transformer'
import { intoBoolean, intoNumber, intoArray } from './index.validator'

type PrivateOmitted =
  | 'tags' // Simply not implemented yet
  | 'createdAt' // Simply not implemented yet
  | 'updatedAt' // Simply not implemented yet
  | 'isPinned' // The isPinned field is not acceptable as pinned word is always returned as the first word in the list.

export class GetWordQueryDTO
  extends GetReqDTORoot
  implements Omit<IWord, PrivateOmitted>
{
  @IsString()
  @IsOptional()
  id: string

  @IsString()
  @IsOptional()
  userId: string // TODO: Modifying this to ownerId will cause DB migration, so be careful with this change. (Careful test may be needed, especially with FE)

  @IsOptional()
  @IsString()
  languageCode: GlobalLanguageCode

  @Transform(intoArray)
  @IsOptional()
  @IsArray()
  languageCodes: GlobalLanguageCode[]

  @Transform(intoNumber)
  @IsOptional()
  @IsNumber()
  semester: number

  @Transform(intoBoolean)
  @IsOptional()
  @IsBoolean()
  isFavorite: boolean

  @IsOptional()
  @IsString()
  term: string

  @IsOptional()
  @IsString()
  pronunciation: string

  @IsOptional()
  @IsString()
  definition: string

  @IsOptional()
  @IsString()
  subDefinition: string

  @IsOptional()
  @IsString()
  example: string

  @IsOptional()
  @IsString()
  exampleLink: string

  @Transform(intoNumber)
  @IsOptional()
  @IsNumber()
  daysAgo: number

  @Transform(intoArray)
  @IsOptional()
  @IsArray()
  tags: string[]

  @Transform(intoNumber)
  @IsOptional()
  @IsNumber()
  dateAdded: number

  @Transform(intoBoolean)
  @IsOptional()
  @IsBoolean()
  isArchived: boolean

  @Transform(intoNumber)
  @IsOptional()
  @IsNumber()
  year: number // returns the words in the given year

  @Transform(intoNumber)
  @IsOptional()
  @IsNumber()
  daysAgoUntilToday: number // returns the words from days ago until today
}
