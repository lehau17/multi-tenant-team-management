export interface IWrapperRespose<T> {
  status: number
  data: T
}

export interface IApiError {
  errorCode: string
  message: string
  details: unknown[] | null
  translations: Record<string, string>
}

export interface IPaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IPaginationResponse<T> {
  items: T[]
  meta: IPaginationMeta
}
