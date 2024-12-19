export interface CustomPage<E> {
    content: E[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}