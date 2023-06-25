import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { intoNumber, intoNumberWithLimit } from './index.validator'

export class PaginationReqDTORoot {
  @Transform(intoNumber)
  @IsNumber()
  @IsOptional()
  pageIndex: number

  @Transform((transformFnParams) =>
    intoNumberWithLimit({ transformFnParams, max: 1000 }),
  )
  @IsNumber()
  @IsOptional()
  itemsPerPage: number
}

export class GetReqDTORoot extends PaginationReqDTORoot {
  // case insensitive
  @IsString()
  @IsOptional()
  searchInput: string
}
