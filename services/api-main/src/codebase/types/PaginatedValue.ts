export type PaginatedValue<T> = {
  entities: T[];
  page: number;
  perPage: number;
  totalEntities: number;
  totalPages: number;
};
