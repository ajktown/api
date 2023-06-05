// TODO: Modify all userId to ownerId. ownerId sounds much better.
export interface ISupport {
  id: string
  userId: string
  semesters: number[]
  newWordCount: number
  deletedWordCount: number
}
