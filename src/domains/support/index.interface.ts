// TODO: Modify all userId to ownerId. ownerId sounds much better.
export interface ISupport {
  id: string
  userId: string // TODO: Modify this to ownerId (Careful test may be needed, especially with FE)
  semesters: number[]
  newWordCount: number
  deletedWordCount: number
}
