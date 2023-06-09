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

  // ! For performance reason, semester is required at this point
  // TODO: This filtering does not really work :(
  // TODO: Any Request DTO must work and convert the data to the correct type ...!!!!!!!!! 
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

  @IsOptional()
  @IsNumber()
  daysAgo: number

  @IsOptional()
  @IsArray()
  tags: string[]

  @IsOptional()
  @IsNumber()
  dateAdded: number
}
