import { ISemester } from '@/domains/semester/index.interface'
import { PaginationRoot } from '@/handlers/get-pagination.handler'

export interface GetWordIdsRes extends PaginationRoot {
  semester: Partial<ISemester> | undefined
  wordIds: string[]
}
