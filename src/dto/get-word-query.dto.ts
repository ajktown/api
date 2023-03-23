import { GlobalLanguageCode } from '@/global.interface'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class GetWordQueryDTO {
  @IsString()
  @IsOptional()
  id: string

  @IsOptional()
  @IsString()
  languageCode: GlobalLanguageCode

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

  // TODO: Not sure how to search with tags
  // @IsOptional()
  // @IsArray()
  // tags: string[]
}
