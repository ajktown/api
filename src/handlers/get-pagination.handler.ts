// TODO: This should be lambda. not handler.

import { GetReqDTORoot } from '@/dto/index.root'

const PRIVATE_DEFAULT_ITEMS_PER_PAGE = 100

// ! Warning: Although the GetPagination is not used by the code, Nest JS requires it to be exported for TS check.
// ! Leave it exported, even if not used
interface PrivatePaginationProps {
  pageIndex: number
  lastPageIndex: number
  isNextPageExist: boolean
  totalPages: number
  totalItems: number
  itemPerPage: number
}
export interface PaginationRoot {
  pagination: PrivatePaginationProps
  dataLength: number
}

const getConfirmedPageIndex = (query: GetReqDTORoot): number => {
  const parsed = parseInt(query.pageIndex)
  if (!Number.isInteger(parsed) || parsed < 0) return 0
  return parsed
}

export function getPaginationHandler<T extends any[]>(
  data: T,
  query: GetReqDTORoot,
): PaginationRoot & { data: T } {
  const confirmedPageIndex = getConfirmedPageIndex(query)
  const confirmedLimit =
    parseInt(query.itemsPerPage) || PRIVATE_DEFAULT_ITEMS_PER_PAGE

  const confirmedSliceIndex = confirmedPageIndex * confirmedLimit
  const confirmedSliceEndIndex = confirmedSliceIndex + confirmedLimit
  const confirmedTotalPages = Math.ceil(data.length / confirmedLimit)

  const confirmedData = data.slice(
    confirmedSliceIndex,
    confirmedSliceEndIndex,
  ) as T

  return {
    pagination: {
      pageIndex: confirmedPageIndex,
      lastPageIndex: confirmedTotalPages - 1,
      isNextPageExist: confirmedPageIndex < confirmedTotalPages - 1,
      totalPages: confirmedTotalPages,
      totalItems: data.length,
      itemPerPage: confirmedLimit,
    },
    dataLength: confirmedData.length,
    data: confirmedData,
  }
}
