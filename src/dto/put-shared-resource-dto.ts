import { IsNumber, IsOptional } from 'class-validator'

// attributes cannot be changed. It can be newly created though.
export class PutSharedResourceDTO {
  @IsOptional()
  @IsNumber()
  extendSecs: number
}
