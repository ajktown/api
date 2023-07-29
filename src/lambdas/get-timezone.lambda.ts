import { Request } from 'express'

// PRIVATE_DEFAULT_TIMEZONE_IDENTIFIER must be one of the values in the following list:
// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
const PRIVATE_DEFAULT_TIMEZONE_IDENTIFIER = `Asia/Tokyo`

const PRIVATE_DEFAULT_TIMEZONE = `timezone`

export const getTimezone = (req?: Request): string => {
  if (!req) return PRIVATE_DEFAULT_TIMEZONE_IDENTIFIER
  const timezone = req.headers[PRIVATE_DEFAULT_TIMEZONE]

  if (Array.isArray(timezone)) return PRIVATE_DEFAULT_TIMEZONE_IDENTIFIER
  return timezone || PRIVATE_DEFAULT_TIMEZONE_IDENTIFIER
}
