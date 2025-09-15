export interface PaginationMetaContract {
  totalCount: number;
  pageSize: number | null;
  currentPage: number | null;
  totalPages: number | null;
}
