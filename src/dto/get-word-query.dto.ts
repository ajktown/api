import { GlobalLanguageCode } from '@/global.interface'
import { IsOptional, IsString } from 'class-validator'

export class GetWordQueryDTO {
  @IsString()
  @IsOptional()
  id: string

  @IsOptional()
  @IsString()
  languageCode: GlobalLanguageCode
  // semester: number
  // isFavorite: boolean
  // term: string
  // pronunciation: string
  // definition: string
  // example: string
  // tags: string[]
}
