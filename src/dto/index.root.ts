import { IsNumber, IsOptional, IsString } from 'class-validator'

// TODO: The limit has to be set by default if not given, for less traffics (i.e 1000).

export class PaginationReqDTORoot {
  // TODO: This was not parsed...
  @IsNumber()
  @IsOptional()
  pageIndex: string

  // TODO: This was not parsed...
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
