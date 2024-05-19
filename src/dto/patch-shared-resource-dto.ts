import { IsNumber, IsOptional } from 'class-validator'

// attributes cannot be changed. It can be newly created though.
export class PatchSharedResourceDTO {
  @IsOptional()
  @IsNumber()
  extendSecs: number
}
