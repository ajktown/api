import { IsNumber, IsString } from 'class-validator'
import {
  intoNumber,
  intoSupportedTimezone,
  intoTrimmedString,
} from './index.validator'
import { Transform } from 'class-transformer'

export class PostActionGroupDTO {
  @Transform(intoTrimmedString)
  @IsString()
  task: string

  @Transform(intoSupportedTimezone)
  @IsString()
  timezone: string

  @Transform(intoNumber)
  @IsNumber()
  openMinsAfter: number

  @Transform(intoNumber)
  @IsNumber()
  closeMinsAfter: number
}
