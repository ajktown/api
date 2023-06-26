import { TransformFnParams } from 'class-transformer'

/** Convert into boolean. Use ONLY after @Transform(intoBoolean) */
export const intoBoolean = ({ value }: TransformFnParams): boolean => {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  throw new Error('Invalid boolean value')
}

export const intoNumber = ({ value }: TransformFnParams): number => {
  const num = Number(value)
  if (!isNaN(num)) return num
  throw new Error('Invalid number value')
}

export const intoNumberWithLimit = (params: {
  transformFnParams: TransformFnParams
  max: number
}): number => {
  const converted = intoNumber(params.transformFnParams)
  if (params.max < converted)
    throw new Error(`Invalid number value. Max: ${params.max}`)
  return converted
}

export const intoArray = ({ value }: TransformFnParams): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value
  throw new Error('Invalid tags value')
}
