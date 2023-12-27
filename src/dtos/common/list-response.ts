export interface ListResponse<T> {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    data: T[];
}