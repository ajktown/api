import { IsNumber, IsOptional, IsString } from 'class-validator'

export class PostSharedResourceDTO {
  @IsOptional()
  @IsNumber()
  expireInSecs: number

  @IsOptional()
  @IsString()
  wordId: string
}
