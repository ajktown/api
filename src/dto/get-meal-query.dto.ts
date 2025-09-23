import { IsOptional, IsDateString } from 'class-validator'

export class GetMealQueryDTO {
  @IsDateString()
  @IsOptional()
  fromDate?: string // Date range filter (e.g., "2025-09-23T00:00:00.000Z")

  @IsDateString()
  @IsOptional()
  toDate?: string // Date range filter (e.g., "2025-09-23T23:59:59.999Z")
}
