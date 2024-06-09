import { IsString } from 'class-validator'
import { intoTrimmedString } from './index.validator'
import { Transform } from 'class-transformer'

export class PostArchiveActionGroupBodyDTO {
  @Transform(intoTrimmedString)
  @IsString()
  message: string
}
