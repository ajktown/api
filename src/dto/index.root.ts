import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { intoNumber } from './index.validator'

// TODO: The limit has to be set by default if not given, for less traffics (i.e 1000).

export class PaginationReqDTORoot {
  @Transform(intoNumber)
  @IsNumber()
  @IsOptional()
  pageIndex: string

  @Transform(intoNumber)
  @IsNumber()
  @IsOptional()
  itemsPerPage: string
}

export class GetReqDTORoot extends PaginationReqDTORoot {
  // case insensitive
  @IsString()
  @IsOptional()
  searchInput: string
}
