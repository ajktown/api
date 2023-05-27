import { IsNumber, IsOptional, IsString } from 'class-validator'

// TODO: The limit has to be set by default if not given, for less traffics (i.e 1000).

export class GetReqDTORoot {
  // case insensitive
  @IsString()
  @IsOptional()
  searchInput: string

  // TODO: This was not parsed...
  @IsNumber()
  @IsOptional()
  pageIndex: string

  // TODO: This was not parsed...
  @IsNumber()
  @IsOptional()
  itemsPerPage: string
}
