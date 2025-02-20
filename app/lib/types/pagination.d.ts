export interface Pagination extends Record<string, unknown> {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}
