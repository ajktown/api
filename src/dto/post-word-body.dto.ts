import { GlobalLanguageCode } from '@/global.interface'
import { IsArray, IsNumber, IsBoolean, IsString } from 'class-validator'

export class PostWordBodyDTO {
  @IsString()
  languageCode: GlobalLanguageCode

  @IsNumber()
  semester: number

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
