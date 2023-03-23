import { GlobalLanguageCode } from '@/global.interface'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

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
  // term: string
  // pronunciation: string
  // definition: string
  // example: string
  // tags: string[]
}
