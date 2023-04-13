export const isEmptyObjectHandler = (obj: object): boolean => {
  return JSON.stringify(obj) === `{}`
}
