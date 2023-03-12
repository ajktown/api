// TODO: This won't be used
// TODO: This is deprecated MongoDB Model of WordData
export interface DeprecatedWordModel {
  _id: string // 63fc5d203e2d3a6ef45803b8
  reviewdOn: string[]
  tag: string[]
  word: string
  example: string // example sentence
  sem: number //231
  isPublic: boolean // false most of the time
  ownerID: string // the owner id 5f85729......
  isFavorite: boolean
  order: number
  language: string // ko, ja, en
  step: number // probably the review record, but not used
  dateAdded: number // 1677483296006
  __v: number // mongo db provided version number? usually 0
  meaning: string
  pronun: string // pronunciation
}
