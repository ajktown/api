import { IsNumber, IsOptional, IsString } from 'class-validator'

export class PostSharedResourceDTO {
  @IsOptional()
  @IsNumber()
  expireAfterSecs: number

  @IsOptional()
  @IsString()
  wordId: string
}
