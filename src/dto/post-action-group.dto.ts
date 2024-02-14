import { IsString } from 'class-validator'
import { intoTrimmedString } from './index.validator'
import { Transform } from 'class-transformer'

export class PostActionGroupDTO {
  @Transform(intoTrimmedString)
  @IsString()
  name: string
}
