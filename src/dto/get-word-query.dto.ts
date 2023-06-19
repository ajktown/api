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

  @IsOptional()
  @IsArray()
  languageCodes: GlobalLanguageCode[]

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  semester: number

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

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  daysAgo: number

  @IsOptional()
  @IsArray()
  tags: string[]

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  dateAdded: number
}
