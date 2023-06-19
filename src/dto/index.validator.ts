/** Convert into boolean. Use ONLY after @Transform(intoBoolean) */
export const intoBoolean = ({ value }: any): boolean => {
  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error('Invalid boolean value')
}

export const intoNumber = ({ value }: any): number => {
  const num = Number(value)
  if (!isNaN(num)) return num
  throw new Error('Invalid number value')
}
