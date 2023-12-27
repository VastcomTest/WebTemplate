import { reactive } from "vue"

export interface PaginationData {
  total: number
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
}

interface DefaultPaginationData {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

const defaultPaginationData: PaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper"
}

export function usePagination(initialPaginationData: DefaultPaginationData = {}) {
  /** merge parmas */
  const paginationData:PaginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })
  /** modify cur page */
  const handleCurrentChange = (value: number) => {
    paginationData.currentPage = value
  }
  /** modify page size */
  const handleSizeChange = (value: number) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}
