interface PrivateToNumberOptions {
  default?: number
  min?: number
  max?: number
}

// TODO: This should be tested
export const castHandler = {
  toLowerCase(value: string): string {
    return value.toLowerCase()
  },
  trim(value: string): string {
    return value.trim()
  },
  toDate(value: string): Date {
    return new Date(value)
  },
  toBoolean(value: string): boolean {
    value = value.toLowerCase()

    return value === 'true' || value === '1' ? true : false
  },
  toNumber(value: string, opts: PrivateToNumberOptions = {}): number {
    let newValue: number = Number.parseInt(value || String(opts.default), 10)

    if (Number.isNaN(newValue)) {
      newValue = opts.default
    }

    if (opts.min) {
      if (newValue < opts.min) {
        newValue = opts.min
      }

      if (newValue > opts.max) {
        newValue = opts.max
      }
    }

    return newValue
  },
}
