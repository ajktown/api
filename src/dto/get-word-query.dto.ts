import { GlobalLanguageCode } from '@/global.interface'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { IWord } from '@/domains/word/index.interface'

type PrivateNotYetImplemented = 'tags' | 'createdAt' | 'updatedAt'
export class GetWordQueryDTO implements Omit<IWord, PrivateNotYetImplemented> {
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
