import { IsNumber, IsOptional } from 'class-validator'

// TODO: The limit has to be set by default if not given, for less traffics (i.e 1000).

export class GetReqDTORoot {
  @IsNumber()
  @IsOptional()
  limit: number
}
