import { diff } from 'deep-object-diff'
import { isEmptyObjectHandler } from './is-empty-object.handler'
export const isDeeplySameObjectsHandler = (
  object1: object,
  object2: object,
): boolean => {
  // diff() will return the different value like the following
  // {term: 'hello', pronunciation: 'hello'}
  return isEmptyObjectHandler(diff(object1, object2))
}
