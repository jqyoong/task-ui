import { type SetURLSearchParams } from 'react-router-dom';
import { type Pagination as TPagination } from '@/lib/types/pagination';

import { Group, Select, Text, Pagination } from '@mantine/core';

interface GroupPaginationProps {
  listPagination: TPagination;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

const ITEMS_SIZE = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

export function GroupPagination({ listPagination, searchParams, setSearchParams }: GroupPaginationProps) {
  const params = {
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('page_size')) || 10,
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => {
      prev.set('page_size', newPageSize?.toString() ?? '10');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <Group justify="space-between" mt="lg">
      <Group>
        <span>Show</span>
        <Select
          size="xs"
          value={params.pageSize.toString()}
          onChange={(value) => handlePageSizeChange(Number(value))}
          data={ITEMS_SIZE}
          style={{ width: 100 }}
          withCheckIcon={false}
        />
        <span>entries</span>
        {listPagination && (
          <Text size="sm" c="dimmed">
            Showing {(params.page - 1) * params.pageSize + 1} to {Math.min(params.page * params.pageSize, listPagination.total_count)} of{' '}
            {listPagination.total_count} entries
          </Text>
        )}
      </Group>

      <Pagination size="sm" value={params.page} onChange={handlePageChange} total={listPagination?.total_pages ?? 1} withEdges />
    </Group>
  );
}
