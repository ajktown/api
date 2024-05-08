import { IsBoolean, IsOptional } from 'class-validator'
import { intoBoolean } from './index.validator'
import { Transform } from 'class-transformer'

export class PostActionBodyDTO {
  @Transform(intoBoolean)
  @IsBoolean()
  @IsOptional()
  isDummy: boolean
}
