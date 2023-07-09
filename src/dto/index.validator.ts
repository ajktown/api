import { BadRequestError } from '@/errors/400/bad-request.error'
import { TransformFnParams } from 'class-transformer'

/** Convert into boolean. Use ONLY after @Transform(intoBoolean) */
export const intoBoolean = ({ value }: TransformFnParams): boolean => {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  throw new BadRequestError('Invalid boolean value')
}

export const intoNumber = ({ value }: TransformFnParams): number => {
  const num = Number(value)
  if (!isNaN(num)) return num
  throw new BadRequestError('Invalid number value')
}

export const intoNumberWithMaxLimit = (params: {
  transformFnParams: TransformFnParams
  maxLimit: number
}): number => {
  const converted = intoNumber(params.transformFnParams)
  if (params.maxLimit < converted)
    throw new BadRequestError(
      `Exceeded max limit. Got: ${converted} Max Limit: ${params.maxLimit}`,
    )
  return converted
}

export const intoArray = ({ value }: TransformFnParams): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value
  throw new BadRequestError('Invalid tags value')
}
