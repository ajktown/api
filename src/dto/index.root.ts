import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

// TODO: The limit has to be set by default if not given, for less traffics (i.e 1000).

export class PaginationReqDTORoot {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  pageIndex: string

  @Transform(({ value }) => Number(value))
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
