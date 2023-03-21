import { IsOptional, IsString } from 'class-validator'

export class GetWordQueryDTO {
  @IsString()
  @IsOptional()
  id: string
  // languageCode: GlobalLanguageCode
  // semester: number
  // isFavorite: boolean
  // term: string
  // pronunciation: string
  // definition: string
  // example: string
  // tags: string[]
}
