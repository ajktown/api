import { IsNumber, IsOptional } from 'class-validator'

export class GetReqDTORoot {
  @IsNumber()
  @IsOptional()
  limit: number
}
