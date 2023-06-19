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
import { intoBoolean, intoNumber } from './index.validator'

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

  @Transform(intoNumber)
  @IsOptional()
  @IsNumber()
  daysAgo: number

  @IsOptional()
  @IsArray()
  tags: string[]

  @Transform(intoNumber)
  @IsOptional()
  @IsNumber()
  dateAdded: number
}
