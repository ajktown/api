import { IsNumber, IsString } from 'class-validator'
import { intoSupportedTimezone, intoTrimmedString } from './index.validator'
import { Transform } from 'class-transformer'

export class PostActionGroupDTO {
  @Transform(intoTrimmedString)
  @IsString()
  task: string

  @Transform(intoSupportedTimezone)
  @IsString()
  timezone: string

  @IsNumber()
  openMinsAfter: number

  @IsNumber()
  closeMinsAfter: number
}
