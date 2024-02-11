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

type PrivateNotYetImplemented = 'tags' | 'createdAt' | 'updatedAt'
export class GetWordQueryDTO
  extends GetReqDTORoot
  implements Omit<IWord, PrivateNotYetImplemented>
{
  @IsString()
  @IsOptional()
  id: string

  @IsString()
  @IsOptional()
  userId: string

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
